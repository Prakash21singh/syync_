import { GOOGLE_API_ENDPOINTS } from '@/utils/config/google-endpoint';

export async function rotateGoogleDriveToken(refreshToken: string): Promise<{
  access_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
} | null> {
  try {
    const response = await fetch(GOOGLE_API_ENDPOINTS.refresh_token, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      console.error('Failed to rotate Google Drive token:', await response.text());
      return null;
    }

    const data = await response.json();
    return {
      access_token: data.access_token,
      expires_in: data.expires_in,
      token_type: data.token_type,
      scope: data.scope,
    };
  } catch (error) {
    console.error('Error rotating Google Drive token:', error);
    return null;
  }
}
