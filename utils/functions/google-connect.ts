export function getGoogleOAuthURL() {
  const rootUrl =
    process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENDPOINT || 'https://accounts.google.com/o/oauth2/v2/auth';

  const options = {
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/google/callback`,
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/drive',
    ].join(' '),
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
}

export function getGoogleOAuthTokenURL() {
  return (
    process.env.NEXT_PUBLIC_GOOGLE_OAUTH_TOKEN_ENDPOINT || 'https://oauth2.googleapis.com/token'
  );
}

export function getGoogleUserInfoURL() {
  return (
    process.env.NEXT_PUBLIC_GOOGLE_USERINFO_ENDPOINT ||
    'https://www.googleapis.com/oauth2/v3/userinfo'
  );
}
