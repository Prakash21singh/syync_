export function getDropboxAuthUrl() {
  const clientId = process.env.NEXT_PUBLIC_DROPBOX_APP_KEY;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/dropbox/callback`;
  const response_type = 'code';
  const token_access_type = 'offline';
  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: clientId!,
    redirect_uri: redirectUri,
    response_type,
    token_access_type,
    state,
  });

  return `https://www.dropbox.com/oauth2/authorize?${params.toString()}`;
}

export function getDropboxOAuthTokenURL() {
  return (
    process.env.NEXT_PUBLIC_DROPBOX_OAUTH_TOKEN_ENDPOINT ||
    'https://api.dropboxapi.com/oauth2/token'
  );
}

export function getDropbboxUserAccountInfoURL() {
  return (
    process.env.NEXT_PUBLIC_DROPBOX_USER_INFO_URL ||
    'https://api.dropboxapi.com/2/users/get_current_account'
  );
}
