import Image from 'next/image';
import React from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import Badge from '../badge';
import Link from 'next/link';
import { Backlight } from '../custom/backlight';

type Props = {};

function HeroContent() {
  return (
    <div className="flex flex-col items-center">
      <div>
        <h1
          className="
        text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-semibold
        "
        >
          Move Data Across Clouds
        </h1>
        <div
          className="
          flex 
          items-center 
          justify-center 
          gap-x-2
          text-sm
          md:text-lg 
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
        text-sm
        md:text-lg
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
    <div className="w-9/10 md:w-[70%] mx-auto mt-10 relative">
      <div className="overflow-hidden rounded-lg border object-cover border-gray-200 box-shadow-app">
        <Backlight className="w-full rounded-full">
          <video src={'/demo.mp4'} autoPlay muted loop></video>
        </Backlight>
      </div>
    </div>
  );
}
function CTA() {
  return (
    <div className="flex items-center justify-center flex-col md:flex-row gap-3 md:gap-6 mt-8">
      <Button
        className="
          rounded-full 
          p-6
          bg-black
          hover:bg-black/90
          text-white
          hover:cursor-pointer
          min-w-80
          md:min-w-auto
        "
      >
        <Link href={'/app'}>Start 14-Day Free Trial</Link>
      </Button>

      <Button
        className="
          rounded-full 
          p-6
          bg-secondary
          hover:bg-secondary/70
          text-black/90
          hover:cursor-pointer
          min-w-80
          md:min-w-auto
        "
      >
        <Link href={'/app'}>See how it works</Link>
      </Button>
    </div>
  );
}

function Adapter({ imageUrl, className }: { className?: string; imageUrl: string }) {
  return (
    <Image
      alt="image"
      className={cn(
        'absolute border w-10 md:w-12 lg:w-16 p-2 rounded-md border-dashed border-black/60',
        className,
      )}
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
      <Adapter imageUrl="/icons/icloud.svg" className="right-5 top-10 rotate-5" />
      <Adapter imageUrl="/icons/dropbox.svg" className="left-1/2 -bottom-20 ml-5 -rotate-10" />
      <Adapter imageUrl="/icons/s3.svg" className="right-1/2 -bottom-20 mr-5 rotate-10" />
      <Adapter
        imageUrl="/icons/google-photos.svg"
        className="bottom-2/5 md:bottom-0 left-8 md:left-1/4 -rotate-12"
      />
      <Adapter
        imageUrl="/icons/onedrive.svg"
        className="bottom-2/5 md:bottom-0 right-8 md:right-1/4 rotate-12"
      />
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
