import React from 'react';
import ShinyText from './reactbits/ShinyText';
import Reveal from './Reveal';

const AboutSection = () => {
  return (
    <section id="about" className="pt-20 sm:pt-28 md:pt-36 pb-20 sm:pb-28 md:pb-36 bg-black text-white relative border-t border-white/10 overflow-hidden w-full">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-lines opacity-10 pointer-events-none"></div>

      {/* Ambient Radial Gradient - Zero Blur Overhead */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.035) 0%, transparent 70%)'
        }}
      />

      <div className="w-full max-w-[1700px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 relative z-10">
        {/* Section Header */}
        <Reveal className="mb-12 sm:mb-16 text-center flex flex-col items-center">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-3">
            
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight font-poppins poppins-bold text-white text-center">
            <ShinyText text="ABOUT THE COMPANY" speed={4.5} delay={3.5} color="#888888" shineColor="#ffffff" />
          </h2>
        </Reveal>

        {/* Studio Manifesto Statement */}
        <Reveal delay={120} className="max-w-6xl mx-auto text-center">
          <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-normal leading-snug tracking-tight text-zinc-200 font-poppins [text-wrap:balance]">
            Whyzo Creatives is a creative production company for{' '}
            <span className="text-white font-semibold">
              brands, people, and ideas
            </span>{' '}
            that deserve{' '}
            <span className="text-white font-semibold whitespace-nowrap">
              more than basic content.
            </span>
          </p>
          <p className="mt-8 text-sm sm:text-base md:text-lg lg:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-normal font-poppins [text-wrap:balance]">
            We create commercials, social content, campaigns, events, photography &amp; visual stories with a focus on making{' '}
            <span className="text-zinc-200 font-medium whitespace-nowrap">
              every frame feel fresh.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default React.memo(AboutSection);
