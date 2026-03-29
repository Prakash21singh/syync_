import { Adapter } from '@/prisma/generated/prisma/client';
import { GOOGLE_DRIVE_APIS } from '@/utils/config/google-drive-endpoints';
import { dataMapping } from './mapping';
import { BaseFile } from '@/types';
import { DEFAULT_DROPBOX_BODY, DEFAULT_GOOGLE_DRIVE_PARAMS } from '../constant';
import { DROPBOX_APIS } from '@/utils/config/dropbox-endpoints';
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';

async function getGoogleDriveFiles(
  adapter: Adapter,
  queryParams: Record<string, string | number> = {},
): Promise<BaseFile[]> {
  const params = new URLSearchParams({
    ...DEFAULT_GOOGLE_DRIVE_PARAMS,
    ...(queryParams as Record<string, string>),
  }).toString();

  const { url, method } = GOOGLE_DRIVE_APIS['google_drive_list_files'];

  const response = await fetch(`${url}?${params}`, {
    method,
    headers: { Authorization: `Bearer ${adapter.access_token}` },
  });

  if (!response.ok) {
    throw new Error(`Google Drive files fetch failed: ${response.statusText}`);
  }

  const data = await response.json();
  return dataMapping('GOOGLE_DRIVE', data);
}

async function getDropboxFiles(adapter: Adapter): Promise<BaseFile[]> {
  const { method, url } = DROPBOX_APIS['dropbox_get_files'];

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adapter.access_token}`,
    },
    body: JSON.stringify(DEFAULT_DROPBOX_BODY),
  });

  if (!response.ok) {
    throw new Error(`Dropbox files fetch failed: ${response.statusText}`);
  }

  const data = await response.json();
  return dataMapping('DROPBOX', data);
}

interface S3Adapter extends Adapter {
  bucket?: string;
}

async function getS3Files(
  adapter: S3Adapter,
  queryParams = {},
  ctx?: Record<string, string>,
): Promise<BaseFile[]> {
  const client = new S3Client({
    credentials: {
      accessKeyId: adapter?.accessKeyId!,
      secretAccessKey: adapter?.accessKeySecret!,
    },
    region: adapter?.region!,
  });

  const listObjectCmd = new ListObjectsV2Command({
    Bucket: ctx?.bucket,
    Delimiter: '/',
  });

  const response = await client.send(listObjectCmd);

  return dataMapping('AWS_S3', response);
}

type FileFetcher = (
  adapter: Adapter,
  queryParams?: Record<string, string | number>,
  ctx?: Record<string, string>,
) => Promise<BaseFile[]>;

const FILE_FETCHERS: Partial<Record<Adapter['adapter_type'], FileFetcher>> = {
  GOOGLE_DRIVE: getGoogleDriveFiles,
  DROPBOX: getDropboxFiles,
  AWS_S3: getS3Files,
};

export async function getFilesFromAdapter(
  adapter: Adapter,
  queryParams: Record<string, string | number> = {},
  ctx?: {
    bucket: string;
  },
): Promise<BaseFile[]> {
  const fetcher = FILE_FETCHERS[adapter.adapter_type];

  if (!fetcher) {
    throw new Error(`Unsupported adapter type: ${adapter.adapter_type}`);
  }

  return fetcher(adapter, queryParams, ctx);
}
