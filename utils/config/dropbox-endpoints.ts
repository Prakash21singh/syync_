interface DropboxEndpoint {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  url: string;
}

type KeyEntry = 'dropbox_get_files';

export const DROPBOX_APIS: Record<KeyEntry, DropboxEndpoint> = {
  dropbox_get_files: {
    method: 'POST',
    url: process.env.DROPBOX_FILES_URL!,
  },
};
