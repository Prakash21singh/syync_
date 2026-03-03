import { type Metadata } from 'next';

export function constructMetadata({
  title,
  mainTitle,
  description = 'Sync is a lightweight TypeScript tool for reliable data migration across storage systems.',
  keywords = ['data migration', 'typescript', 'sync', 'reliable data migration', 'storage systems'],
}: {
  title?: string;
  mainTitle?: string;
  description?: string;
  keywords?: string[];
}): Metadata {
  return {
    title: mainTitle || (title ? `${title} | Sync` : 'Sync - Reliable Data Migration Tool'),
    description: description,
    keywords: keywords,
  };
}
