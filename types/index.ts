// ─── Adapter Types ────────────────────────────────────────────────────────────

export type AdapterType = 'GOOGLE_DRIVE' | 'DROPBOX' | 'AWS_S3';
export type AdapterRole = 'source' | 'destination';
export type AdapterStatus = 'idle' | 'validating' | 'valid' | 'requires_reauth' | 'error';
export type EntityView = 'list' | 'grid';
export type MessageType = 'error' | 'success' | 'info' | 'warning';

export interface AdapterAccountInfo {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface SessionInterface {
  user:{
    id:string
  }
}

export interface Adapter {
  id: string;
  name: string;
  access_token: string | null;
  refresh_token: string | null;
  expires_in: Date | null;
  refresh_token_expires_in: Date | null;
  token_type: string | null;
  adapter_type: AdapterType;
  adapterAccountInfo: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
}
export interface ExistingAdapter {
  id: string;
  adapter_type: AdapterType;
  name: string;
  adapterAccountInfo: AdapterAccountInfo;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  kind: string;
  webViewLink: string;
  iconLink: string;
  hasThumbnail: boolean;
  thumbailLink?: string;
  size: number;
}

export interface BaseFile {
  id: string;
  name: string;
  mimeType?: string;
  preview?: string;
  type: 'folder' | 'file';
  size: string | number | null;
  pathname?: string;
}
export interface DropboxFile {
  id: string;
  '.tag': 'folder' | 'file';
  name: string;
  path_display: string;
  path_lower: string;
  size?: number;
}

export interface StatusMessage {
  type: MessageType;
  message: string;
}

export interface MigrationResponse {
  files: BaseFile[];
  adapter_type: AdapterType;
  error?: ApiError;
}

export interface StandardResponse {
  files: any[];
  adapter_type: AdapterType;
  token?: string;
  has_more: boolean;
}

export interface ApiError {
  code: number;
  details: any[];
  errors: {
    domain: string;
    message: string;
    reason: string;
  }[];
  message: string;
  status: string;
}

export interface GoogleTokenExchangeResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
  refresh_token_expires_in: number;
}

export interface DecodedGoogleAuthIDToken {
  iss: string;
  sub: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export type AWSCredentials = {
  accessKeyId: string;
  secretAccessKey: string;
  region?: string;
};
