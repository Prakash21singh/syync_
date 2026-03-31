'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Bucket {
  name: string;
}

interface BucketSelectionProps {
  open: boolean;
  buckets: Bucket[];
  onConfirm: (bucketName: string) => void;
  onClose: () => void;
}

export function BucketSelection({ open, buckets, onConfirm, onClose }: BucketSelectionProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected);
    setSelected(null);
  };

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md font-sarabun">
        <DialogHeader>
          <DialogTitle>Select a Bucket</DialogTitle>
          <DialogDescription>
            Choose the S3 bucket you want to migrate files from.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto py-2">
          {buckets.map((bucket) => (
            <button
              key={bucket.name}
              onClick={() => setSelected(bucket.name)}
              className={`
                w-full text-left px-4 py-3 rounded-sm border text-sm font-medium transition-colors
                ${
                  selected === bucket.name
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/50 hover:bg-muted'
                }
              `}
            >
              {bucket.name}
            </button>
          ))}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled={!selected} onClick={handleConfirm}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
