"use client";
import { MigrationStatus } from "@/prisma/generated/prisma/enums";
import Image from "next/image";

 
export function Adapter({
    adapter_type,
    name,
    status
  }: {
    name: string;
    adapter_type: 'GOOGLE_DRIVE' | 'DROPBOX';
    status: MigrationStatus
  }) {
    const adapterImgPath = adapter_type === 'DROPBOX' ? '/icons/dropbox.svg' : '/icons/drive.svg';

    return (
      <div className={`flex flex-col w-full items-center`}>
        <div
          className={`
            w-16 h-16 bg-secondary rounded-lg flex items-center justify-center border border-border
          `}
        >
          <Image
            src={adapterImgPath}
            alt={adapter_type}
            width={100}
            height={100}
            className="w-9"
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">Source</p>
          <p className="text-xs text-muted-foreground">{name}</p>
        </div>
      </div>
    );
  }


