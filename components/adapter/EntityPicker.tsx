'use client';
import Image from 'next/image';
import { List, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DriveFile, EntityView } from '@/types/index';

interface Props {
  files: DriveFile[];
  view: EntityView;
  onViewChange: (v: EntityView) => void;
  isSelected: (id: string) => boolean;
  onSelect: (file: DriveFile) => void;
}

export function EntityPicker({ files, view, onViewChange, isSelected, onSelect }: Props) {
  if (!files.length) return null;

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Entities to Migrate</h2>
        <div className="flex items-center gap-2 border border-border rounded-md p-1">
          {(['list', 'grid'] as const).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={cn(
                'p-1.5 rounded transition-colors',
                view === v ? 'bg-muted' : 'hover:bg-muted/50',
              )}
            >
              {v === 'list' ? <List size={18} /> : <LayoutGrid size={18} />}
            </button>
          ))}
        </div>
      </div>

      {/* File List / Grid */}
      <div
        className={cn(
          'border border-border rounded-md max-h-60 overflow-y-auto p-2',
          view === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2' : 'space-y-1',
        )}
      >
        {files.map((file) =>
          view === 'list' ? (
            <div
              key={file.id}
              onClick={() => onSelect(file)}
              className={cn(
                'flex items-center justify-between px-4 py-2 rounded-md cursor-pointer transition-colors hover:bg-muted/50',
                isSelected(file.id) && 'bg-muted/50',
              )}
            >
              <div>
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{file.mimeType}</p>
              </div>
              <span className="text-xs text-muted-foreground">{file.kind}</span>
            </div>
          ) : (
            <div
              key={file.id}
              title={file.name}
              onClick={() => onSelect(file)}
              className={cn(
                'border border-border rounded-md p-3 cursor-pointer transition-colors hover:bg-muted/50',
                isSelected(file.id) && 'border-blue-300 bg-muted/50',
              )}
            >
              <div className="flex items-center gap-x-3">
                <Image
                  src={file.thumbailLink ?? file.iconLink}
                  alt="Thumbnail"
                  width={20}
                  height={20}
                  className="object-cover"
                />
                <p className="font-medium text-sm text-foreground truncate">
                  {file.name.slice(0, 10)}...
                </p>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
