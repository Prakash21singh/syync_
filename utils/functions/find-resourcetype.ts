export function findResouceType(
  sourceAdapterType: string,
  file: {
    mimeType: string;
    id: string;
  },
): 'FILE' | 'FOLDER' {
  if (sourceAdapterType === 'GOOGLE_DRIVE') {
    return file.mimeType === 'application/vnd.google-apps.folder' ? 'FOLDER' : 'FILE';
  }
  if (sourceAdapterType === 'DROPBOX') {
    return file.mimeType === 'folder' ? 'FOLDER' : 'FILE';
  }
  if (sourceAdapterType === 'ONEDRIVE') {
    return file.mimeType === 'application/vnd.microsoft.folder' ? 'FOLDER' : 'FILE';
  }
  if (sourceAdapterType === 'ICLOUD') {
    return file.mimeType === 'public.folder' ? 'FOLDER' : 'FILE';
  }
  if (sourceAdapterType === 'AMAZON_S3') {
    // S3 doesn't have real folders, but we can treat keys ending with '/' as folders
    return file.id.endsWith('/') ? 'FOLDER' : 'FILE';
  }
  return 'FILE';
}
