'use client';

import '@xyflow/react/dist/style.css';
import Image from 'next/image';
import Badge from '../badge';
import { IconPlug } from '@tabler/icons-react';
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  BackgroundVariant,
  Handle,
  Position,
} from '@xyflow/react';
import { cn } from '@/lib/utils';

const getFlowHeight = (nodes: Node[]) => {
  const maxY = Math.max(...nodes.map((n) => n.position.y));
  return maxY + 120;
};

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
    <div
      className={cn(
        'transform-3d h-52 w-96 border bg-secondary flex items-end justify-start perspective-distant rounded-xl relative p-2',
      )}
    >
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
      <div className="bg-background rounded-lg p-2 w-3/5">
        <h1 className="text-lg font-semibold">Entities selection</h1>
        <p className="text-sm">Select folder and files to migration.</p>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
    </div>
  );
}

function DataMapping({ data }: { data: any }) {
  return (
    <div className="relative px-4 py-3 rounded-2xl bg-transparent border  flex items-center gap-3 w-fit">
      <div
        className="
                absolute 
                top-[70%]
                right-3/5   
                w-50
                h-20
                bg-background
                rounded-xl
                flex 
                items-center
                justify-center
                font-semibold
            "
      >
        Data Mapping
      </div>
      {/* LEFT: Source */}
      <div
        className="
                flex
                h-52
                w-96
                bg-[#c9ff85]
                shadow-md
                rounded-lg
                items-center
                justify-center
                gap-x-6
            "
      >
        <Image src={'/icons/dropbox.svg'} alt="dropbox" width={50} height={50} className="" />
        <Image src={'/curl.png'} alt="dropbox" width={50} height={50} className="" />
        <Image src={'/icons/drive.svg'} alt="google drive" width={50} height={50} className="" />
      </div>

      {/* handles */}
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </div>
  );
}

function PlugNode({
  data,
}: {
  data: {
    type: 'source' | 'destination';
  };
}) {
  return (
    <div
      className={cn(
        'transform-3d h-40 w-40 flex items-center justify-center perspective-distant rounded-2xl p-2',
        data.type === 'source' ? 'bg-secondary' : 'bg-primary',
      )}
    >
      <div className="bg-background w-full h-full relative rounded-xl flex items-center justify-center">
        <IconPlug />
        <div
          className={cn(
            'absolute w-4/5 bottom-0 bg-secondary rounded-t-2xl p-1 left-1/2 -translate-x-1/2 flex items-end justify-center text-xs',
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
};

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
  { id: 'datamapping', type: 'datamapping', position: { x: 90, y: 750 }, data: { label: 'sdfds' } },
  {
    id: 'destinationplug',
    type: 'destinationplug',
    position: { x: 220, y: 1100 },
    data: { type: 'destination' },
  },

  {
    id: 'destination-drive',
    type: 'destinationAdapter',
    position: { y: 1400, x: 0 },
    data: { src: '/icons/drive.svg', type: 'destination' },
  },
  {
    id: 'destination-dropbox',
    type: 'destinationAdapter',
    position: { y: 1400, x: 100 },
    data: { src: '/icons/dropbox.svg', type: 'destination' },
  },
  {
    id: 'destination-photos',
    type: 'destinationAdapter',
    position: { y: 1400, x: 200 },
    data: { src: '/icons/google-photos.svg', type: 'destination' },
  },
  {
    id: 'destination-icloud',
    type: 'destinationAdapter',
    position: { y: 1400, x: 300 },
    data: { src: '/icons/icloud.svg', type: 'destination' },
  },
  {
    id: 'destination-onedrive',
    type: 'destinationAdapter',
    position: { y: 1400, x: 400 },
    data: { src: '/icons/onedrive.svg', type: 'destination' },
  },
  {
    id: 'destination-s3',
    type: 'destinationAdapter',
    position: { y: 1400, x: 500 },
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

type Props = {};

function Working({}: Props) {
  const defaultEdgeOptions = {
    type: 'smoothstep',
    animated: true,
    style: { strokeWidth: 2 },
  };
  const flowHeight = getFlowHeight(nodes);

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 select-none">
      <div className="text-center">
        <Badge name="How it works" />
        <p className="text-center mt-5 text-lg">
          From setup to transfer, everything runs automatically
        </p>
      </div>

      <div className="mt-10 w-full" style={{ height: flowHeight }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={defaultEdgeOptions}
          defaultViewport={{
            x: 200,
            y: 0,
            zoom: 1,
          }}
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
          {/* <Background gap={16} variant={BackgroundVariant.Dots}/> */}
        </ReactFlow>
      </div>
    </div>
  );
}

export default Working;
