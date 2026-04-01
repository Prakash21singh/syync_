'use client';
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdapter } from '@/hooks/use-adap';
import { AdapterSelector } from './AdapterSelector';
import { EntityPicker } from './EntityPicker';
import { MigrationSummary } from './MigrationSummary';
import { StatusMessage } from './StatusMessage';
import RequireLogin from '../auth/require-login';
import type {
  BaseFile,
  EntityView,
  MigrationResponse,
  StatusMessage as StatusMessageType,
} from '@/types/index';
import { BucketSelection } from './BucketSelection';

interface Props {
  isLoggedIn: boolean;
  userId: string;
  initialAdapters?: any[];
}

export default function AdapterSelection({ isLoggedIn, initialAdapters = [], userId }: Props) {
  const router = useRouter();

  const source = useAdapter('source');
  const dest = useAdapter('destination');

  // Initialize adapters from server data
  useState(() => {
    if (initialAdapters.length > 0) {
      // Could pre-populate adapter state here if needed
    }
  });

  const [showLogin, setShowLogin] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [files, setFiles] = useState<BaseFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<BaseFile[]>([]);
  const [entityView, setEntityView] = useState<EntityView>('grid');
  const [message, setMessage] = useState<StatusMessageType | null>(null);

  // Bucket state grouped to avoid separate re-renders
  const [bucketState, setBucketState] = useState({
    bucket: null as string | null,
    buckets: [] as { name: string }[],
    dialogOpen: false,
  });

  // ─── Derived ──────────────────────────────────────────────────────────────
  const canMigrate = useMemo(
    () =>
      !!source.selectedAdapter &&
      !!dest.selectedAdapter &&
      source.selectedAdapter !== dest.selectedAdapter &&
      source.status === 'valid' &&
      dest.status === 'valid',
    [source.selectedAdapter, source.status, dest.selectedAdapter, dest.status],
  );

  const hasFiles = useMemo(() => files.length > 0, [files]);

  // ─── Entity selection ─────────────────────────────────────────────────────
  const handleEntitySelect = useCallback((file: BaseFile) => {
    setSelectedFiles((prev) =>
      prev.some((f) => f.id === file.id) ? prev.filter((f) => f.id !== file.id) : [...prev, file],
    );
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedFiles.some((f) => f.id === id),
    [selectedFiles],
  );

  // ─── API error handler ────────────────────────────────────────────────────
  const handleApiError = useCallback(
    async (error: MigrationResponse['error']) => {
      if (!error) return;
      if (error.status === 'PERMISSION_DENIED') {
        setMessage({
          type: 'error',
          message: 'Insufficient permissions. Removing adapter — please re-authenticate.',
        });
        try {
          const res = await fetch('/api/migrate/source/adapter', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ adapterId: source.selectedExistingId }),
          });
          const result = await res.json();
          setMessage({
            type: res.ok ? 'success' : 'error',
            message: result.message ?? 'Failed to remove adapter.',
          });
          source.reset();
        } catch {
          setMessage({ type: 'error', message: 'Failed to remove adapter.' });
        }
      }
    },
    [source],
  );

  // ─── Fetch files (extracted so bucket confirm can call it) ────────────────
  const fetchFiles = useCallback(
    async (bucketOverride?: string) => {
      setIsMigrating(true);
      try {
        const res = await fetch('/api/migrate/source/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            sourceAdapterId: source.selectedExistingId,
            destinationAdapterId: dest.selectedExistingId,
            bucket: bucketOverride ?? bucketState.bucket,
          }),
        });

        if (!res.ok) throw new Error('Failed to fetch files');

        const data: MigrationResponse = await res.json();

        if (data.error) {
          await handleApiError(data.error);
          return;
        }

        setFiles(data.files);
      } catch (err) {
        setMessage({
          type: 'error',
          message: err instanceof Error ? err.message : 'Failed to fetch files.',
        });
      } finally {
        setIsMigrating(false);
      }
    },
    [source.selectedExistingId, dest.selectedExistingId, bucketState.bucket, handleApiError],
  );

  // ─── Bucket confirm ───────────────────────────────────────────────────────
  const handleBucketConfirm = useCallback(
    (bucketName: string) => {
      setBucketState((prev) => ({
        ...prev,
        bucket: bucketName,
        dialogOpen: false,
      }));
      fetchFiles(bucketName); // pass directly to avoid stale closure
    },
    [fetchFiles],
  );

  const handleBucketClose = useCallback(() => {
    setBucketState((prev) => ({ ...prev, dialogOpen: false }));
  }, []);

  // ─── Fetch files (public, with S3 bucket guard) ───────────────────────────
  const handleFetchFiles = useCallback(async () => {
    if (!canMigrate) return;

    if (source.selectedAdapter === 'Amazon S3' && !bucketState.bucket) {
      setBucketState((prev) => ({ ...prev }));
      try {
        const res = await fetch('/api/s3/buckets', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({ sourceAdapterId: source.selectedExistingId }),
        });
        if (!res.ok) throw new Error('Failed to fetch buckets');
        const result = await res.json();
        setBucketState((prev) => ({
          ...prev,
          buckets: result.buckets,
          dialogOpen: true,
        }));
      } catch (error) {
        console.error(error);
        setBucketState((prev) => ({ ...prev }));
      }
      return;
    }

    await fetchFiles();
  }, [canMigrate, source.selectedAdapter, source.selectedExistingId, bucketState, fetchFiles]);

  // ─── Start migration ──────────────────────────────────────────────────────
  const handleMigrate = useCallback(async () => {
    if (!canMigrate) return;
    setIsMigrating(true);
    try {
      const formData = new FormData();
      formData.append('sourceAdapterId', source.selectedExistingId!);
      formData.append('destAdapterId', dest.selectedExistingId!);
      formData.append('userId', userId);
      formData.append('selectedFiles', JSON.stringify(selectedFiles));
      if (bucketState.bucket) {
        formData.append('bucket', bucketState.bucket);
      }

      const { startMigration } = await import('@/app/actions');
      const result = await startMigration(formData);

      if (result.success) {
        setMessage({ type: 'success', message: 'Migration started! Redirecting in 3 seconds...' });
        setTimeout(() => router.push(`/sync/${result.migrationId}`), 3000);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        message: err instanceof Error ? err.message : 'Migration failed.',
      });
    } finally {
      setIsMigrating(false);
    }
  }, [
    canMigrate,
    source.selectedExistingId,
    dest.selectedExistingId,
    selectedFiles,
    userId,
    bucketState.bucket,
    router,
  ]);

  // ─── Guard: require login ─────────────────────────────────────────────────
  const handleAdapterSelect = useCallback(
    (adapterName: string, role: 'source' | 'destination') => {
      if (!isLoggedIn) {
        setShowLogin(true);
        return;
      }
      role === 'source' ? source.selectAdapter(adapterName) : dest.selectAdapter(adapterName);
    },
    [isLoggedIn, source, dest],
  );

  const handleSourceSelect = useCallback(
    async (name: string) => handleAdapterSelect(name, 'source'),
    [handleAdapterSelect],
  );

  const handleDestSelect = useCallback(
    async (name: string) => await handleAdapterSelect(name, 'destination'),
    [handleAdapterSelect],
  );

  const handleBack = useCallback(() => setShowLogin(false), []);

  // ─── Render ───────────────────────────────────────────────────────────────
  if (showLogin) {
    return (
      <div className="w-full h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-4xl p-6">
          <RequireLogin onBack={handleBack} />
        </div>
      </div>
    );
  }

  return (
    <>
      <BucketSelection
        open={bucketState.dialogOpen}
        buckets={bucketState.buckets}
        onConfirm={handleBucketConfirm}
        onClose={handleBucketClose}
      />
      <div className="w-full h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          {/* ── Adapter row ── */}
          <div className="flex items-start justify-between gap-2">
            <AdapterSelector
              role="source"
              adapter={{ ...source, selectAdapter: handleSourceSelect }}
              disabledAdapter={dest.selectedAdapter}
            />

            <div className="flex items-center justify-center flex-shrink-0" />

            <AdapterSelector
              role="destination"
              adapter={{ ...dest, selectAdapter: handleDestSelect }}
              disabledAdapter={source.selectedAdapter}
            />
          </div>

          <StatusMessage message={message} />

          <EntityPicker
            files={files}
            view={entityView}
            onViewChange={setEntityView}
            isSelected={isSelected}
            onSelect={handleEntitySelect}
          />

          <MigrationSummary
            sourceAdapter={source.selectedAdapter}
            destinationAdapter={dest.selectedAdapter}
            canMigrate={canMigrate}
            isMigrating={isMigrating}
            hasFiles={hasFiles}
            onFetchFiles={handleFetchFiles}
            onMigrate={handleMigrate}
          />
        </div>
      </div>
    </>
  );
}
