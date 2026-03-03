import { NextRequest } from 'next/server';

export const parse = (req: NextRequest) => {
  let domain = req.headers.get('host') as string;
  let path = req.nextUrl.pathname;

  domain = domain.replace(/^www\./, '').toLowerCase();

  // You can customize this for your own local/preview domain logic
  if (domain === 'localhost:3000' || domain.endsWith('.vercel.app')) {
    domain = 'your-short-domain.com';
  }

  const searchParams = req.nextUrl.searchParams.toString();
  const searchParamsObj = Object.fromEntries(req.nextUrl.searchParams);
  const searchParamsString = searchParams.length > 0 ? `?${searchParams}` : '';
  const fullPath = `${path}${searchParamsString}`;

  const key = decodeURIComponent(path.split('/')[1]);
  const fullKey = decodeURIComponent(path.slice(1));

  return {
    domain,
    path,
    fullPath,
    key,
    fullKey,
    shortLink: `https://${domain}/${fullKey}`,
    searchParamsObj,
    searchParamsString,
  };
};
