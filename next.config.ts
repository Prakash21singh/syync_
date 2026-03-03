import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
      {
        protocol: 'https',
        hostname: 'dl-web.dropbox.com',
        port: '',
        pathname: '/account_photo/get/**',
      },
      {
        protocol: 'https',
        hostname: 'drive-thirdparty.googleusercontent.com',
        port: '',
        pathname: '/16/**',
      },
    ],
  },
};

export default nextConfig;
