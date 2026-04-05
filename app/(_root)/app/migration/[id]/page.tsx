import prisma from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Cloud } from 'lucide-react';
import Image from 'next/image';
import { Adapter } from '@/components/adapter/Adapter';
import MigrationStatus from '@/components/migration/MigrationStatus';

type Props = {
  params: Promise<{ id: string }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default async function SyncPageById({ params }: Props) {
  const migrationId = (await params).id;

  if (!migrationId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <EmptyState title="Invalid Migration" />
      </div>
    );
  }

  const migration = await prisma.migration.findUnique({
    where: { id: migrationId },
    select: {
      id: true,
      status: true,
      createdAt: true,
      sourceAdapter: {
        select: {
          id: true,
          adapter_type: true,
          name: true,
        },
      },
      totalFiles: true,
      completedFiles: true,
      failedFiles: true,
      destinationAdapter: {
        select: {
          id: true,
          adapter_type: true,
          name: true,
        },
      },
    },
  });

  if (!migration) {
    return (
      <div className="flex h-screen items-center justify-center">
        <EmptyState title="Migration not found" />
      </div>
    );
  }

  return (
    <div className="mx-auto h-screen font-sarabun flex items-center justify-center  max-w-3xl px-4 py-10 space-y-8">
      <div className="w-full">
        {/* Header */}
        <div className="space-y-2">
          <div className="mb-12 text-center">
            <Image src={'/logo.svg'} alt="Sync Logo" width={100} height={50} className="mx-auto " />
            <h1 className="text-4xl font-bold text-foreground mb-2">Data Migration</h1>
            <p className="text-muted-foreground">Your files are being transferred securely</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-10">
          <Adapter
            type="SOURCE"
            status={migration.status}
            key={migration.sourceAdapter.id}
            adapter_type={migration.sourceAdapter.adapter_type}
            name={migration.sourceAdapter.name!}
          />

          <div className="w-full flex justify-center px-4">
            <MigrationStatus status={migration.status} />
          </div>

          <Adapter
            type="DESTINATION"
            status={migration.status}
            key={migration.destinationAdapter.id}
            adapter_type={migration.destinationAdapter.adapter_type}
            name={migration.destinationAdapter.name}
          />
        </div>

        <div className="flex items-center justify-center">
          <div>
            <Badge variant="default" className="text-sm">
              Created on {formatDate(migration.createdAt)}
            </Badge>
            <p className="text-sm text-center text-muted-foreground mt-2">
              Total files: {migration.totalFiles}
            </p>
            {migration.status === 'COMPLETED' || migration.status === 'FAILED' ? (
              <p className="text-sm text-center text-muted-foreground mt-1">
                Completed: {migration.completedFiles} / Failed: {migration.failedFiles}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="text-center space-y-3">
      <Cloud className="mx-auto h-10 w-10 text-muted-foreground" />
      <h2 className="text-lg font-medium">{title}</h2>
    </div>
  );
}
