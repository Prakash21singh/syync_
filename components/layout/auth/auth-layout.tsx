import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="w-full min-h-screen flex font-sans">
      {/* Left branding panel */}
      <div className="hidden md:flex w-1/2 lg:w-3/5 bg-primary flex-col justify-end p-12">
        <div className="max-w-md">
          <h1 className="text-3xl font-semibold text-primary-foreground tracking-tight text-balance">
            Welcome back
          </h1>
          <p className="text-sm text-primary-foreground/60 mt-3 leading-relaxed">
            Enter your credentials to access your account and continue where you left off.
          </p>
        </div>
      </div>

      {/* Right content panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
