import React from 'react';

type Props = {};

// footer.config.ts  ← or inline at top of footer.tsx
export const FOOTER_CONFIG = {
  brand: {
    name: 'Sync',
    tagline: 'Keep your data in sync. Across every source.',
  },
  contact: {
    email: 'hello@yourdomain.com',
  },
  socials: [
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/prakash21singh',
      username: 'prakash21singh',
      icon: 'linkedin',
    },
    {
      label: 'GitHub',
      href: 'https://github.com/prakash21singh',
      username: 'your-username',
      icon: 'github',
    },
    {
      label: 'X',
      href: 'https://x.com/Prakash87096639',
      username: '@Prakash87096639',
      icon: 'x',
    },
  ],
  links: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Docs', href: '#docs' },
    { label: 'Changelog', href: '#changelog' },
  ],
};

export function FooterBrand() {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xl font-semibold tracking-tight text-white">
        {FOOTER_CONFIG.brand.name}
      </span>
      <p className="text-sm text-zinc-400 max-w-xs leading-relaxed">
        {FOOTER_CONFIG.brand.tagline}
      </p>
    </div>
  );
}

function FooterLinks() {
  return (
    <div className="flex flex-col gap-3">
      <span
        className="text-xs font-medium uppercase tracking-widest text-zinc-500"
        style={{ letterSpacing: '0.04em', marginBottom: '20px' }}
      >
        Product
      </span>
      <ul className="flex flex-col gap-2">
        {FOOTER_CONFIG.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-150"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterContact() {
  return (
    <div className="flex flex-col gap-3">
      <span
        className="text-xs font-medium uppercase tracking-widest text-zinc-500"
        style={{ letterSpacing: '0.04em', marginBottom: '20px' }}
      >
        Contact
      </span>
      <a
        href={`mailto:${FOOTER_CONFIG.contact.email}`}
        className="text-sm text-zinc-400 hover:text-white transition-colors duration-150"
      >
        {FOOTER_CONFIG.contact.email}
      </a>
    </div>
  );
}

const iconMap: Record<string, React.ReactNode> = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  ),
};

function FooterSocials() {
  return (
    <div className="flex flex-col gap-3">
      <span
        className="text-xs font-medium uppercase tracking-widest text-zinc-500"
        style={{ letterSpacing: '0.04em', marginBottom: '20px' }}
      >
        Connect
      </span>
      <ul className="flex flex-col gap-3">
        {FOOTER_CONFIG.socials.map((social) => (
          <li key={social.label}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors duration-150 group"
            >
              <span className="text-zinc-500 group-hover:text-white transition-colors duration-150">
                {iconMap[social.icon]}
              </span>
              {social.username}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FooterBottom() {
  return (
    <div className="mt-16 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-600">
      <span>
        © {new Date().getFullYear()} {FOOTER_CONFIG.brand.name}. All rights reserved.
      </span>
      <span>Built with care.</span>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-white w-full border-t border-zinc-900">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          <FooterBrand />
          <FooterLinks />
          <FooterSocials />
          <FooterContact />
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}

export default Footer;
