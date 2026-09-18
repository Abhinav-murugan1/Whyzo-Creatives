import React from 'react';
import { ArrowUp, Video } from 'lucide-react';
import ShinyText from './reactbits/ShinyText';

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

/*
 * Was a motion/react component. The library was pulling 41 kB gzipped into the initial bundle for
 * this rise and one accordion in Services; the same motion is two CSS transitions (see .footer-rise
 * in index.css), so the dependency is gone. `prefers-reduced-motion` is handled in the stylesheet.
 */
function AnimatedContainer({ className = '', delay = 0.1, isRevealed = true, children }) {
  return (
    <div
      className={`footer-rise${isRevealed ? ' is-revealed' : ''} ${className}`.trim()}
      style={{ '--rise-delay': `${delay * 1000}ms` }}
    >
      {children}
    </div>
  );
}

const Footer = ({ onNavigate, isRevealed = true }) => {

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { title: 'Instagram', href: 'https://www.instagram.com/whyzo.ae?stkn=dnBnMWNkY3V0cWt0', icon: InstagramIcon },
    { title: 'YouTube', href: 'https://www.youtube.com/@Whyzocreatives', icon: YoutubeIcon },
    { title: 'LinkedIn', href: 'https://www.linkedin.com/in/whyzo-creatives-9b3212438/', icon: LinkedinIcon },
    { title: 'Vimeo', href: 'https://vimeo.com', icon: Video },
    { title: 'X / Twitter', href: 'https://x.com', icon: TwitterIcon }
  ];

  return (
    <footer className="md:rounded-t-6xl relative w-full max-w-[1700px] mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t border-white/10 bg-black bg-[radial-gradient(35%_128px_at_50%_0%,rgba(255,255,255,0.08),transparent)] px-5 sm:px-12 md:px-16 lg:px-24 pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-12 overflow-hidden text-white selection:bg-white selection:text-black">
      {/* Top Ambient Glow Line Separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.35)]" />
      <div className="bg-white/20 absolute top-0 right-1/2 left-1/2 h-px w-1/2 max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-full blur-[1px] pointer-events-none" />
      <div className="bg-white/10 absolute top-0 right-1/2 left-1/2 h-6 w-1/3 max-w-md -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl pointer-events-none" />

      {/* Background Grid Lines Overlay */}
      <div className="absolute inset-0 bg-grid-lines opacity-10 pointer-events-none"></div>

      <div className="w-full relative z-10">
        {/* Typographic Brand Watermark - Positioned at top of footer above all text */}
        <AnimatedContainer delay={0.1} isRevealed={isRevealed} className="pb-6 sm:pb-10 md:pb-16 text-center select-none overflow-hidden border-b border-white/10">
          <span className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight block font-poppins poppins-bold leading-none">
            <ShinyText
              text="WHYZO CREATIVES"
              speed={4}
              delay={2}
              color="#3f3f46"
              shineColor="#ffffff"
              spread={120}
            />
          </span>
        </AnimatedContainer>

        {/* Top Footer Section: 3-Column Grid (2 cols on mobile, 12 cols on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-6 sm:gap-8 md:gap-10 lg:gap-12 pt-7 sm:pt-10 md:pt-14 pb-7 sm:pb-10 md:pb-14 border-b border-white/10">
          {/* Brand Info (Full width on mobile, 6 Cols on desktop) */}
          <AnimatedContainer delay={0.15} isRevealed={isRevealed} className="col-span-2 md:col-span-6 space-y-3 sm:space-y-5">
            <div className="flex items-center">
              <img 
                src="/logo-white.png" 
                alt="Whyzo Creatives Logo" 
                className="h-7 sm:h-9 w-auto object-contain"
                width={140}
                height={36}
              />
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md font-poppins poppins-regular">
              A creative production company for brands, people, and ideas that deserve more than basic content making every frame feel fresh.
            </p>
          </AnimatedContainer>

          {/* Quick Links (1 Col on mobile, 3 Cols on desktop) */}
          <AnimatedContainer delay={0.2} isRevealed={isRevealed} className="col-span-1 md:col-span-3 space-y-2.5 sm:space-y-4">
            <h4 className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-zinc-500">NAVIGATION</h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs font-mono text-zinc-400">
              <li>
                <a 
                  href="#hero" 
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('home');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  01. Home & Hero
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('home');
                      setTimeout(() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  02. About the Company
                </a>
              </li>
              <li>
                <a 
                  href="#gallery" 
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('home');
                      setTimeout(() => document.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  03. Curated Gallery
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('home');
                      setTimeout(() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  04. Our Services
                </a>
              </li>
              <li>
                <a 
                  href="#team" 
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('team');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  05. The Team
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('home');
                      setTimeout(() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  06. Project Inquiry
                </a>
              </li>
            </ul>
          </AnimatedContainer>

          {/* Social Channels (1 Col on mobile, 3 Cols on desktop) */}
          <AnimatedContainer delay={0.3} isRevealed={isRevealed} className="col-span-1 md:col-span-3 space-y-2.5 sm:space-y-4">
            <h4 className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-zinc-500">CONNECT</h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs font-mono text-zinc-400">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.title}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white inline-flex items-center gap-2 transition-colors duration-200"
                    >
                      <Icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
                      <span>{item.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </AnimatedContainer>
        </div>

        {/* Bottom Rights Bar */}
        <AnimatedContainer delay={0.4} isRevealed={isRevealed} className="flex flex-row items-center justify-between gap-3 pt-5 sm:pt-8 text-[11px] sm:text-xs font-mono text-zinc-500">
          <span>&copy; {new Date().getFullYear()} WHYZO CREATIVES.</span>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </AnimatedContainer>
      </div>
    </footer>
  );
};

export default Footer;
