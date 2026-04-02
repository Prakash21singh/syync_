import Hero from '@/components/landing/Hero';
import Pricing from '@/components/landing/Pricing';
import Providers from '@/components/landing/Providers';
import Ribbon from '@/components/landing/Ribbon';
import Working from '@/components/landing/Working';

export default function LandingPage() {
  return (
    <div className="w-full font-sarabun">
        <Ribbon 
          createdAt={new Date(Date.now())}
          isLoggedIn
          subscription='BASE'
        />
        <Hero/>
        <Working/>
        <Providers/>
        <Pricing />
    </div>
  );
}
