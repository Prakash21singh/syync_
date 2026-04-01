'use client';
import React from 'react';
import motion from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type Props = {
  startIndex?: number;
  endIndex?: number;
};

const ADAPTER_BLOCKS = [
  { id: 'google-drive', name: 'Google Drive', icon: '/icons/drive.svg' },
  { id: 'dropbox', name: 'Dropbox', icon: '/icons/dropbox.svg' },
  { id: 's3', name: 'Amazon S3', icon: '/icons/s3.svg' },
  { id: 'onedrive', name: 'OneDrive', icon: '/icons/onedrive.svg' },
  { id: 'icloud', name: 'iCloud', icon: '/icons/icloud.svg' },
  { id: 'google-photos', name: 'Google Photos', icon: '/icons/google-photos.svg' },
];
function AdapterBlocks({ startIndex = 0, endIndex = ADAPTER_BLOCKS.length }: Props) {
  return (
    <div
      className="relative flex justify-end items-center"
      style={{ height: 48, width: ADAPTER_BLOCKS.length * 20 + 28 }}
    >
      {ADAPTER_BLOCKS.slice(startIndex, endIndex).map((adapter, index) => (
        <div
          key={adapter.id}
          className="absolute w-8 h-8"
          style={{
            left: index * 20,
            zIndex: ADAPTER_BLOCKS.length - index,
            rotate: `${index * 5 - 5}deg`,
          }}
        >
          <Image
            src={adapter.icon}
            alt={`${adapter.name} icon`}
            fill
            className={cn(
              'rounded-md border border-gray-300 bg-white p-2 shadow-sm object-contain',
              'transition-transform duration-300 ease-in-out',
              'hover:scale-110 hover:shadow-lg',
              'cursor-pointer',
            )}
          />
        </div>
      ))}
    </div>
  );
}
export default AdapterBlocks;
