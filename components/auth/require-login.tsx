'use client';

import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

type RequireLoginProps = {
  /** Called when the user clicks "Sign in" */
  onSignIn?: () => void;
  /** Called when the user clicks "Go back" */
  onBack?: () => void;
};

/**
 * A minimal, inline login prompt shown when an unauthenticated
 * user tries to interact with a protected feature.
 */
function RequireLogin({ onSignIn, onBack }: RequireLoginProps) {
  const handleSignIn = useCallback(() => {
    if (onSignIn) {
      onSignIn();
    } else {
      window.location.href = '/login';
    }
  }, [onSignIn]);

  const handleBack = useCallback(() => {
    onBack?.();
  }, [onBack]);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-5 py-10">
      {/* Icon */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-muted">
        <Lock className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Copy */}
      <div className="text-center space-y-1">
        <h3 className="text-sm font-medium text-foreground">Sign in to continue</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          You need an account to select adapters and start migrations.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={handleBack}>
            Go back
          </Button>
        )}
        <Button size="sm" className="text-background" onClick={handleSignIn}>
          Sign in
        </Button>
      </div>
    </div>
  );
}

export default React.memo(RequireLogin);
