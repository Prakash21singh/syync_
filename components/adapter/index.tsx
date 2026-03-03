'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAdapter } from '@/hooks/use-adap';
import { AdapterSelector } from './AdapterSelector';
import { EntityPicker } from './EntityPicker';
import { MigrationSummary } from './MigrationSummary';
import { StatusMessage } from './StatusMessage';
import RequireLogin from '../auth/require-login';
import type {
  DriveFile,
  EntityView,
  MigrationResponse,
  StatusMessage as StatusMessageType,
} from '@/types/index';

interface Props {
  isLoggedIn: boolean;
  userId: string;
}

export default function AdapterSelection({ isLoggedIn }: Props) {
  const router = useRouter();

  // ─── One hook per role ──────────────────────────────────────────────────────
  const source = useAdapter('source');
  const dest = useAdapter('destination');

  // ─── Migration state ────────────────────────────────────────────────────────
  const [showLogin, setShowLogin] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<DriveFile[]>([]);
  const [entityView, setEntityView] = useState<EntityView>('list');
  const [message, setMessage] = useState<StatusMessageType | null>(null);

  // ─── Derived ─────────────────────────────────────────────────────────────────
  const canMigrate =
    !!source.selectedAdapter &&
    !!dest.selectedAdapter &&
    source.selectedAdapter !== dest.selectedAdapter &&
    source.status === 'valid' &&
    dest.status === 'valid';

  // ─── Entity selection ────────────────────────────────────────────────────────
  const handleEntitySelect = (file: DriveFile) => {
    setSelectedFiles((prev) =>
      prev.some((f) => f.id === file.id) ? prev.filter((f) => f.id !== file.id) : [...prev, file],
    );
  };

  console.log(selectedFiles)

  const isSelected = (id: string) => selectedFiles.some((f) => f.id === id);

  // ─── Fetch source files ───────────────────────────────────────────────────
  const handleFetchFiles = async () => {
    if (!canMigrate) return;
    setIsMigrating(true);
    try {
      const res = await fetch('/api/migrate/source/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          sourceAdapterId: source.selectedExistingId,
          destinationAdapterId: dest.selectedExistingId,
        }),
      });

      if (!res.ok) throw new Error('Failed to fetch files');

      const data: MigrationResponse = await res.json();

      if (data.error) {
        await handleApiError(data.error);
        return;
      }

      if (data.adapter_type === 'GOOGLE_DRIVE') {
        setFiles(data.files);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to fetch files.',
      });
    } finally {
      setIsMigrating(false);
    }
  };

  // ─── Start migration ──────────────────────────────────────────────────────
  const handleMigrate = async () => {
    if (!canMigrate) return;
    setIsMigrating(true);
    try {
      const res = await fetch('/api/migrate/source/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          sourceAdapterId: source.selectedExistingId,
          destAdapterId: dest.selectedExistingId,
          selectedFiles,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result?.message ?? 'Failed to migrate');

      setMessage({ type: 'success', message: 'Migration started! Redirecting in 3 seconds...' });
      setTimeout(() => router.push(`/sync/${result.migration.id}`), 3000);
    } catch (err) {
      setMessage({
        type: 'error',
        message: err instanceof Error ? err.message : 'Migration failed.',
      });
    } finally {
      setIsMigrating(false);
    }
  };

  // ─── API error handler ────────────────────────────────────────────────────
  const handleApiError = async (error: MigrationResponse['error']) => {
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
  };

  // ─── Guard: require login ─────────────────────────────────────────────────
  const handleAdapterSelect = async (adapterName: string, role: 'source' | 'destination') => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    role === 'source' ? source.selectAdapter(adapterName) : dest.selectAdapter(adapterName);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  if (showLogin) {
    return (
      <div className="w-full h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-4xl p-6">
          <RequireLogin onBack={() => setShowLogin(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        {/* ── Adapter row ── */}
        <div className="flex items-center justify-center gap-2">
          <AdapterSelector
            role="source"
            adapter={{ ...source, selectAdapter: (name) => handleAdapterSelect(name, 'source') }}
            disabledAdapter={dest.selectedAdapter}
          />

          <div className="flex items-center justify-center flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="Sync Logo"
              width={50}
              height={50}
              className="w-24 animate-out text-primary"
            />
          </div>

          <AdapterSelector
            role="destination"
            adapter={{ ...dest, selectAdapter: (name) => handleAdapterSelect(name, 'destination') }}
            disabledAdapter={source.selectedAdapter}
          />
        </div>

        {/* ── Notice when both selected but no files yet ── */}
        {source.selectedAdapter && dest.selectedAdapter && !files.length && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              Ensure the source and destination adapters are correct before proceeding.
            </p>
          </div>
        )}

        {/* ── Status message ── */}
        <StatusMessage message={message} />

        {/* ── Entity picker ── */}
        <EntityPicker
          files={files}
          view={entityView}
          onViewChange={setEntityView}
          isSelected={isSelected}
          onSelect={handleEntitySelect}
        />

        {/* ── Migration summary + CTA ── */}
        <MigrationSummary
          sourceAdapter={source.selectedAdapter}
          destinationAdapter={dest.selectedAdapter}
          canMigrate={canMigrate}
          isMigrating={isMigrating}
          hasFiles={files.length > 0}
          onFetchFiles={handleFetchFiles}
          onMigrate={handleMigrate}
        />
      </div>
    </div>
  );
}
