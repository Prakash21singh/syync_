'use client';

import { useEffect, useState } from 'react';

interface MigrationCompletedProps {
  totalFiles?: number;
  sourceAccount?: string;
  destinationAccount?: string;
  timestamp?: string;
}

export function MigrationCompleted({
  totalFiles = 9,
  sourceAccount = 'Your Account',
  destinationAccount = 'Destination',
  timestamp = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }),
}: MigrationCompletedProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setShowCheckmark(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Animated Success Circle */}
        <div className="flex justify-center ">
          <div className="relative w-16 h-16 mb-4">
            {/* Outer rotating circle */}
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-600 border-r-purple-600"
              style={{
                animation: isVisible ? 'spin 2s linear infinite' : 'none',
              }}
            />

            {/* Inner pulsing circle */}
            <div
              className="absolute inset-2 rounded-full bg-purple-600"
              style={{
                animation: isVisible
                  ? 'pulse-scale 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  : 'none',
                opacity: 0.1,
              }}
            />

            {/* Center checkmark */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`text-4xl font-bold transition-all duration-700 ${
                  showCheckmark ? 'scale-100 opacity-100 text-purple-600' : 'scale-0 opacity-0'
                }`}
              >
                ✓
              </div>
            </div>
          </div>
        </div>

        {/* Completion Text */}
        <div className="text-center mb-8">
          <h2
            className={`text-xl font-bold text-slate-900 mb-2 transition-all duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            Completed
          </h2>
          <p
            className={`text-slate-600  text-xs transition-all duration-700 delay-100 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            All your files have been successfully transferred
          </p>
        </div>

        {/* Decorative elements */}
        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes pulse-scale {
            0%,
            100% {
              transform: scale(1);
              opacity: 0.1;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.05;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
