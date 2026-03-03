import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Cloud, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import CloudSync from '@/components/custom/could-sync';

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

  const isInvalid = !migration.sourceAdapter || !migration.destinationAdapter;

  const migrationStatus =
    migration.status === 'PENDING'
      ? 'is Pending'
      : migration.status === 'SUCCESS'
        ? 'is Complete'
        : migration.status === 'RETRY'
          ? 'is in Process'
          : 'is Failed';

  return (
    <div className="mx-auto h-screen flex items-center justify-center  max-w-3xl px-4 py-10 space-y-8">
      <div className="w-full">
        {/* Header */}
        <div className="space-y-2">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Data Migration</h1>
            <p className="text-muted-foreground">Your files are being transferred securely</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-10">
          <Adapter
            key={migration.sourceAdapter.id}
            adapter_type={migration.sourceAdapter.adapter_type}
            name={migration.sourceAdapter.name!}
          />

          <div className="flex-1 flex justify-center px-4">
            <div className="flex items-center gap-2">
              {migration.status === 'PENDING' ? (
                <CloudSync />
              ) : (
                <>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent to-primary"></div>
                  <ArrowRight className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1 h-0.5 bg-gradient-to-l from-transparent to-primary"></div>
                </>
              )}
            </div>
          </div>

          <Adapter
            key={migration.destinationAdapter.id}
            adapter_type={migration.destinationAdapter.adapter_type}
            name={migration.destinationAdapter.name}
          />
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

function Adapter({
  adapter_type,
  name,
}: {
  name: string;
  adapter_type: 'GOOGLE_DRIVE' | 'DROPBOX';
}) {
  const adapterImgPath = adapter_type === 'DROPBOX' ? '/icons/dropbox.svg' : '/icons/drive.svg';

  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center border border-border">
        <Image src={adapterImgPath} alt={adapter_type} width={100} height={100} className="w-9" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">Source</p>
        <p className="text-xs text-muted-foreground">{name}</p>
      </div>
    </div>
  );
}
