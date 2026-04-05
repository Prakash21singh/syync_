'use client';

import '@xyflow/react/dist/style.css';
import Image from 'next/image';
import Badge from '../badge';
import { IconPlug } from '@tabler/icons-react';
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  BackgroundVariant,
  Handle,
  Position,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Node components (unchanged from original) ────────────────────────────────

function AdapterNode({ data }: { data: { src: string; type: 'source' | 'destination' } }) {
  return (
    <div className="p-2 flex w-20 items-center justify-center aspect-square rounded-lg">
      <div className="bg-surface border border-border rounded-xl p-3">
        <Image src={data.src} alt="Adapter" width={30} height={30} />
      </div>
      <Handle
        type={data.type === 'source' ? 'source' : 'target'}
        position={data.type === 'source' ? Position.Bottom : Position.Top}
        style={{ visibility: 'hidden' }}
      />
    </div>
  );
}

function FileSelectionNode({ data }: { data: any }) {
  return (
    <div className="transform-3d h-52 w-96 border bg-secondary flex items-end justify-start perspective-distant rounded-xl relative p-2">
      <div className="h-4/5 absolute w-1/3 rounded-xl bg-background -right-5 bottom-1">
        <div className="w-full h-full relative">
          <Image
            src={'/pdf.png'}
            alt="Pdf"
            width={30}
            height={30}
            className="absolute left-1/4 top-1/5"
          />
          <Image
            src={'/csv-file.png'}
            alt="CSV File"
            width={30}
            height={30}
            className="absolute left-1/2 top-1/3"
          />
          <Image
            src={'/google-docs.png'}
            alt="Google docs"
            width={30}
            height={30}
            className="absolute bottom-1/4 left-1/4"
          />
        </div>
      </div>
      <div className="bg-background border border-border rounded-lg p-2 w-3/5">
        <h1 className="text-lg font-semibold">Entities selection</h1>
        <p className="text-sm">Select folder and files to migration.</p>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
    </div>
  );
}

