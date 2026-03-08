import { MigrationStatus as MigStatus } from '@/prisma/generated/prisma/enums';
import React from 'react';
import FileSerializationAnimation from '../file-serialization';
import { MigrationCompleted } from '../migration-completed';

type Props = {
  status: MigStatus;
};

function MigrationStatus({ status }: Props) {
  if (status === 'PENDING')
    return (
      <>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full  border-amber-600 border-2 flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-amber-600 block animate-pulse" />
          </div>
          <h1 className="text-xl mt-3 font-bold text-gray-600">Pending</h1>
          <p className="text-xs font-thin text-shadow-muted">Migration process initiated</p>
        </div>
      </>
    );

  if (status === 'DISCOVERING')
    return (
      <FileSerializationAnimation title="Discovering" description="Files getting serialized" />
    );

  if (status === 'TRANSFERRING')
    return <FileSerializationAnimation title="Transferring" description="Transferring all files" />;

  if (status === 'COMPLETED') return <MigrationCompleted />;
  return <div>MigrationStatus</div>;
}

export default MigrationStatus;
