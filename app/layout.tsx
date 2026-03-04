import { Montserrat, Poppins, Sarabun } from 'next/font/google';
import './globals.css';
import { constructMetadata } from '@/utils/functions/construct-metadata';
import { ThemeProvider } from '@/provider/theme-provider';
import FloatingSidebar from '@/components/layout/app/floating-sidebar';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const sarabun = Poppins({
  variable: '--font-sarabun',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = constructMetadata({
  title: 'Home | Sync',
  description:
    "Welcome to Sync, your all-in-one solution for seamless data synchronization across platforms. Experience effortless connectivity and real-time updates with Sync's powerful features. Stay connected, stay in sync.",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${sarabun.variable} antialiased bg-background text-foreground font-poppins`}
      >
        <ThemeProvider defaultTheme="light">
          <FloatingSidebar isLoggedIn={false} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