function SourceDataNode({
  data,
}: {
  data: { name: string; icon: string; bg: string; tree: string[] };
}) {
  return (
    <div className={cn(`border border-[#EBEBF0] rounded-xl p-2.5 w-48 bg-[${data.bg}]`)}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <div
          className="w-[22px] h-[22px] p-1 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ background: data.bg }}
        >
          <Image src={data.icon} alt={data.name} width={30} height={40} />
        </div>
        <div className="flex-1">
          <div className="text-[11px] font-semibold text-[#1a1a2e]">{data.name}</div>
        </div>
      </div>
      <div className="font-mono text-[9.5px] text-[#9090A8] bg-[#F9F9FC] rounded-md px-2 py-1.5 leading-[1.75]">
        {data.tree.map((line, i) => (
          <div key={i} className={i === 0 ? 'text-[#5a5a7a]' : ''}>
            {line}
          </div>
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </div>
  );
}

export function DataMapping() {
  return (
    <div className="relative bg-[#F4F4F8] rounded-2xl p-5 w-96">
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      <div className="border-[1.5px] border-primary/40 rounded-xl bg-white overflow-hidden">
        <div className="px-3.5 py-2.5 border-b border-primary/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center" />
            <div>
              <div className="text-[12px] font-bold text-[#1a1a2e]">Sync — data mapping</div>
              <div className="text-[10px] text-[#9090A8]">
                Normalises all source structures into unified JSON
              </div>
            </div>
          </div>
        </div>
        <div className="px-3.5 py-2.5">
          <div className="text-[9px] font-semibold text-[#9090A8] mb-2">Normalized Output:</div>
          <div className="bg-[#F9F9FC] border border-[#EBEBF0] rounded-lg p-2.5 font-mono text-[8px] text-[#5a5a7a] overflow-auto max-h-32">
            <pre>{`{
  "files": [
    {
      "source": "S3",
      "path": "my-bucket/reports",
      "name": "q1.pdf",
      "destination": "/docs/q1.pdf"
    },
    ...
  ]
}`}</pre>
          </div>
        </div>
      </div>
      <Handle type="target" id="left" position={Position.Left} style={{ visibility: 'hidden' }} />
      <Handle type="target" id="right" position={Position.Right} style={{ visibility: 'hidden' }} />
      <Handle type="target" id="top" position={Position.Top} style={{ visibility: 'hidden' }} />
      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </div>
  );
}

function PlugNode({ data }: { data: { type: 'source' | 'destination' } }) {
  return (
    <div
      className={cn(
        'h-40 w-40 flex relative items-center justify-center rounded-2xl p-2',
        data.type === 'source' ? 'bg-secondary' : 'bg-primary',
      )}
    >
      <span
        className={cn(
          'w-44 aspect-square rounded-full blur-3xl absolute',
          data.type === 'source' ? 'bg-secondary/50' : 'bg-primary/50',
        )}
      />
      <div className="bg-background w-full h-full relative rounded-xl flex items-center justify-center">
        <IconPlug />
        <div
          className={cn(
            'absolute w-4/5 bottom-0 rounded-t-2xl p-1 left-1/2 -translate-x-1/2 flex items-end justify-center text-xs',
            data.type === 'source' ? 'bg-secondary' : 'bg-primary',
          )}
        >
          {data.type === 'source' ? 'Source' : 'Destination'}
        </div>
      </div>
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </div>
  );
}

function PipelineNode({ data }: { data: { label: string } }) {
  return (
    <div className="bg-background border border-border rounded-xl px-5 py-3 text-sm font-medium shadow-sm">
      {data.label}
    </div>
  );
}

const nodeTypes = {
  sourceAdapter: AdapterNode,
  sourceplug: PlugNode,
  destinationplug: PlugNode,
  fileselection: FileSelectionNode,
  pipeline: PipelineNode,
  destinationAdapter: AdapterNode,
  datamapping: DataMapping,
  sourcedata: SourceDataNode,
};

// ─── Static nodes & edges (your originals, untouched) ────────────────────────

const nodes: Node[] = [
  {
    id: 'source-drive',
    type: 'sourceAdapter',
    position: { y: 0, x: 0 },
    data: { src: '/icons/drive.svg', type: 'source' },
  },
  {
    id: 'source-dropbox',
    type: 'sourceAdapter',
    position: { y: 0, x: 100 },
    data: { src: '/icons/dropbox.svg', type: 'source' },
  },
  {
    id: 'source-photos',
    type: 'sourceAdapter',
    position: { y: 0, x: 200 },
    data: { src: '/icons/google-photos.svg', type: 'source' },
  },
  {
    id: 'source-icloud',
    type: 'sourceAdapter',
    position: { y: 0, x: 300 },
    data: { src: '/icons/icloud.svg', type: 'source' },
  },
  {
    id: 'source-onedrive',
    type: 'sourceAdapter',
    position: { y: 0, x: 400 },
    data: { src: '/icons/onedrive.svg', type: 'source' },
  },
  {
    id: 'source-s3',
    type: 'sourceAdapter',
    position: { y: 0, x: 500 },
    data: { src: '/icons/s3.svg', type: 'source' },
  },

  { id: 'sourceplug', type: 'sourceplug', position: { x: 220, y: 200 }, data: { type: 'source' } },
  {
    id: 'fileselect',
    type: 'fileselection',
    position: { x: 107, y: 450 },
    data: { type: 'random' },
  },

  {
    id: 'sourcedata-s3',
    type: 'sourcedata',
    position: { x: -150, y: 700 },
    data: {
      name: 'Amazon S3',
      icon: '/icons/s3.svg',
      bg: '#E8F5E9',
      tree: ['my-bucket/', '├─ reports/q1.pdf', '├─ data/users.csv', '└─ assets/logo.png'],
    },
  },
  {
    id: 'sourcedata-dropbox',
    type: 'sourcedata',
    position: { x: 204, y: 680 },
    data: {
      name: 'Dropbox',
      icon: '/icons/dropbox.svg',
      bg: '#E3F2FD',
      tree: ['/Home/Work/', '├─ report.pdf', '├─ sheet.csv', '└─ archive/'],
    },
  },
  {
    id: 'sourcedata-drive',
    type: 'sourcedata',
    position: { x: 580, y: 700 },
    data: {
      name: 'Google Drive',
      icon: '/icons/drive.svg',
      bg: '#E8F5E9',
      tree: ['Shared Drive', '├─ id:1aB_xZ', '├─ id:3dE_kQ', '└─ id:7jK_mR'],
    },
  },

  {
    id: 'datamapping',
    type: 'datamapping',
    position: { x: 108, y: 900 },
    data: { label: 'sdfds' },
  },
  {
    id: 'destinationplug',
    type: 'destinationplug',
    position: { x: 220, y: 1200 },
    data: { type: 'destination' },
  },

  {
    id: 'destination-drive',
    type: 'destinationAdapter',
    position: { y: 1500, x: 0 },
    data: { src: '/icons/drive.svg', type: 'destination' },
  },
  {
    id: 'destination-dropbox',
    type: 'destinationAdapter',
    position: { y: 1500, x: 100 },
    data: { src: '/icons/dropbox.svg', type: 'destination' },
  },
  {
    id: 'destination-photos',
    type: 'destinationAdapter',
    position: { y: 1500, x: 200 },
    data: { src: '/icons/google-photos.svg', type: 'destination' },
  },
  {
    id: 'destination-icloud',
    type: 'destinationAdapter',
    position: { y: 1500, x: 300 },
    data: { src: '/icons/icloud.svg', type: 'destination' },
  },
  {
    id: 'destination-onedrive',
    type: 'destinationAdapter',
    position: { y: 1500, x: 400 },
    data: { src: '/icons/onedrive.svg', type: 'destination' },
  },
  {
    id: 'destination-s3',
    type: 'destinationAdapter',
    position: { y: 1500, x: 500 },
    data: { src: '/icons/s3.svg', type: 'destination' },
  },
];

const edges: Edge[] = [
  {
    id: 'e-drive-sourceplug',
    source: 'source-drive',
    target: 'sourceplug',
    type: 'smooth',
    animated: true,
  },
  {
    id: 'e-dropbox-sourceplug',
    source: 'source-dropbox',
    target: 'sourceplug',
    type: 'smooth',
    animated: true,
  },
  {
    id: 'e-photos-sourceplug',
    source: 'source-photos',
    target: 'sourceplug',
    type: 'smooth',
    animated: true,
  },
  {
    id: 'e-icloud-sourceplug',
    source: 'source-icloud',
    target: 'sourceplug',
    type: 'smooth',
    animated: true,
  },
  {
    id: 'e-onedrive-sourceplug',
    source: 'source-onedrive',
    target: 'sourceplug',
    type: 'smooth',
    animated: true,
  },
  {
    id: 'e-s3-sourceplug',
    source: 'source-s3',
    target: 'sourceplug',
    type: 'smooth',
    animated: true,
  },

  {
    id: 'e-sourceplug-fileselect',
    source: 'sourceplug',
    target: 'fileselect',
    type: 'smooth',
    animated: true,
  },
  {
    id: 'e-fileselect-datamapping',
    source: 'fileselect',
    target: 'datamapping',
    type: 'smooth',
    animated: true,
  },

  {
    id: 'e-sourcedata-s3-datamapping',
    source: 'sourcedata-s3',
    target: 'datamapping',
    targetHandle: 'left',
    type: 'smooth',
    animated: true,
  },
  {
    id: 'e-sourcedata-dropbox-datamapping',
    source: 'sourcedata-dropbox',
    target: 'datamapping',
    targetHandle: 'top',
    type: 'smooth',
    animated: true,
  },
  {
    id: 'e-sourcedata-drive-datamapping',
    source: 'sourcedata-drive',
    target: 'datamapping',
    targetHandle: 'right',
    type: 'smooth',
    animated: true,
  },

  {
    id: 'e-datamapping-destinationplug',
    source: 'datamapping',
    target: 'destinationplug',
    type: 'smooth',
    animated: true,
  },

  {
    id: 'e-destinationplug-drive',
    source: 'destinationplug',
    target: 'destination-drive',
    type: 'smooth',
    animated: true,
  },
  {
    id: 'e-destinationplug-dropbox',
    source: 'destinationplug',
    target: 'destination-dropbox',
    type: 'smooth',
    animated: true,
  },
  {
    id: 'e-destinationplug-photos',
    source: 'destinationplug',
    target: 'destination-photos',
    type: 'smooth',
    animated: true,
  },
  {
    id: 'e-destinationplug-icloud',
    source: 'destinationplug',
    target: 'destination-icloud',
    type: 'smooth',
    animated: true,
  },
  {
    id: 'e-destinationplug-onedrive',
    source: 'destinationplug',
    target: 'destination-onedrive',
    type: 'smooth',
    animated: true,
  },
  {
    id: 'e-destinationplug-s3',
    source: 'destinationplug',
    target: 'destination-s3',
    type: 'smooth',
    animated: true,
  },
];

const GRAPH_X0 = -150;
const GRAPH_Y0 = 0;
const GRAPH_W = 922;
const GRAPH_H = 1580;

function calcViewport(containerW: number, containerH: number) {
  const PAD = 0.04;

  // Width drives zoom on desktop (up to natural 1:1).
  // Height is the tighter axis only on small screens.
  const zoomByW = (containerW * (1 - PAD * 2)) / GRAPH_W;
  const zoomByH = (containerH * (1 - PAD * 2)) / GRAPH_H;
  const zoom = containerW >= 900 ? Math.min(zoomByW, 1) : Math.min(zoomByW, zoomByH);

  const x = (containerW - GRAPH_W * zoom) / 2 - GRAPH_X0 * zoom;
  const y = (containerH - GRAPH_H * zoom) / 2 - GRAPH_Y0 * zoom;

  return { x, y, zoom };
}

// ─── Inner flow (needs ReactFlowProvider context) ─────────────────────────────

function InnerFlow({ w, h }: { w: number; h: number }) {
  const { setViewport } = useReactFlow();

  // Re-centre whenever the container size changes
  useEffect(() => {
    setViewport(calcViewport(w, h), { duration: 0 });
  }, [w, h, setViewport]);

  const defaultEdgeOptions = {
    type: 'smoothstep',
    animated: true,
    style: { strokeWidth: 1 },
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true }}
      defaultEdgeOptions={defaultEdgeOptions}
      defaultViewport={calcViewport(w, h)}
      panOnScroll={false}
      zoomOnScroll={false}
      panOnDrag={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
      preventScrolling={false}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
    >
      <Background gap={16} variant={BackgroundVariant.Dots} />
    </ReactFlow>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

type Props = {};

function Working({}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const { offsetWidth: w } = containerRef.current;
    const zoomByWidth = (w * 0.92) / GRAPH_W;
    const maxZoom = w >= 900 ? 1 : zoomByWidth;
    const zoom = Math.min(zoomByWidth, maxZoom);
    const h =
      w >= 900
        ? GRAPH_H * zoom + 80
        : Math.min(Math.max(GRAPH_H * zoom + 60, 420), window.innerHeight * 0.85);
    setDims({ w, h });
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div className="w-full max-w-5xl mx-auto mt-10">
      <div className="text-center">
        <Badge name="How it works" />
        <p className="text-center mt-5 text-lg">
          From setup to transfer, everything runs automatically
        </p>
      </div>

      <div ref={containerRef} className="mt-10 w-full" style={{ height: dims?.h ?? 600 }}>
        {dims && (
          <ReactFlowProvider>
            <InnerFlow w={dims.w} h={dims.h} />
          </ReactFlowProvider>
        )}
      </div>
    </div>
  );
}

export default Working;
