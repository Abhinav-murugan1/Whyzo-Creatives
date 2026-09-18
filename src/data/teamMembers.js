import { Camera, Code2, Megaphone, Palette } from 'lucide-react';
import { workCatalogue } from './galleryItems';

/*
 * Roster data shared by the team index and each member portfolio page. Kept out of the components so
 * a member page can be resolved straight from the URL without mounting the index first.
 */
const teamMembers = [
  {
    id: 'fayaz',
    num: '01',
    name: 'Fayaz',
    role: 'Founder / Creative Director',
    discipline: 'Cinematography & Visual Direction',
    icon: Camera,
    tag: 'DIRECTION & CINEMATOGRAPHY',
    stat: '8 Years Exp',
    image: 'https://res.cloudinary.com/hbmeplwl/image/upload/v1789737113/team/fayaz_founder.jpg',
    bio: 'A filmmaker and creative director with 8 years of experience turning ideas into visual stories. Working across commercial content, real estate, automotive, events, food, and social media, with a focus on cinematic visuals and sharp storytelling.',
    specialties: [
      'Cinematography & Visual Direction',
      'Commercial & Brand Content',
      'Real Estate & Automotive Films',
      'Event & Social Media Content',
      'Video Editing & Color Grading',
      'Creative Concept & Storytelling'
    ],
    awards: '8 Years Industry Experience // Commercial & Narrative Film',
    socials: {
      linkedin: 'https://www.linkedin.com/in/whyzo-creatives-9b3212438/',
      instagram: 'https://www.instagram.com/fayuu__?stkn=MXY5eTJhdGE4dWxjaw==',
      portfolio: 'https://www.youtube.com/@Whyzocreatives'
    },
    /* Founder's profile presents the full Cloudinary library, kept on its own shelves */
    works: workCatalogue
  },
  {
    id: 'abdul-rahman',
    num: '02',
    name: 'Abdul Rahman',
    role: 'Visual Storyteller / Senior Graphic Designer',
    discipline: 'Visual Storytelling & Graphic Design',
    icon: Palette,
    tag: 'VISUAL STORYTELLING & DESIGN',
    stat: '8 Years Exp',
    image: 'https://res.cloudinary.com/hbmeplwl/image/upload/v1789739795/team/member_02.jpg',
    bio: 'A visual storyteller with 8 years of experience transforming ideas into engaging visual experiences. Working across branding, advertising, social media, sports & esports, packaging, and digital content, with a focus on creative concepts, visual communication, and impactful storytelling through design.',
    specialties: [
      'Visual Storytelling & Graphic Design',
      'Brand Identity & Visual Communication',
      'Advertising & Campaign Design',
      'Social Media & Digital Content',
      'Sports & Esports Branding',
      'Packaging & Print Design',
      'Motion Graphics & Visual Content',
      'Creative Concept & Typography'
    ],
    awards: '8 Years Industry Craft // Visual Storytelling & Design',
    socials: {
      linkedin: 'https://www.linkedin.com/in/whyzo-creatives-9b3212438/',
      instagram: 'https://www.instagram.com/whyzo.ae?stkn=dnBnMWNkY3V0cWt0'
    },
    works: [
      {
        id: 'work-02',
        title: 'Veloce Hypercar Synthetic Reveal',
        category: 'ai',
        categoryLabel: 'AI & Virtual VFX',
        client: 'Veloce Automotive AG',
        year: '2026',
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=700&auto=format&fit=crop',
        video: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        metrics: '1.2M Organic Views // Geneva Motor Show Feature',
        deliverables: ['AI Generative Reveal Video', 'Studio Anamorphic Shoot', '3D Web Configurator', 'Press Kit Graphics'],
        description: 'Combined synthetic neural AI rendering with real-world track videography for the global reveal of the Veloce EV Concept.'
      },
      {
        id: 'work-05',
        title: 'Neural Synthesis Cybernetic Sequence',
        category: 'ai',
        categoryLabel: 'AI & Virtual VFX',
        client: 'Synthetic Arts Foundation',
        year: '2026',
        image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=700&auto=format&fit=crop',
        video: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4',
        metrics: 'GenAI Film Festival Best Visual Effects',
        deliverables: ['Custom LoRA Generation', 'Fluid Particle VFX', 'Spatial Atmos Sound', '4K Neural Upscaling'],
        description: 'Surreal generative video exploration depicting cybernetic botanical evolution rendered at 10x traditional CGI speed.'
      },
      {
        id: 'work-10',
        title: 'Quantum Fluid Volumetric Simulation',
        category: 'ai',
        categoryLabel: 'AI & Virtual VFX',
        client: 'Aetheria Neural Lab',
        year: '2026',
        metrics: 'Real-Time Neural Radiance Physics',
        deliverables: ['Real-Time NeRF Simulation', 'Particle Field Dynamics', 'Spatial Audio Design'],
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=700&auto=format&fit=crop',
        video: 'https://vjs.zencdn.net/v/oceans.mp4',
        description: 'Hyper-detailed quantum fluid dynamics rendered in real-time using neural radiance fields and generative volumetric shaders.'
      }
    ]
  },
  {
    id: 'anzil-s',
    num: '03',
    name: 'Anzil S',
    role: 'Sales & Marketing',
    discipline: 'Client Partnerships & Campaign Strategy',
    icon: Megaphone,
    tag: 'GROWTH // CLIENT PARTNERSHIPS',
    stat: '40+ Accounts',
    image: 'https://res.cloudinary.com/hbmeplwl/image/upload/v1789761416/team/member_03.jpg',
    bio: 'Connecting brands with the production floor - scoping campaigns, shaping production budgets, and turning first conversations into long-running client partnerships across the region.',
    specialties: [
      'Client Acquisition & Retention',
      'Campaign Scoping & Budgeting',
      'Brand Partnership Strategy',
      'Market & Competitor Research'
    ],
    awards: 'Regional Growth Lead // 40+ Brand Accounts',
    socials: {
      linkedin: 'https://www.linkedin.com/in/whyzo-creatives-9b3212438/',
      instagram: 'https://www.instagram.com/whyzo.ae?stkn=dnBnMWNkY3V0cWt0'
    },
    works: [
      {
        id: 'work-anz-01',
        title: 'GITEX Global Account Campaign',
        category: 'corporate',
        categoryLabel: 'Corporate & Brand Film',
        client: 'Dubai World Trade Centre',
        year: '2025',
        image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789577552/events/opt_GITEX_2025.jpg',
        video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789577552/events/opt_GITEX_2025.mp4',
        metrics: '180+ Countries // Multi-Stage Account Win',
        deliverables: ['Account Scoping', 'Budget & Deliverable Planning', 'On-Site Client Liaison', 'Post-Campaign Reporting'],
        description: 'End-to-end account management for the studio coverage of the world largest technology exhibition, from first pitch through delivery.'
      },
      {
        id: 'work-anz-02',
        title: 'AMARA Hospitality Partnership',
        category: 'f&b',
        categoryLabel: 'Food & Beverage Cinema',
        client: 'AMARA Hospitality',
        year: '2026',
        image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789578219/fb/AMARA.jpg',
        video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789578219/fb/AMARA.mp4',
        metrics: '48% Table Booking Lift // Retained Account',
        deliverables: ['Partnership Pitch', 'Content Calendar Strategy', 'Performance Review Cycle'],
        description: 'Long-running hospitality partnership built from a single content pilot into a retained monthly production agreement.'
      },
      {
        id: 'work-anz-03',
        title: 'Starbucks Creator Campaign Rollout',
        category: 'influencer',
        categoryLabel: 'Creator & Influencer',
        client: 'Starbucks Coffee ME',
        year: '2026',
        image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789577587/influencer/STARBUCKS.jpg',
        video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789577587/influencer/STARBUCKS.mp4',
        metrics: '5.2M Impressions // 18.4% Share Rate',
        deliverables: ['Creator Sourcing & Negotiation', 'Campaign Brief', 'Deliverable Tracking', 'Results Reporting'],
        description: 'Creator roster sourcing, commercial negotiation and campaign reporting for a regional lifestyle rollout.'
      }
    ]
  },
  {
    id: 'abhinav-murugan',
    num: '04',
    name: 'Abhinav Murugan',
    role: 'Full Stack Developer / UI/UX Designer',
    discipline: 'Full Stack Engineering & UI/UX',
    icon: Code2,
    tag: 'FULL STACK & UI/UX ARCHITECTURE',
    stat: 'Modern Full-Stack',
    image: 'https://res.cloudinary.com/hbmeplwl/image/upload/v1789741005/team/member_04.jpg',
    bio: 'A full stack developer and creative technologist building modern digital experiences at the intersection of design and engineering. Specializing in responsive web platforms, cross-platform mobile apps, robust backend systems, and detail-focused UI/UX design to transform ideas into scalable, intuitive digital products.',
    specialties: [
      'Full Stack Web & Mobile Development',
      'Frontend & Backend Engineering',
      'React & React Native Development',
      'UI/UX Design & Figma Architecture',
      'REST API & Cloud Integration',
      'Database Design & Management',
      'Modern JavaScript & TypeScript',
      'Interactive & Modern UI Development'
    ],
    awards: 'Full Stack & UI/UX // Scalable Systems & Modern Interfaces',
    socials: {
      linkedin: 'https://www.linkedin.com/in/abhinav-murugan/',
      instagram: 'https://www.instagram.com/a.bhi_v/',
      github: 'https://github.com/abhinav-murugan1',
      portfolio: 'https://abhinavmurugan.me'
    },
    works: [
      {
        id: 'work-dev-01',
        title: 'Modern Full-Stack Web Platform',
        category: 'web',
        categoryLabel: 'Web & UI/UX Engineering',
        client: 'Whyzo Digital Systems',
        year: '2026',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=700&auto=format&fit=crop',
        video: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        metrics: 'Full Stack Architecture // React & Node.js',
        deliverables: ['Responsive Web App', 'REST API Architecture', 'Figma Design System', 'Database Integration'],
        description: 'End-to-end full stack web application engineered with modern component architecture, responsive layouts, and cloud API integration.'
      },
      {
        id: 'work-dev-02',
        title: 'Cross-Platform Mobile App & UI/UX',
        category: 'web',
        categoryLabel: 'Mobile & UI Design',
        client: 'NextGen Mobile Tech',
        year: '2025',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=700&auto=format&fit=crop',
        video: 'https://cdn.jsdelivr.net/gh/mediaelement/mediaelement-files@master/echo-hereweare.mp4',
        metrics: 'React Native // iOS & Android',
        deliverables: ['Mobile App Architecture', 'Figma Prototyping', 'Cross-Platform UI', 'State Management'],
        description: 'Cross-platform mobile application combining intuitive touch-friendly UX with high-performance reactive state management.'
      },
      {
        id: 'work-dev-03',
        title: 'Cloud Database & API Gateway',
        category: 'web',
        categoryLabel: 'Backend Engineering',
        client: 'CloudScale Infrastructure',
        year: '2026',
        metrics: 'Zero-Downtime Architecture // TypeScript & SQL',
        deliverables: ['Database Schema Design', 'Microservices API', 'Authentication Flow', 'CI/CD Deployment'],
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=700&auto=format&fit=crop',
        video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        description: 'Scalable cloud backend service featuring normalized SQL databases, real-time sync, and secured token-based authentication.'
      }
    ]
  }
];

export const getMemberById = id => teamMembers.find(member => 
  member.id === id || 
  (member.id === 'fayaz' && id === 'alex-vance') || 
  (member.id === 'abdul-rahman' && id === 'elena-rostova') ||
  (member.id === 'abhinav-murugan' && id === 'chloe-laurent')
) || null;

export { teamMembers };
export default teamMembers;
