import React, { useState, useEffect } from 'react';
import ShinyText from './reactbits/ShinyText';
import DriftWall from './reactbits/DriftWall';
import Reveal from './Reveal';
import { galleryItems } from '../data/galleryItems';

const Gallery = ({ onSelectWork }) => {
  // Dynamically calibrate column count by viewport to prevent decoder thrashing and excessive offscreen tiles
  const [columns, setColumns] = useState(() => {
    if (typeof window === 'undefined') return 8;
    return window.innerWidth < 640 ? 5 : window.innerWidth < 1024 ? 7 : 8;
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const target = w < 640 ? 5 : w < 1024 ? 7 : 8;
      setColumns(prev => (prev !== target ? target : prev));
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="gallery" className="pt-20 sm:pt-28 md:pt-36 pb-28 sm:pb-36 md:pb-48 bg-black text-white relative border-t border-white/10 overflow-hidden w-full">
      {/* Target anchor alias for work */}
      <span id="work" className="sr-only" aria-hidden="true"></span>

      {/* Background Grid Lines */}
      <div className="absolute inset-0 bg-grid-lines opacity-10 pointer-events-none"></div>

      {/* Section Title Header - Centered in Poppins & Shifted Up */}
      <Reveal className="w-full px-4 -mt-4 sm:-mt-6 md:-mt-8 mb-10 sm:mb-14 relative z-10 text-center flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight font-poppins poppins-bold text-white text-center">
          <ShinyText text="GALLERY" speed={4.5} delay={3.5} color="#888888" shineColor="#ffffff" />
        </h2>
        <p className="mt-3.5 text-xs sm:text-sm md:text-base text-zinc-400 max-w-4xl mx-auto font-poppins font-normal leading-relaxed [text-wrap:balance]">
          A collection of films, campaigns, reels, events, and visuals we’ve created{' '}
          <span className="whitespace-nowrap">along the way.</span>
        </p>
      </Reveal>

      {/* Full-Bleed Edge-to-Edge 3D Video Wall */}
      <div className="relative w-full overflow-hidden">
        {/* Ambient Lighting Backdrop - GPU Accelerated Radial Gradient */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[500px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.02) 0%, transparent 70%)'
          }}
        />

        {/* Screen-Filling DriftWall Stage */}
        <div className="w-full h-[700px] sm:h-[800px] md:h-[880px] relative">
          <DriftWall
            items={galleryItems}
            columns={columns}
            tileWidth={250}
            tileHeight={158}
            gap={18}
            radius={14}
            tilt={14}
            turn={-12}
            perspective={1100}
            depth={120}
            speed={38}
            direction="up"
            variance={0.42}
            parallax={0.55}
            lift={56}
            fade={0.5}
            dim={0.65}
            overlayColor="#040409"
            onTileClick={(item) => onSelectWork && onSelectWork(item)}
          />

          {/* Smooth Zero-Cost Gradient Vignettes - Seamless Fade Into Pure Black */}
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-black via-black/80 to-transparent z-20" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-black via-black/80 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-black via-black/70 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-32 bg-gradient-to-l from-black via-black/70 to-transparent z-20" />
        </div>
      </div>
    </section>
  );
};

export default Gallery;
