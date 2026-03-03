export const GOOGLE_API_ENDPOINTS = {
  refresh_token: `${process.env.GOOGLE_OAUTH_BASE_URL}/token`,
  validate_token: `${process.env.GOOGLE_OAUTH_BASE_URL}/tokeninfo?access_token=`,
};
