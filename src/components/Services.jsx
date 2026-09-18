import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ShinyText from './reactbits/ShinyText';
import Reveal from './Reveal';
import { 
  Video, 
  Camera, 
  Film, 
  Palette, 
  Layout, 
  Bot, 
  Code2, 
  ArrowRight,
  ChevronRight,
  X
} from 'lucide-react';

const servicesData = [
  {
    id: 'videography',
    num: '01',
    category: 'motion',
    categoryLabel: 'Cinema & Motion',
    tag: 'RED CINEMA // 8K RAW',
    stat: '8K 120FPS RAW',
    title: 'Videography',
    icon: Video,
    shortDesc: 'Cinematic 4K/8K commercial film, brand documentaries, and anamorphic multi-cam production.',
    details: 'Our videography team deploys RED Cinema and Sony FX Series cameras paired with Cooke anamorphic optics to capture breathtaking imagery that commands viewer attention and drives brand prestige.',
    image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789577552/events/opt_GITEX_2025.jpg',
    video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789577552/events/opt_GITEX_2025.mp4',
    hardware: ['RED V-Raptor 8K VV', 'Cooke Anamorphic Glass', 'DJI Ronin 4D Rig', 'Heavy-Lift Cinema Drones'],
    deliverables: [
      'Commercial Brand Spots (16:9 & 9:16)',
      'Feature Brand Documentaries',
      '4K Drone Cinematic Aerials',
      'Multi-Cam Live Event Capture'
    ]
  },
  {
    id: 'photography',
    num: '02',
    category: 'motion',
    categoryLabel: 'Cinema & Motion',
    tag: 'EDITORIAL // MEDIUM FORMAT',
    stat: '100MP Resolution',
    title: 'Photography',
    icon: Camera,
    shortDesc: 'High-fashion lookbooks, F&B culinary art, automotive track, and executive studio portraiture.',
    details: 'Precision strobe lighting and 100MP medium-format sensors deliver publication-ready imagery engineered for high-impact digital campaigns, luxury billboards, and print collateral.',
    image: 'https://res.cloudinary.com/hbmeplwl/image/upload/v1789581879/photos/product/opt_MC_AIRPODS.jpg',
    hardware: ['Phase One 100MP System', 'Profoto Pro-11 Strobe Kit', 'Hasselblad HC Glass', 'Tethered 4K Review Station'],
    deliverables: [
      'High-Fashion & Lookbooks',
      'F&B Culinary Art Stills',
      'Automotive Studio & Track Stills',
      'Executive & Artist Headshots'
    ]
  },
  {
    id: 'video-editing',
    num: '03',
    category: 'motion',
    categoryLabel: 'Cinema & Motion',
    tag: 'POST // DAVINCI RESOLVE',
    stat: '16-Bit Color Science',
    title: 'Video Editing',
    icon: Film,
    shortDesc: 'Hollywood-grade post-production, DaVinci Resolve color science, sound design, and narrative rhythm.',
    details: 'Post-production is where story comes alive. We sculpt raw footage into compelling narrative arcs with rhythm, impact, 16-bit color science, custom film grain, and spatial sound mastering.',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
    hardware: ['DaVinci Resolve Studio', 'Dolby Atmos Audio Suite', 'After Effects VFX Node', 'Custom Film Grain LUTs'],
    deliverables: [
      'DaVinci LUT Color Grade',
      'Spatial Sound Design & Mastering',
      'Social Vertical Cutdowns (9:16)',
      'Motion Graphics & Title Cards'
    ]
  },
  {
    id: 'graphic-designing',
    num: '04',
    category: 'design',
    categoryLabel: 'Brand & Design',
    tag: 'IDENTITY // TYPOGRAPHY',
    stat: 'Vector Precision',
    title: 'Graphic Designing',
    icon: Palette,
    shortDesc: 'Minimalist brand identities, international typography systems, editorial layouts, and vector assets.',
    details: 'We engineer timeless visual identities rooted in international typographic style, Swiss grid systems, and brutalist minimalism that establish iconic market presence.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    hardware: ['Adobe Illustrator Suite', 'Custom Font Architecture', 'Vector CAD Engines', 'Figma Design Tokens'],
    deliverables: [
      'Comprehensive Brand Guidelines',
      'Typography Architecture & Systems',
      'Luxury Packaging & Merch Design',
      'Multi-Platform Campaign Suites'
    ]
  },
  {
    id: 'web-designing',
    num: '05',
    category: 'design',
    categoryLabel: 'Brand & Design',
    tag: 'UI/UX // SPATIAL INTERACTION',
    stat: 'Pixel-Perfect UX',
    title: 'Web Designing',
    icon: Layout,
    shortDesc: 'Spatial UI/UX design systems, interactive Figma prototypes, and conversion-focused dark layouts.',
    details: 'Crafting responsive user interfaces with strict grid alignment, micro-interactions, dark aesthetic nuances, and accessible hierarchy that elevate digital brand prestige.',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    hardware: ['Figma Master UI Kits', 'Framer Micro-Prototypes', 'Spatial Responsive Grids', 'Design Tokens Engine'],
    deliverables: [
      'Production Figma UI Kits',
      'Clickable Interactive Prototypes',
      'Responsive Mobile/Desktop Layouts',
      'Design System Documentation'
    ]
  },
  {
    id: 'ai-video-creation',
    num: '06',
    category: 'tech',
    categoryLabel: 'Web & AI Tech',
    tag: 'GEN-AI // NEURAL VIDEO',
    stat: '10x CGI Velocity',
    title: 'AI Video Creation',
    icon: Bot,
    shortDesc: 'Next-gen generative video synthesis, neural rendering, AI digital avatars, and surreal cinematic VFX.',
    details: 'Leveraging cutting-edge Gen-AI models (Sora, Runway Gen-3, Midjourney v6, Kling) to synthesize impossible visual sequences, fluid particle VFX, and synthetic worlds at fraction of traditional CGI costs.',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop',
    hardware: ['Runway Gen-3 Alpha', 'OpenAI Sora Pipeline', 'Midjourney v6 Custom LoRAs', 'Topaz Video AI Upscaling'],
    deliverables: [
      'Generative Neural Commercial Video',
      'Prompt-Engineered Surreal VFX',
      'AI Voice-Over & Digital Avatars',
      'Synthetic 3D Environment Backgrounds'
    ]
  },
  {
    id: 'web-development',
    num: '07',
    category: 'tech',
    categoryLabel: 'Web & AI Tech',
    tag: 'FULL-STACK // WEBGL 3D',
    stat: '60 FPS WebGL',
    title: 'Web Development & Designing',
    icon: Code2,
    shortDesc: 'Full-stack custom web engineering using React, Vite, Three.js shaders, and headless architectures.',
    details: 'End-to-end engineering of lightning-fast web applications featuring 60fps WebGL animations, custom GLSL shaders, Lighthouse 99+ speed ratings, and clean component architecture.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    hardware: ['React 19 & Vite Engine', 'Three.js & GLSL Shaders', 'Tailwind CSS v4', 'Headless CMS & Edge CDN'],
    deliverables: [
      'Custom React / Vite Web Platforms',
      'Headless E-Commerce flagships',
      'Three.js 3D Web Experiences',
      'Lighthouse 99+ Speed Optimization'
    ]
  }
];

