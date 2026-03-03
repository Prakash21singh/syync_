'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground font-sans">
      <div className=" p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2 text-primary">404</h1>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Page Not Found</h2>
        <p className="mb-6 text-text-secondary">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="bg-primary text-background font-semibold px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
