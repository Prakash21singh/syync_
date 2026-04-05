import Image from 'next/image';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path
      d="M2.5 6.5L5 9l5.5-5.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const features = [
  { label: 'Secure & reliable migrations', sub: 'Zero-downtime transfers with rollback' },
  { label: 'Multi-cloud support', sub: 'Google Drive, Dropbox, S3 & more' },
  { label: 'Real-time tracking', sub: 'Monitor every file and migration process' },
];

export default function AuthLayout({ children }: Props) {
  return (
    <div className="w-full min-h-screen flex font-sarabun">
      {/* ───────── Left branding panel ───────── */}
      <div className="hidden lg:flex w-1/2 lg:w-3/5 p-10 lg:p-14 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 border-r border-gray-300 relative overflow-hidden">
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-80 z-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #d8d8d8 1px, transparent 0px)',
            backgroundSize: '128px 28px',
          }}
        />
        <span className="absolute w-96 aspect-square rounded-full bg-primary/40 blur-3xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>

        {/* Soft accent blob */}
        <div
          className="absolute -bottom-20 -left-20 w-90 h-90 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
          }}
        />

        {/* ── Top: Logo ── */}
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            {/* Logo mark */}
            <Image src="/logo.svg" alt="Logo" width={100} height={100} />
            <span className="text-lg font-bold text-gray-900 tracking-tight"></span>
          </div>
        </div>

        {/* ── Middle: Hero + Diagram ── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center gap-9 p-4">
          {/* Headline */}
          <div>
            <p className="text-xs font-semibold tracking-wider text-indigo-500 uppercase mb-2.5">
              Data Migration Orchestrator
            </p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-3.5">
              Move data with <span className="text-indigo-500">confidence.</span>
              <br />
              Ship migrations{' '}
              <span className="relative inline-block">
                faster.
                <span className="absolute bottom-0.5 left-0 right-0 h-0.5 bg-indigo-500 rounded opacity-25" />
              </span>
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Orchestrate complex data migrations across any stack — with live monitoring, schema
              validation, and zero-downtime cutovers built in.
            </p>
          </div>

          {/* Feature list */}
          <div className="flex flex-col gap-2.5 max-w-sm">
            {features.map((f) => (
              <div key={f.label} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded bg-indigo-50 border border-indigo-200 flex items-center justify-center flex-shrink-0 mt-0.5 text-indigo-500">
                  <CheckIcon />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{f.label}</div>
                  <div className="text-xs text-gray-600">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───────── Right: auth form ───────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