const Services = ({ onSelectService }) => {
  const [activeServiceId, setActiveServiceId] = useState(servicesData[0].id);
  const [mobileActiveId, setMobileActiveId] = useState(null);

  const activeService = servicesData.find((s) => s.id === activeServiceId) || servicesData[0];

  const handleAction = (serviceTitle) => {
    const workElem = document.querySelector('#gallery') || document.querySelector('#work') || document.querySelector('#works');
    if (workElem) {
      workElem.scrollIntoView({ behavior: 'smooth' });
    } else if (onSelectService) {
      onSelectService(serviceTitle);
    } else {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="pt-20 sm:pt-28 md:pt-36 pb-14 sm:pb-18 bg-black text-white relative border-t border-white/10 overflow-hidden">
      {/* Background Grid Lines */}
      <div className="absolute inset-0 bg-grid-lines opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-[1700px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 relative z-10">
        {/* Section Header - Centered in Poppins & Shifted Up Alone */}
        <Reveal className="-mt-12 sm:-mt-18 md:-mt-24 mb-10 sm:mb-14 md:mb-16 text-center flex flex-col justify-center items-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight font-poppins poppins-bold text-white text-center">
            <ShinyText text="OUR SERVICES" speed={4.5} delay={3.5} color="#888888" shineColor="#ffffff" />
          </h2>
          <p className="mt-3 text-xs sm:text-sm md:text-base text-zinc-400 max-w-xl mx-auto font-poppins font-normal leading-relaxed">
            We make brands look good. And feel even better.

          </p>
        </Reveal>

        {/* Desktop & Tablet: Interactive Split-Stage Showcase */}
        <Reveal delay={120} className="hidden lg:grid grid-cols-12 gap-7 items-stretch">
          {/* Left Column: 7 Disciplines Minimal Selector List (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-2">
            {servicesData.map((service) => {
              const isSelected = activeService.id === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => setActiveServiceId(service.id)}
                  onMouseEnter={() => setActiveServiceId(service.id)}
                  className={`w-full text-left py-3 px-4.5 rounded-xl transition-all duration-300 flex items-center justify-between cursor-pointer border ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-[0_0_18px_rgba(255,255,255,0.15)] font-semibold scale-[1.01]'
                      : 'bg-zinc-950/60 text-zinc-400 border-white/10 hover:border-white/20 hover:text-white hover:bg-zinc-900/40'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`font-mono text-xs ${isSelected ? 'text-zinc-700' : 'text-zinc-500'}`}>
                      {service.num}
                    </span>
                    <span className="text-[15px] sm:text-base font-bold uppercase tracking-tight font-poppins poppins-bold">
                      {service.title}
                    </span>
                  </div>

                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${
                    isSelected ? 'translate-x-1 text-black' : 'text-zinc-600'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Cinema Stage (7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-zinc-950/80 border border-white/15 p-6 flex flex-col justify-between backdrop-blur-xl relative overflow-hidden shadow-xl">
            {/* Visual Media Header */}
            <div className="relative aspect-[16/8] w-full rounded-xl overflow-hidden border border-white/10 mb-4 bg-zinc-900 group">
              {activeService.video ? (
                <video
                  key={activeService.id}
                  src={activeService.video}
                  poster={activeService.image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover contrast-105 brightness-95 transition-all duration-700 animate-in fade-in"
                />
              ) : (
                <img
                  src={activeService.image}
                  alt={`${activeService.title} - ${activeService.categoryLabel} | Whyzo Creatives`}
                  key={activeService.id}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover contrast-110 brightness-95 transition-all duration-700 animate-in fade-in"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>

              {/* Title Overlay */}
              <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
                <span className="font-poppins poppins-bold font-bold text-lg text-white uppercase tracking-wider drop-shadow-md">
                  {activeService.title}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  WHYZO // PRODUCTION SPEC
                </span>
              </div>
            </div>

            {/* Narrative & Craft Info */}
            <div className="space-y-2 mb-4 min-h-[114px] flex flex-col justify-start">
              <p className="text-sm sm:text-[15px] text-zinc-200 font-medium leading-relaxed line-clamp-2">
                "{activeService.shortDesc}"
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal line-clamp-3">
                {activeService.details}
              </p>
            </div>

            {/* Deliverables & Inquire CTA */}
            <div className="pt-3.5 border-t border-white/10 flex items-center justify-between gap-3.5 min-h-[66px]">
              <div className="text-xs sm:text-[13px] text-zinc-300 font-poppins min-h-[46px] flex items-center max-w-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                  {activeService.deliverables.map((item, idx) => (
                    <div key={idx} className="text-zinc-300 leading-normal">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleAction(activeService.title)}
                className="px-5.5 py-2.5 bg-white text-black font-semibold text-xs uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.12)] shrink-0"
              >
                <span>View Works</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Mobile View (< 1024px): Accordion UI from Sankalpa "What We Offer" */}
        <div className="lg:hidden border border-white/10 rounded-2xl overflow-hidden bg-zinc-950/60 backdrop-blur-md">
          {servicesData.map((service, i) => {
            const isActive = mobileActiveId === service.id;
            const isLast = i === servicesData.length - 1;
            const Icon = service.icon;
            return (
              <div key={service.id} className={!isLast ? "border-b border-white/10" : ""}>
                <button
                  type="button"
                  onClick={() => setMobileActiveId(isActive ? null : service.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 transition-all duration-300 text-left cursor-pointer ${
                    isActive ? "bg-white/10 text-white" : "text-zinc-300 hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`font-mono text-xs ${isActive ? "text-white font-semibold" : "text-zinc-500"}`}>
                      {service.num}
                    </span>
                    {Icon && (
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-white" : "text-zinc-400"}`} />
                    )}
                    <span className={`font-poppins poppins-bold font-bold text-sm sm:text-base uppercase tracking-tight transition-colors ${
                      isActive ? "text-white" : "text-zinc-200"
                    }`}>
                      {service.title}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                    isActive ? "text-white rotate-90" : "text-zinc-500"
                  }`} />
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden border-t border-white/10 bg-black/50"
                    >
                      <div className="p-4 sm:p-6 space-y-4">
                        {/* Header metadata and close button */}
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                            WHYZO // {service.categoryLabel}
                          </span>
                          <button
                            type="button"
                            onClick={() => setMobileActiveId(null)}
                            className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            aria-label="Close details"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Media Showcase */}
                        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/10 bg-zinc-900">
                          {service.video ? (
                            <video
                              src={service.video}
                              poster={service.image}
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="metadata"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={service.image}
                              alt={`${service.title} - ${service.categoryLabel} | Whyzo Creatives`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
                            <span className="font-poppins poppins-bold font-bold text-base text-white uppercase tracking-wider drop-shadow-md">
                              {service.title}
                            </span>
                            <span className="text-[9px] font-mono text-zinc-300 uppercase px-2 py-0.5 rounded bg-black/60 border border-white/15">
                              {service.stat}
                            </span>
                          </div>
                        </div>

                        {/* Narrative & Details */}
                        <div className="space-y-2">
                          <p className="text-sm text-zinc-200 font-medium leading-relaxed font-poppins">
                            "{service.shortDesc}"
                          </p>
                          <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                            {service.details}
                          </p>
                        </div>

                        {/* Deliverables */}
                        <div className="pt-2 border-t border-white/10 space-y-1.5">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                            KEY DELIVERABLES
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-zinc-300 font-poppins">
                            {service.deliverables.map((item, dIdx) => (
                              <div key={dIdx} className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-white/50 shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action CTA */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => handleAction(service.title)}
                            className="w-full py-3 bg-white text-black font-semibold text-xs uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.12)]"
                          >
                            <span>View Works</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
