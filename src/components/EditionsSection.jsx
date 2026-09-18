import React, { useState } from 'react';
import ShinyText from './reactbits/ShinyText';
import { Cpu, Zap, Layers, Globe, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const editionFeatures = [
  {
    id: 'feature-01',
    code: 'RELEASE // 2026.1',
    tag: 'NEURAL AI VIDEO SYNTHESIS',
    title: 'Generative Cinema at 8K Quality',
    icon: Cpu,
    headline: 'Hyper-realistic video generation without traditional camera rigs.',
    body: 'Whyzo Creations integrates custom trained Diffusion & Transformer models to generate high-fidelity commercial shots, fluid particle VFX, and synthetic environments in minutes.',
    specs: ['Zero Location Friction', 'Custom LoRA Model Training', 'Full Commercial Rights', '4K/8K Upscaling Pipeline'],
    stat: '10x Faster Turnaround',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'feature-02',
    code: 'RELEASE // 2026.2',
    tag: 'ANAMORPHIC OPTICS & COLOR',
    title: 'RED Cinema & DaVinci Pipeline',
    icon: Zap,
    headline: 'Standard-setting 16-bit color fidelity and oval bokeh flares.',
    body: 'Our physical video production suite features Cooke Anamorphic glass, 120fps high-speed capture, and custom DaVinci Resolve color profiles built specifically for luxury brand visual identity.',
    specs: ['RED V-Raptor 8K VV', 'Cooke Anamorphic Lenses', 'Wireless Teradek Zero-Delay', 'Custom Film Grain LUTs'],
    stat: '16-Bit RAW Processing',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'feature-03',
    code: 'RELEASE // 2026.3',
    tag: 'REACT + THREE.JS WEB ARCHITECTURE',
    title: 'Immersive Web & E-Commerce',
    icon: Globe,
    headline: 'Sub-second page loads with 60fps WebGL visual experiences.',
    body: 'We design and code headless web platforms using React, Vite, Three.js shaders, and Tailwind CSS. We don’t build template sites; we engineer digital flagship destinations.',
    specs: ['60 FPS WebGL Shaders', 'Headless E-commerce', 'Lighthouse 99+ Speed Rating', 'Responsive Spatial Design'],
    stat: '99+ Lighthouse Score',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'feature-04',
    code: 'RELEASE // 2026.4',
    tag: 'VIRAL CONTENT ENGINE',
    title: 'Omnichannel Social Dominance',
    icon: Layers,
    headline: 'Aggressive content velocity across Reels, Shorts & TikTok.',
    body: 'From F&B to Automotive and Personal Brands, our social media content engine crafts 30-day vertical video calendars engineered for algorithmic reach and high retention.',
    specs: ['Automated Batch Filming', 'Hook-Optimized Edits', 'Trend Audio Licensing', 'Analytics Performance Audits'],
    stat: '50M+ Organic Reach',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop'
  }
];

const EditionsSection = () => {
  const [activeTab, setActiveTab] = useState(editionFeatures[0]);

  return (
    <section id="editions" className="py-24 bg-black text-white relative border-t border-white/10 overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-lines opacity-15 pointer-events-none"></div>

      <div className="w-full max-w-[1700px] mx-auto px-8 sm:px-12 md:px-16 lg:px-24 relative z-10">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-white/10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono tracking-widest text-zinc-300 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>THE WHYZO EDITIONS // SPRING 2026</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight">
              <ShinyText text="PRODUCTION FRAMEWORK" speed={4.5} delay={3.5} color="#888888" shineColor="#ffffff" />
            </h2>
          </div>
          <p className="text-zinc-400 max-w-md text-sm md:text-base leading-relaxed">
            Inspired by international design standards, our Spring 2026 release brings four core innovations to every project we touch.
          </p>
        </div>

        {/* Interactive Edition Selector Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Feature Buttons (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {editionFeatures.map((feat, idx) => {
              const isSelected = activeTab.id === feat.id;
              const IconComp = feat.icon;
              return (
                <button
                  key={feat.id}
                  onClick={() => setActiveTab(feat)}
                  className={`w-full text-left p-6 rounded-2xl transition-all duration-300 cursor-pointer flex items-center justify-between border ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-[0_0_25px_rgba(255,255,255,0.15)]'
                      : 'bg-zinc-950/70 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${isSelected ? 'bg-black text-white' : 'bg-white/5 text-zinc-300'}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className={`block text-[10px] font-mono uppercase tracking-widest ${isSelected ? 'text-zinc-700' : 'text-zinc-500'}`}>
                        {feat.code}
                      </span>
                      <span className="text-base font-bold uppercase tracking-tight">
                        0{idx + 1}. {feat.title}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className={`w-5 h-5 transition-transform ${isSelected ? 'translate-x-1 text-black' : 'text-zinc-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Interactive Feature Detail Viewer (7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-zinc-950 border border-white/20 p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Background Image Preview */}
            <div className="absolute top-0 right-0 w-full h-full opacity-15 pointer-events-none">
              <img src={activeTab.image} alt={activeTab.title} className="w-full h-full object-cover grayscale contrast-150" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
            </div>

            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-3 py-1 rounded bg-white/10 text-white border border-white/20">
                  {activeTab.tag}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {activeTab.stat}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-white">
                {activeTab.title}
              </h3>

              <p className="text-base text-zinc-200 font-medium leading-relaxed">
                "{activeTab.headline}"
              </p>

              <p className="text-zinc-400 text-sm leading-relaxed">
                {activeTab.body}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/10">
                {activeTab.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                    <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                WHYZO CREATIONS // EDITIONS SPRING 2026
              </span>
              <a
                href="#contact"
                className="px-6 py-3 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors"
              >
                Inquire Implementation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditionsSection;
