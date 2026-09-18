import React from 'react';
import ShinyText from './reactbits/ShinyText';
import { InstagramIcon, LinkedinIcon, GithubIcon } from './SocialIcons';
import { teamMembers } from '../data/teamMembers';
import { ArrowUpRight, Globe } from 'lucide-react';

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

      <div className="w-full max-w-[1700px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 relative z-10">
        {/* Page Header */}
        <div className="reveal-in mb-10 sm:mb-12 text-center flex flex-col items-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight font-poppins poppins-bold text-center">
            <ShinyText text="OUR TEAM" speed={4.5} delay={3.5} color="#888888" shineColor="#ffffff" />
          </h1>
        </div>

        {/* 4 Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 mb-16 sm:mb-20">
          {teamMembers.map((member, index) => {
            return (
              <div
                key={member.id}
                onClick={() => onOpenMember(member.id)}
                className="reveal-in rounded-2xl p-6 sm:p-7 flex flex-col justify-between bg-[#0a0a0c] border border-white/10 hover:border-white/35 hover:bg-zinc-950/80 transition-all duration-300 relative overflow-hidden cursor-pointer group hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.8)]"
                style={{ '--reveal-delay': `${120 + index * 90}ms` }}
              >
                {/* Visual Media / Portrait */}
                <div className="relative aspect-[4/4.8] w-full rounded-xl overflow-hidden mb-6 bg-zinc-900">
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.role} at Whyzo Creatives`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-105"
                    style={{ transform: 'translateZ(0)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent pointer-events-none"></div>

                  {/* Bottom Portrait Info */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="font-poppins poppins-bold font-bold text-xl sm:text-2xl text-white uppercase tracking-wider drop-shadow-md">
                      {member.name}
                    </h2>
                    <p className="text-xs sm:text-[13px] font-poppins font-medium text-zinc-300 mt-1 drop-shadow">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Candidate Information & Bio */}
                <div className="space-y-5 mb-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed font-normal">
                      {member.bio}
                    </p>
                  </div>

                  {/* Specialties */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2.5">
                      Core Specializations
                    </span>
                    <div className="space-y-1.5 text-xs sm:text-[13px] text-zinc-300 font-poppins">
                      {member.specialties.map((spec, idx) => (
                        <div key={idx} className="text-zinc-300 leading-normal">
                          {spec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-4.5 border-t border-white/10 flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-1.5">
                    {member.socials.linkedin && (
                      <a
                        href={member.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg bg-zinc-900 border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition-colors"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <LinkedinIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.socials.instagram && (
                      <a
                        href={member.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg bg-zinc-900 border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition-colors"
                        aria-label={`${member.name} Instagram`}
                      >
                        <InstagramIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.socials.github && (
                      <a
                        href={member.socials.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg bg-zinc-900 border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition-colors"
                        aria-label={`${member.name} GitHub`}
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.socials.portfolio && (
                      <a
                        href={member.socials.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg bg-zinc-900 border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition-colors"
                        aria-label={`${member.name} Portfolio`}
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

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
            );
          })}
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
