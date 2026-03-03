interface GoogleDriveEndpoint {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  url: string;
}

// Static endpoints (no placeholders)
export const GOOGLE_DRIVE_STATIC_APIS: Record<string, GoogleDriveEndpoint> = {
  google_drive_about: {
    method: 'GET',
    url: `${process.env.GOOGLE_DRIVE_API_BASE_URL}/drive/v3/about`,
  },
  google_drive_create_drive: {
    method: 'POST',
    url: `${process.env.GOOGLE_DRIVE_API_BASE_URL}/drive/v3/drives`,
  },
  google_drive_lists: {
    method: 'GET',
    url: `${process.env.GOOGLE_DRIVE_API_BASE_URL}/drive/v3/drives`,
  },
  google_drive_list_files: {
    method: 'GET',
    url: `${process.env.GOOGLE_DRIVE_API_BASE_URL}/drive/v3/files`,
  },
};

// Dynamic endpoints (with placeholders like {fileId}, {driveId}, etc.)
export const GOOGLE_DRIVE_DYNAMIC_APIS: Record<string, GoogleDriveEndpoint> = {
  google_drive_upload_file: {
    method: 'POST',
    url: `${process.env.GOOGLE_DRIVE_API_BASE_URL}/upload/drive/v3/files`,
  },
  google_drive_update_file: {
    method: 'PATCH',
    url: `${process.env.GOOGLE_DRIVE_API_BASE_URL}/drive/v3/files/{fileId}`,
  },
  google_drive_download_file: {
    method: 'GET',
    url: `${process.env.GOOGLE_DRIVE_API_BASE_URL}/drive/v3/files/{fileId}/download`,
  },
  google_drive_delete_file: {
    method: 'DELETE',
    url: `${process.env.GOOGLE_DRIVE_API_BASE_URL}/drive/v3/files/{fileId}`,
  },
};

// Merged API endpoints (all endpoints)
export const GOOGLE_DRIVE_APIS: Record<string, GoogleDriveEndpoint> = {
  ...GOOGLE_DRIVE_STATIC_APIS,
  ...GOOGLE_DRIVE_DYNAMIC_APIS,
};

/**
 * Helper function to resolve dynamic URLs by replacing placeholders
 * @param endpointKey - The key of the endpoint in GOOGLE_DRIVE_DYNAMIC_APIS
 * @param params - Object with placeholder values (e.g., { fileId: 'abc123' })
 * @returns The resolved URL with placeholders replaced
 */
export const resolveDynamicUrl = (
  endpointKey: string,
  params: Record<string, string | number>,
): string => {
  const endpoint = GOOGLE_DRIVE_DYNAMIC_APIS[endpointKey];
  if (!endpoint) {
    throw new Error(`Dynamic endpoint "${endpointKey}" not found`);
  }

  let resolvedUrl = endpoint.url;
  Object.entries(params).forEach(([key, value]) => {
    resolvedUrl = resolvedUrl.replace(`{${key}}`, String(value));
  });

  return resolvedUrl;
};
