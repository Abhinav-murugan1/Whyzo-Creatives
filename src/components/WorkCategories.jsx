import React, { useState } from 'react';
import ShinyText from './reactbits/ShinyText';
import { Eye, Filter } from 'lucide-react';

const categoriesList = [
  'All',
  'F&B',
  'Automotive',
  'Events',
  'Social Media Contents',
  'Personal Branding',
  'Influencer Marketing'
];

const projectsData = [
  {
    id: 'fb-01',
    title: 'AURA Artisanal Mixology & Dining',
    category: 'F&B',
    client: 'AURA Hospitality Group',
    year: '2026',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop',
    metrics: '+3.4M Impressions // 42% Order Conversion Lift',
    deliverables: ['Cinematic Commercial Film', 'Food & Drink Stills', 'Social Reels Suite', 'Menu Web Design'],
    description: 'Ultra-dark aesthetic culinary film and photographic series showcasing molecular mixology and Michelin-rated plating for AURA flagship launch.'
  },
  {
    id: 'auto-01',
    title: 'Veloce Hypercar Concept Debut',
    category: 'Automotive',
    client: 'Veloce Automotive AG',
    year: '2026',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop',
    metrics: '1.2M Organic Views // Geneva Motor Show Feature',
    deliverables: ['AI Generative Reveal Video', 'Studio Anamorphic Shoot', '3D Web Configurator', 'Press Kit Graphics'],
    description: 'Combined synthetic neural AI rendering with real-world track videography for the global reveal of the Veloce EV Concept.'
  },
  {
    id: 'events-01',
    title: 'NOCTURNE Global Music Festival',
    category: 'Events',
    client: 'Nocturne Live Nation',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    metrics: '45,000 Attendees // 100% Ticket Sellout in 14 Mins',
    deliverables: ['Multi-Cam Aftermovie', 'Live Stream Broadcast', 'Real-Time Social Clips', 'Stage Visual Loops'],
    description: 'High-octane event capture, 12-camera live video editing, and dynamic LED wall visuals for 3-day electro music spectacle.'
  },
  {
    id: 'social-01',
    title: 'MONOCHROME Daily Reel Velocity',
    category: 'Social Media Contents',
    client: 'Monochrome Fashion',
    year: '2026',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    metrics: '18.5M Total Reel Views // +140K New Followers',
    deliverables: ['9:16 Vertical Video Production', 'Fast-Cut Color Grade', 'Trendy Sound Design', 'Thumbnail Graphics'],
    description: 'High-frequency street style and studio motion content package designed for viral TikTok and Instagram Reels engagement.'
  },
  {
    id: 'branding-01',
    title: 'Dr. Evelyn Thorne Executive Brand',
    category: 'Personal Branding',
    client: 'Thorne AI Robotics Lab',
    year: '2026',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop',
    metrics: 'Keynote Feature at CES // Forbes Editorial',
    deliverables: ['Executive Portrait Photography', 'Documentary Short Film', 'Personal Web Architecture', 'Press Bio Kit'],
    description: 'Positioning a tech founder as a global thought leader through minimalist portraiture, web design, and cinematic keynotes.'
  },
  {
    id: 'influencer-01',
    title: 'KAIZEN X Creator Collab Campaign',
    category: 'Influencer Marketing',
    client: 'Kaizen Performance Wear',
    year: '2026',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
    metrics: '$2.8M Campaign Revenue // 24 Creator Partnerships',
    deliverables: ['Creator Media Guidelines', 'Custom AI Filter & FX', 'Co-Branded Video Reels', 'Web Landing Page'],
    description: 'End-to-end management of 24 top-tier creators for a synchronized global product drop with custom video assets and landing pages.'
  },
  {
    id: 'fb-02',
    title: 'Kuro Coffee & Roastery Minimalist Identity',
    category: 'F&B',
    client: 'Kuro Roasters Tokyo',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop',
    metrics: 'Design Award Winner 2025 // 3 New Flagship Stores',
    deliverables: ['Packaging & Label Design', 'Product Photography', 'Brand Film', 'E-commerce Web Dev'],
    description: 'Japanese minimalist coffee packaging, slow-motion brewing videography, and sleek e-commerce website development.'
  },
  {
    id: 'auto-02',
    title: 'Apex Racing Track Day Experience',
    category: 'Automotive',
    client: 'Apex Motors UK',
    year: '2026',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
    metrics: 'FPV Drone Track Pursuit // 2.1M YouTube Views',
    deliverables: ['FPV High-Speed Drone Videography', 'Audio Engine Soundscape', 'Social Ad Cutdown'],
    description: 'Thrilling 120mph FPV drone tracking shots capturing supercars pushing limits on Nürburgring circuit.'
  }
];

const WorkCategories = ({ onSelectProject }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All'
    ? projectsData
    : projectsData.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="work" className="py-24 bg-black text-white relative border-t border-white/10">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-lines opacity-15 pointer-events-none"></div>

      <div className="w-full max-w-[1700px] mx-auto px-8 sm:px-12 md:px-16 lg:px-24 relative z-10">
        {/* Section Header - Refined Typography */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 pb-8 border-b border-white/10 gap-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase block mb-2">
              PORTFOLIO // 06 WORK CATEGORIES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight">
              <ShinyText text="FEATURED WORK" speed={2.2} color="#888888" shineColor="#ffffff" />
            </h2>
          </div>
          <p className="text-zinc-400 max-w-md text-sm md:text-base leading-relaxed">
            Filter our production archives across F&B, Automotive, Events, Social Media, Personal Branding, and Influencer Marketing.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-12 scrollbar-none">
          <div className="flex items-center gap-2 text-zinc-500 mr-2 text-xs font-mono uppercase tracking-wider shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Category:</span>
          </div>

          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-black font-semibold shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                  : 'bg-zinc-900/80 text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid - 3 & 4 Column Wide Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject && onSelectProject(project)}
              className="group relative rounded-2xl bg-zinc-950/80 border border-white/10 overflow-hidden cursor-pointer hover:border-white/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Media Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                  loading="lazy"
                />
                
                {/* Overlay Badge */}
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono uppercase tracking-widest text-white">
                  {project.category}
                </div>

                <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Eye className="w-4 h-4" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-2">
                    <span>CLIENT: {project.client}</span>
                    <span>{project.year}</span>
                  </div>

                  <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-2 group-hover:text-zinc-200">
                    {project.title}
                  </h3>

                  <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>

                {/* Card Footer Metrics */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-400 tracking-wider">
                    {project.metrics}
                  </span>
                  <span className="text-xs font-mono uppercase text-zinc-400 group-hover:text-white transition-colors">
                    Details &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkCategories;
