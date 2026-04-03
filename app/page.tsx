import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';
import Hero from '@/components/landing/Hero';
import Pricing from '@/components/landing/Pricing';
import Providers from '@/components/landing/Providers';
import Ribbon from '@/components/landing/Ribbon';
import Working from '@/components/landing/Working';

export default function LandingPage() {
  return (
    <div className="w-full h-auto font-sarabun">
      <Ribbon createdAt={new Date(Date.now())} isLoggedIn subscription="BASE" />
      <Hero />
      <div className="section-gap"></div>
      <Working />
      <div className="section-gap"></div>
      <Providers />
      <div className="section-gap"></div>
      <Pricing />
      <div className="section-gap"></div>
      <CallToAction />
      <Footer />
    </div>
  );
}
