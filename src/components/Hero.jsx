import React, { useEffect, useRef, useState, Suspense } from 'react';
import ShinyText from './reactbits/ShinyText';
import { ArrowDownRight } from 'lucide-react';
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button';

/*
 * Beams pulls in the whole three.js runtime (~898 kB / 238 kB gzipped) - by far the heaviest chunk on
 * the site. Statically imported it sat in the critical path, so the headline, copy and CTAs could not
 * paint until it had downloaded and parsed. Split out, the hero content renders immediately and the
 * WebGL backdrop attaches as soon as its chunk lands (it already had a warm-up delay of its own).
 */
const Beams = React.lazy(() => import('./reactbits/Beams'));

/*
 * Lazy alone was not enough. React renders Hero on the first commit, hits the Suspense boundary and
 * fires the dynamic import immediately, so the ~221 kB gzipped three.js chunk still downloaded inside
 * the critical window - measured at 1700 ms on the live site, the slowest resource on the page, for a
 * decorative backdrop. Holding the import until the browser is idle hands the headline, copy and CTAs
 * the full pipe first. The backdrop's own 1.8s reveal covers the later arrival, and the hero already
 * paints black with its grid overlay underneath, so nothing is ever blank.
 */
const useIdleMount = (timeout = 2500) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const request = window.requestIdleCallback;
    if (typeof request !== 'function') {
      // Safari has no requestIdleCallback - fall back to a macrotask after paint
      const timer = setTimeout(() => setReady(true), 200);
      return () => clearTimeout(timer);
    }

    const handle = request(() => setReady(true), { timeout });
    return () => window.cancelIdleCallback?.(handle);
  }, [timeout]);

  return ready;
};

/* High-Performance Smooth Number Counter Component (0 React re-renders during animation) */
const AnimatedCounter = React.memo(({ value, duration = 2000, decimals = 0, suffix = '' }) => {
  const spanRef = useRef(null);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;
    let lastRendered = -1;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease out exponential curve
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = easeProgress * value;

            const rounded = decimals > 0 ? current.toFixed(decimals) : Math.round(current);
            if (rounded !== lastRendered && spanRef.current) {
              lastRendered = rounded;
              spanRef.current.textContent = `${rounded}${suffix}`;
            }

            if (progress < 1) {
              animationFrameId = requestAnimationFrame(step);
            } else if (spanRef.current) {
              spanRef.current.textContent = `${value.toFixed(decimals)}${suffix}`;
            }
          };
          animationFrameId = requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (spanRef.current) {
      observer.observe(spanRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration, decimals, suffix]);

  return <span ref={spanRef}>0{suffix}</span>;
});

const Hero = () => {
  const backdropReady = useIdleMount();

  return (
    <section id="hero" className="relative min-h-screen w-full bg-black text-white flex flex-col justify-between overflow-hidden pt-36 sm:pt-56 md:pt-64 pb-20 sm:pb-36 md:pb-44">
      {/* 3D Beams Background Component from React Bits */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0">
        {/*
          The reveal sits inside the Suspense boundary on purpose. On the outer wrapper it played out
          against an empty div while the three.js chunk was still downloading, so the backdrop still
          snapped in. Mounted with Beams, the fade actually covers its arrival.
        */}
        <Suspense fallback={null}>
          {backdropReady && (
          <div className="reveal-backdrop absolute inset-0 w-full h-full">
            <Beams
              beamWidth={2}
              beamHeight={16}
              beamNumber={12}
              lightColor="#ffffff"
              beamColor="#000000"
              backgroundColor="#000000"
              speed={2}
              noiseIntensity={1.75}
              scale={0.2}
              rotation={0}
            />
          </div>
          )}
        </Suspense>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-lines pointer-events-none opacity-20 z-0"></div>

      {/* Spacious & Refined Content Container */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 my-auto pt-6 sm:pt-16 md:pt-24 text-left">
        {/* Brand Main Title - Whyzo Bold, Creatives Regular */}
        <div className="leading-none select-none">
          <h1 className="text-[clamp(2.75rem,12vw,4rem)] sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase font-poppins flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-baseline gap-y-1.5 sm:gap-y-0 gap-x-[0.28em]">
            <span className="reveal-mask font-bold poppins-bold" style={{ '--reveal-delay': '120ms' }}>
              {/* Inner wrapper carries the mask rise - ShinyText sets its own inline animation */}
              <span>
                <ShinyText
                  text="WHYZO"
                  speed={4.5}
                  delay={3.5}
                  color="#71717a"
                  shineColor="#ffffff"
                  spread={160}
                />
              </span>
            </span>
            <span className="reveal-mask font-normal poppins-regular" style={{ '--reveal-delay': '260ms' }}>
              <span>
                <ShinyText
                  text="CREATIVES"
                  speed={4.5}
                  delay={3.5}
                  color="#71717a"
                  shineColor="#ffffff"
                  spread={160}
                />
              </span>
            </span>
          </h1>
        </div>

        {/* Subtitle / Positioning - Balanced editorial spacing */}
        <div className="reveal-hero mt-6 sm:mt-10 md:mt-14 max-w-4xl" style={{ '--reveal-delay': '420ms' }}>
          <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-normal leading-relaxed tracking-normal font-poppins poppins-regular">
            An elite creative production company defining visual culture through <span className="text-white font-semibold poppins-semibold underline underline-offset-4 decoration-white/30">Videography,</span>
            <br />
            <span className="text-white font-semibold poppins-semibold underline underline-offset-4 decoration-white/30">AI Video, Photography, & Web Development</span> for leading brands.
          </p>
        </div>

        {/* CTA Button Group */}
        <div className="reveal-hero flex flex-wrap items-center gap-4 sm:gap-6 mt-12 sm:mt-24 md:mt-28 lg:mt-32" style={{ '--reveal-delay': '560ms' }}>
          <LiquidMetalButton
            label="Explore Our Work"
            icon={<ArrowDownRight className="w-4 h-4 text-white" />}
            onClick={() => {
              document.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          <LiquidMetalButton
            label="Start a Project"
            onClick={() => {
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      </div>

      {/* Bottom Metrics Bar - Aligned Right with Counting Animation & Clean Surface */}
      <div className="reveal-hero relative z-10 w-full max-w-[1920px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 mt-14 sm:mt-28 md:mt-32 flex justify-end" style={{ '--reveal-delay': '700ms' }}>
        <div className="group inline-grid grid-cols-2 gap-6 sm:gap-12 p-5 sm:p-6 px-7 sm:px-10 rounded-2xl bg-[#0a0a0c] border border-white/10 hover:border-white/25 transition-colors duration-200">
          <div className="border-r border-white/10 pr-6 sm:pr-12">
            <div className="mb-1.5 flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight font-mono">
                <AnimatedCounter value={800} duration={2200} decimals={0} suffix="+" />
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="block text-xs uppercase tracking-widest text-zinc-400 font-medium font-mono">
                Global Projects
              </span>
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight font-mono">
                <AnimatedCounter value={4.9} duration={2400} decimals={1} suffix="/5" />
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="block text-xs uppercase tracking-widest text-zinc-400 font-medium font-mono">
                Client Rating
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
