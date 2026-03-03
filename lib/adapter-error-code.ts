type AdapterErrorCode = Record<string, Record<number, Record<string, string> | string>>;

export const adapterErrorCode: AdapterErrorCode = {
  DROPBOX: {
    400: {
      invalid_access_token: 'The access token provided is invalid.',
      invalid_select_user: 'The specified user is not a member of the team.',
      invalid_select_admin: 'The specified admin is not a member of the team.',
      user_suspended: 'The specified user is suspended.',
      expired_access_token: 'The access token has expired.',
      route_access_denied: "The route is not allowed for the access token's app.",
    },
    401: {
      no_team_api_access: "The app doesn't have access to the team.",
      invalid_team_auth_header: 'The authentication header is invalid.',
    },
    403: "Forbidden - The access token doesn't have the necessary permissions.",
    404: "Not Found - The requested resource doesn't exist.",
    409: 'Conflict - The request conflicts with the current state of the server.',
    429: 'Too Many Requests - Too many requests hit the API too quickly.',
    500: 'Internal Server Error - We had a problem with our server. Try again later.',
    503: "Service Unavailable - We're temporarily offline for maintenance. Please try again later.",
  },
};
