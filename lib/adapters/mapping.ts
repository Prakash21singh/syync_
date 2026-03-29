import { AdapterType, BaseFile, DriveFile, DropboxFile } from '@/types';
import { _Object, CommonPrefix } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

export async function dataMapping(adapterType: AdapterType, data: any) {
  let files: BaseFile[] = [];

  if (adapterType === 'GOOGLE_DRIVE') {
    files = data.files.map((file: DriveFile) => {
      let data = {
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        preview: file.iconLink || file.thumbailLink,
        type: file.mimeType === 'application/vnd.google-apps.folder' ? 'folder' : 'file',
        size: file.size ? Number(file.size) : null,
      };
      return data;
    });
  } else if (adapterType === 'DROPBOX') {
    files = data.entries.map((entry: DropboxFile) => {
      let data: BaseFile = {
        id: entry.id,
        name: entry.name,
        size: entry.size ? Number(entry.size) : null,
        type: entry['.tag'] === 'folder' ? 'folder' : 'file',
        preview: entry['.tag'] === 'folder' ? '/dropbox/folder.png' : '/file.svg',
        pathname: entry.path_display,
      };
      return data;
    });
  } else if (adapterType === 'AWS_S3') {
    let object = data.Contents?.map((content: _Object) => {
      return {
        id: content.ETag,
        name: content.Key,
        size: content.Size,
        type: 'file',
        pathname: content.Key,
        preview: '/file.svg',
      } as BaseFile;
    });

    let folders = data.CommonPrefixes.map((prefix: CommonPrefix) => {
      return {
        id: randomUUID(),
        name: prefix.Prefix,
        size: 0,
        type: 'folder',
        preview: '/dropbox/folder.png',
      } as BaseFile;
    });

    files = [...folders, ...object];
  }

  return files;
}
