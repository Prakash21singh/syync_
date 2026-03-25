interface AdapterConfig {
  type: 'cloud_storage';
  name: string;
  icon: string;
  description: string;
  connectionUrl: string;
  documentationUrl?: string;
  isActive?: boolean;
  adapterName: 'GOOGLE_DRIVE' | 'DROPBOX' | 'ONEDRIVE' | 'ICLOUD' | 'AMAZON_S3' | 'GOOGLE_PHOTOS';
}

export const ADAPTERS: AdapterConfig[] = [
  {
    type: 'cloud_storage',
    name: 'Google Drive',
    icon: '/icons/drive.svg',
    description: 'Sync your data with Google Drive for seamless access and backup.',
    connectionUrl: '/connect/google-drive',
    documentationUrl: 'https://docs.sync.com/integrations/google-drive',
    adapterName: 'GOOGLE_DRIVE',
  },
  {
    type: 'cloud_storage',
    name: 'Dropbox',
    icon: '/icons/dropbox.svg',
    description: 'Connect to Dropbox to keep your files in sync across all devices.',
    connectionUrl: '/connect/dropbox',
    documentationUrl: 'https://docs.sync.com/integrations/dropbox',
    adapterName: 'DROPBOX',
  },
  {
    type: 'cloud_storage',
    name: 'Amazon S3',
    icon: '/icons/s3.svg',
    description: 'Integrate with Amazon S3 for scalable cloud storage and synchronization.',
    connectionUrl: '/connect/amazon-s3',
    documentationUrl: 'https://docs.sync.com/integrations/amazon-s3',
    adapterName: 'AMAZON_S3',
  },
  {
    type: 'cloud_storage',
    name: 'OneDrive',
    icon: '/icons/onedrive.svg',
    description: 'Integrate with OneDrive for easy file synchronization and access.',
    connectionUrl: '/connect/onedrive',
    documentationUrl: 'https://docs.sync.com/integrations/onedrive',
    isActive: false,
    adapterName: 'ONEDRIVE',
  },
  {
    type: 'cloud_storage',
    name: 'iCloud',
    icon: '/icons/icloud.svg',
    description: 'Connect to iCloud to keep your Apple ecosystem in sync effortlessly.',
    connectionUrl: '/connect/icloud',
    documentationUrl: 'https://docs.sync.com/integrations/icloud',
    isActive: false,
    adapterName: 'ICLOUD',
  },
  {
    type: 'cloud_storage',
    name: 'Google Photos',
    icon: '/icons/google-photos.svg',
    description: 'Sync your photos and videos with Google Photos for easy access and backup.',
    connectionUrl: '/connect/google-photos',
    documentationUrl: 'https://docs.sync.com/integrations/google-photos',
    isActive: false,
    adapterName: 'GOOGLE_PHOTOS',
  },
];
