import React from 'react';
import ShinyText from './reactbits/ShinyText';
import { teamMembers } from '../data/teamMembers';
import { ArrowUpRight } from 'lucide-react';

const Team = ({ onBack, onInquire, onOpenMember }) => {

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans antialiased pt-16 sm:pt-20 md:pt-24 pb-20 relative overflow-hidden">
      {/* Background Ambience & Grid - GPU Accelerated Gradient (0 Blur Overhead) */}
      <div className="absolute inset-0 bg-grid-lines opacity-15 pointer-events-none"></div>
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.035) 0%, transparent 70%)'
        }}
      />

      {/*
        * Narrower column than the rest of the site on purpose. Roster rows are a reading layout, and at
        * 1700px the bio stranded itself against a 300px portrait with half a screen of dead panel between
        * them. 1200px keeps the portrait, the copy and the action inside one comfortable measure.
        */}
      <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 relative z-10">
        {/* Page Header */}
        <div className="reveal-in mb-10 sm:mb-12 text-center flex flex-col items-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight font-poppins poppins-bold text-center">
            <ShinyText text="OUR TEAM" speed={4.5} delay={3.5} color="#888888" shineColor="#ffffff" />
          </h1>
        </div>

        {/*
          * Roster rows. One member per full-width row: portrait on the left, identity and vision on the
          * right. The stacked-card grid gave every member the same small square and pushed the bio down
          * into a cramped column; a horizontal row lets the portrait run tall and the copy breathe, and
          * it reads like a credits list, which suits a production company. Below `sm` the row collapses
          * back to portrait-over-copy so the photo never squeezes to a sliver.
          */}
        <div className="space-y-5 sm:space-y-6 mb-16 sm:mb-20">
          {teamMembers.map((member, index) => (
            <article
              key={member.id}
              onClick={() => onOpenMember(member.id)}
              className="reveal-in group relative grid grid-cols-1 sm:grid-cols-[minmax(0,15rem)_1fr] lg:grid-cols-[minmax(0,19rem)_1fr] overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0a0a0c] border border-white/10 hover:border-white/35 hover:bg-zinc-950/80 cursor-pointer transition-[border-color,background-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(0,0,0,0.85)]"
              style={{ '--reveal-delay': `${120 + index * 90}ms` }}
            >
              {/* Oversized roster numeral, sunk into the panel rather than sitting on it */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-2 right-4 select-none font-mono font-bold leading-none text-[5.5rem] lg:text-[8rem] text-white/[0.035] group-hover:text-white/[0.06] transition-colors duration-500"
              >
                {member.num}
              </span>

              {/* Portrait */}
              <div className="relative overflow-hidden bg-zinc-900 aspect-[16/10] sm:aspect-auto sm:min-h-[19rem]">
                <img
                  src={member.image}
                  alt={`${member.name} - ${member.role} at Whyzo Creatives`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[600ms] ease-out will-change-transform group-hover:scale-[1.04]"
                  style={{ transform: 'translateZ(0)' }}
                />
                {/*
                  * Dissolve the portrait into the panel instead of ending it on a hard edge - downward on
                  * mobile where the copy sits underneath, rightward on desktop where it sits beside.
                  */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-transparent sm:to-[#0a0a0c]" />
              </div>

              {/* Identity & vision */}
              <div className="relative flex flex-col justify-between gap-6 p-6 sm:p-7 lg:p-9">
                <div className="space-y-4">
                  {/*
                    * Discipline tag only - the oversized numeral above already states the index, and
                    * printing it twice on one card read as a mistake. The rule extends on hover as the
                    * only motion in the copy column.
                    */}
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                      {member.tag}
                    </span>
                    <span className="h-px w-8 bg-white/15 group-hover:w-16 group-hover:bg-white/40 transition-all duration-500 ease-out" />
                  </div>

                  <div>
                    <h2 className="font-poppins poppins-bold font-bold text-2xl sm:text-3xl lg:text-[2.1rem] leading-none uppercase tracking-tight text-white">
                      {member.name}
                    </h2>
                    <p className="mt-2.5 text-[13px] sm:text-sm font-poppins font-medium text-zinc-300">
                      {member.role}
                    </p>
                  </div>

                  {/* Vision only - specialisations, socials and stats all live on the portfolio page */}
                  <p className="max-w-2xl text-xs sm:text-[13px] leading-relaxed text-zinc-400">
                    {member.bio}
                  </p>
                </div>

                <div className="flex items-center justify-end pt-5 border-t border-white/10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenMember(member.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-mono uppercase tracking-wider bg-white/10 hover:bg-white text-white hover:text-black group-hover:bg-white group-hover:text-black transition-colors cursor-pointer"
                  >
                    <span>View Portfolio</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Collective Statement / CTA Banner */}
        <div className="rounded-2xl bg-zinc-950 border border-white/15 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="max-w-xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">
              WHYZO PRODUCTION ROSTER
            </span>
            <h3 className="font-poppins poppins-bold font-bold text-2xl sm:text-3xl uppercase tracking-tight text-white mb-2">
              Need a crew for your next shoot?
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              We're a lowkey creative team handling everything from concept to camera to final cut.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-full border border-white/20 hover:border-white/40 text-white text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer"
            >
              Explore Services
            </button>
            <button
              onClick={() => {
                if (onInquire) {
                  onInquire('General Production');
                } else {
                  onBack();
                }
              }}
              className="px-6 py-3 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              Start a Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
