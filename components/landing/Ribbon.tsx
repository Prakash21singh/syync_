import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface RibbonInterface {
  isLoggedIn: boolean;
  createdAt: Date;
  subscription?: 'BASE' | 'PRO' | 'BUSINESS';
}

function CTAText({ isLoggedIn, subscription }: RibbonInterface) {
  if (!isLoggedIn) {
    return <p>Start your 14-day free trial — no card required</p>;
  }

  if (subscription === 'BASE') {
    return <p>Upgrade to PRO for upto 10+ adapter access ⚡</p>;
  }

  if (subscription === 'PRO') {
    return <p>You’re running on PRO ⚡ — 10+ adpaters are enabled.</p>;
  }

  if (subscription === 'BUSINESS') {
    return <p>BUSINESS plan active — high throughput mode 🚀</p>;
  }
}

function CTA({ createdAt, isLoggedIn, subscription }: RibbonInterface) {
  if (!isLoggedIn)
    return (
      <Link
        href={'/login'}
        className="
            underline 
            flex 
            items-center 
            gap-x-1 
            text-[#FFFFFF] 
            hover:text-white 
            transition-all
            text-sm
            "
      >
        Get started <ArrowUpRight className="w-5" />
      </Link>
    );

  if (subscription === 'BASE')
    return (
      <Link
        href={'/login'}
        className="
            underline 
            flex 
            items-center 
            gap-x-1 
            text-[#FFFFFF] 
            hover:text-white 
            transition-all
            text-sm"
      >
        Upgrade to PRO <ArrowUpRight className="w-5" />
      </Link>
    );

  if (subscription === 'PRO')
    return (
      <Link
        href={'/login'}
        className="
            underline 
            flex 
            items-center 
            gap-x-1 
            text-[#FFFFFF] 
            hover:text-white 
            transition-all
            text-sm"
      >
        Manage plan <ArrowUpRight className="w-5" />
      </Link>
    );

  if (subscription === 'BUSINESS')
    return (
      <Link
        href={'/login'}
        className="
            underline 
            flex 
            items-center 
            gap-x-1 
            text-[#FFFFFF] 
            hover:text-white 
            transition-all
            text-sm"
      >
        View usage <ArrowUpRight className="w-5" />
      </Link>
    );
}

function Ribbon({ createdAt, isLoggedIn, subscription }: RibbonInterface) {
  return (
    <div className="hidden md:fixed z-50 shadow left-0 top-0 font-[500] bg-primary overflow-hidden h-9 text-black/60 flex items-center justify-center w-full">
      <div className="h-full w-full absolute opacity-50 -z-10 bg-[radial-gradient(circle_at_center,_rgba(124,58,237,0.4),_transparent_70%)]"></div>
      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          <span>
            {subscription === 'BASE' && 'Upgrade to PRO for upto 10+ adapter access ⚡'}
            {subscription === 'PRO' && "You're running on PRO ⚡ — 10+ adapters are enabled."}
            {subscription === 'BUSINESS' && 'BUSINESS plan active — high throughput mode 🚀'}
          </span>
          <span>|</span>
          <Link
            href={'/login'}
            className="
              underline 
              flex 
              items-center 
              gap-x-1 
              text-[#000000] 
              hover:text-black 
              transition-all
              text-sm
            "
          >
            {subscription === 'BASE' && 'Upgrade'}
            {subscription === 'PRO' && 'Manage plan'}
            {subscription === 'BUSINESS' && 'View usage'}
            <ArrowUpRight className="w-4" />
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span>Start your 14-day free trial — no card required</span>
          <span>|</span>
          <Link
            href={'/login'}
            className="
              underline 
              flex 
              items-center 
              gap-x-1 
              text-[#000000] 
              hover:text-black 
              transition-all
              text-sm
            "
          >
            Get started <ArrowUpRight className="w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default Ribbon;
