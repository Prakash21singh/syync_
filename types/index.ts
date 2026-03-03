// ─── Adapter Types ────────────────────────────────────────────────────────────

export type AdapterType = 'GOOGLE_DRIVE' | 'DROPBOX';
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

export interface StatusMessage {
  type: MessageType;
  message: string;
}

export interface MigrationResponse {
  files: DriveFile[];
  adapter_type: AdapterType;
  incompleteSearch?: boolean;
  kind: string;
  nextPageToken?: string;
  error?: ApiError;
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
