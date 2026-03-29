export const DEFAULT_GOOGLE_DRIVE_PARAMS = {
  corpora: 'user',
  driveId: '',
  includeItemsFromAllDrives: 'false',
  supportsAllDrives: 'false',
  q: "'root' in parents and trashed=false",
  orderBy: 'createdTime desc',
  fields:
    'nextPageToken, files(id,name,mimeType,size,createdTime,modifiedTime,parents,webViewLink,iconLink,hasThumbnail,thumbnailLink)',
};

export const DEFAULT_DROPBOX_BODY = {
  include_deleted: false,
  include_has_explicit_shared_members: false,
  include_media_info: false,
  include_mounted_folders: true,
  include_non_downloadable_files: true,
  path: '',
  recursive: false,
};
