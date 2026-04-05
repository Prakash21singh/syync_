import React from 'react';
import Badge from '../badge';
import { Button } from '../ui/button';
import Link from 'next/link';

type Props = {};

function CallToAction({}: Props) {
  return (
    <div
      className="
      w-full
      relative
      my-10
      min-h-[60vh]
      py-20
      overflow-hidden
    "
    >
      <span
        className="
        w-3/4
        aspect-square
        bg-gradient-to-b
        from-secondary/70
        via-transparent
        to-transparent
        blur-3xl
        rounded-full
        opacity-80
        absolute
        -z-10
        left-1/2
        top-20
        -translate-x-1/2
      "
      />

      <div className="max-w-5xl w-full mx-auto flex flex-col items-center justify-center text-center py-10 px-4">
        <Badge name="Always in sync." />

        <h1 className="h2 font-semibold tracking-tight leading-tight">Keep your data in sync.</h1>
        <h1 className="h2 font-semibold tracking-tight leading-tight text-muted-foreground">
          Across every source.
        </h1>

        <Link href={'/'}>
          <Button className="mt-8 mb-6 rounded-full px-10 py-6 font-medium shadow-sm hover:shadow-md transition-all">
            Start syncing free
          </Button>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">🔄 Real-time sync</span>
          <span className="flex items-center gap-2">🔗 Multi-source support</span>
          <span className="flex items-center gap-2">🛡️ Conflict-free merging</span>
        </div>
      </div>
    </div>
  );
}

export default CallToAction;
