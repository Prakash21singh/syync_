import Image from 'next/image';
import React from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import Badge from '../badge';

type Props = {};

function HangingCard() {
  return (
    <div
      className="
      absolute 
      w-96 
      h-40 
      p-2 
      rounded-md 
      left-1/2 
      top-0 
      rotate-8 
      -z-10 
      bg-[#f2f2f2]
      transform-3d
      rotate-y-6
    "
    >
      <div
        className="
          bg-secondary 
          h-full
          w-full
          rounded-md
          flex 
          items-center
          justify-center
          gap-2
        "
      >
        <Image
          src={'/icons/drive.svg'}
          alt="Google Drive"
          width={50}
          height={50}
          className="border-2 border-dashed p-2 border-black/30 rounded-md"
        />

        <span className="text-black/40">---</span>

        <Image
          src={'/icons/s3.svg'}
          alt="Google Drive"
          width={50}
          height={50}
          className="border-2 border-dashed p-2 border-black/70 rounded-md"
        />
      </div>
    </div>
  );
}

function HeroContent() {
  return (
    <div className="flex flex-col items-center">
      <div>
        <h1 className="h1">Move Data Across Clouds</h1>
        <div
          className="
          flex 
          items-center 
          justify-center 
          gap-x-2
          text-lg 
          font-normal
          text-text-secondary
        "
        >
          <h2>Fast.</h2>
          <h2>Reliable.</h2>
          <h3>Fully automated.</h3>
        </div>
      </div>

      <p
        className="
        w-[50%] 
        text-center 
        mt-5 
        text-lg
      "
      >
        Sync lets you migrate files between Google Drive, Dropbox, S3 and more — with zero data
        loss, real-time streaming, and background orchestration.
      </p>
    </div>
  );
}
function VisualFunctionality() {
  return (
    <div className="w-[70%] mx-auto mt-10 relative">
      {/* Blur glow behind the card */}
      <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-1/2 aspect-square rounded-full bg-gradient-to-b from-secondary via-transparent to-primary blur-3xl -z-10" />

      <div className="overflow-hidden shadow-lg rounded-lg border border-gray-200 box-shadow-app">
        <Image
          src={'/sync.png'}
          alt="sync"
          width={1200}
          height={700}
          className="max-w-5xl mx-auto object-contain"
        />
      </div>
    </div>
  );
}
function CTA() {
  return (
    <div className="flex items-center justify-center gap-x-6 mt-8">
      <Button
        className="
          rounded-full 
          p-6
          bg-black
          hover:bg-black/90
          text-white
        "
      >
        Start 14-Day Free Trial
      </Button>

      <Button
        className="
          rounded-full 
          p-6
          bg-secondary
          hover:bg-secondary/70
          text-black/90
        "
      >
        See how it works
      </Button>
    </div>
  );
}

function Adapter({ imageUrl, className }: { className?: string; imageUrl: string }) {
  return (
    <Image
      alt="image"
      className={cn('absolute border p-2 rounded-md border-dashed border-black/60', className)}
      src={imageUrl}
      width={60}
      height={60}
    />
  );
}

function ScatteredAdapters() {
  return (
    <div className="w-full -z-50  h-full absolute left-0 top-0">
      <Adapter imageUrl="/icons/drive.svg" className="left-5 top-10 -rotate-5" />
      <Adapter imageUrl="/icons/dropbox.svg" className="left-1/2 -bottom-20 ml-5 -rotate-10" />
      <Adapter imageUrl="/icons/google-photos.svg" className="bottom-0 left-1/4 -rotate-12" />
      <Adapter imageUrl="/icons/icloud.svg" className="right-5 top-10 rotate-5" />
      <Adapter imageUrl="/icons/s3.svg" className="right-1/2 -bottom-20 mr-5 rotate-10" />
      <Adapter imageUrl="/icons/onedrive.svg" className="bottom-0 right-1/4 rotate-12" />
    </div>
  );
}

function Hero({}: Props) {
  return (
    <div className="w-full section relative">
      {/* <HangingCard /> */}
      <div className="w-full min-h-[90vh] flex flex-col gap-y-4 ">
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <Badge name="Introduction" />
            <ScatteredAdapters />
            <HeroContent />
            <CTA />
          </div>
        </div>
      </div>
      <VisualFunctionality />
    </div>
  );
}

export default Hero;
