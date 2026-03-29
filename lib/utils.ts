import { Adapter, MigrationSelection } from '@/prisma/generated/prisma/client';
import { AdapterType } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';


export function getAdapterImage(adapter_type: AdapterType){
  switch(adapter_type){
    case "AWS_S3":
      return "/icons/s3.svg";
    case "DROPBOX":
      return "/icons/dropbox.svg";
    case "GOOGLE_DRIVE":
      return "/icons/drive.svg"
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shouldSkip(adapter_type: AdapterType) {
  if (adapter_type === 'AWS_S3') return true;
  return false;
}

export function isTokenExpiringSoon(expiresIn: Date, bufferMs: number = 2 * 60 * 1000): boolean {
  const expiresInMs = new Date(expiresIn).getTime();
  const nowWithBuffer = Date.now() + bufferMs;
  return expiresInMs <= nowWithBuffer;
}

export async function doesRequireTokenRotation(adapter: Partial<Adapter>): Promise<boolean> {
  if (shouldSkip(adapter.adapter_type!)) return false;
  if (!adapter.expires_in) return false;

  return isTokenExpiringSoon(adapter.expires_in);
}

export function normalizeName(name:string){
  if(name.lastIndexOf(".") !== -1){
      return name.slice(0, name.lastIndexOf("."))
  }else if(name.endsWith("/")){
      return name.slice(0, -1)
  } else{
      return name;
  }
}

export function normalizeFileSelection(files:any[]){
  return files.map((file)=> ({
    sourceId:file.id,
    name: normalizeName(file.name),
    path: file.pathname,
    size:file.size?.toString(),
    type: file.type.toUpperCase() as "FILE" | "FOLDER",
    mimeType: file.mimeType
  }))
}
