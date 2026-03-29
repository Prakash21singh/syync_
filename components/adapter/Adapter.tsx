'use client';
import { getAdapterImage } from '@/lib/utils';
import { MigrationStatus } from '@/prisma/generated/prisma/enums';
import { AdapterType } from '@/types';
import Image from 'next/image';

export function Adapter({
  adapter_type,
  name,
  status,
  type,
}: {
  type: "SOURCE" | "DESTINATION";
  name: string;
  adapter_type: AdapterType;
  status: MigrationStatus;
}) {

  return (
    <div className={`flex flex-col w-full items-center`}>
      <div
        className={`
            w-16 h-16 bg-secondary rounded-lg flex items-center justify-center border border-border
          `}
      >
        <Image 
          src={getAdapterImage(adapter_type)} 
          alt={adapter_type} 
          width={100} 
          height={100} 
          className="w-9" 
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          {type === 'SOURCE' ? 'Source' : 'Destination'}
        </p>
        <p className="text-xs text-muted-foreground">{name}</p>
      </div>
    </div>
  );
}
