import { Camera, Code2, Palette } from 'lucide-react';
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
      instagram: 'https://www.instagram.com/whyzo.ae?stkn=dnBnMWNkY3V0cWt0',
      portfolio: 'https://behance.net'
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
    id: 'marcus-thorne',
    num: '03',
    name: 'Marcus Thorne',
    role: 'Principal WebGL Architect',
    discipline: 'Spatial UI & 3D Engineering',
    icon: Code2,
    tag: 'FULL-STACK // WEBGL 3D',
    stat: '60 FPS 3D',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    bio: 'Engineering lightning-fast dark digital flagships with Three.js shaders, 60fps WebGL particle fields, and robust component architecture built for modern browser hardware.',
    specialties: [
      'Custom Three.js & GLSL Shaders',
      'React 19 & Next-Gen State Engines',
      'Spatial UX & Micro-Interactions',
      'Lighthouse 99+ Performance Scoring'
    ],
    awards: 'Awwwards Site of the Day // FWA of the Day',
    socials: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
      portfolio: 'https://github.com'
    },
    works: [
      {
        id: 'work-08',
        title: 'Spatial Three.js Digital Flagship',
        category: 'web',
        categoryLabel: 'Brand & Web Architecture',
        client: 'Lumina Digital Architecture',
        year: '2026',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=700&auto=format&fit=crop',
        video: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        metrics: '60 FPS WebGL // Awwwards Site of the Day',
        deliverables: ['Custom GLSL Shaders', 'Three.js 3D Canvas', 'React 19 Platform', 'Lighthouse 99+ Rating'],
        description: 'End-to-end engineering of a luxury dark spatial web platform featuring interactive 3D particle shaders and sub-second load times.'
      },
      {
        id: 'work-06',
        title: 'Kuro Tokyo Minimalist Identity & Stills',
        category: 'web',
        categoryLabel: 'Brand & Web Architecture',
        client: 'Kuro Roasters Tokyo',
        year: '2025',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=700&auto=format&fit=crop',
        video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        metrics: 'Design Award Winner 2025 // 3 New Flagship Stores',
        deliverables: ['Packaging & Label Design', 'Product Photography', 'Brand Film', 'E-commerce Web Dev'],
        description: 'Japanese minimalist coffee packaging, slow-motion brewing videography, and sleek e-commerce website development.'
      },
      {
        id: 'work-11',
        title: 'Zero-Latency WebGL Sound Visualizer',
        category: 'web',
        categoryLabel: 'Brand & Web Architecture',
        client: 'Chronos Audio Systems',
        year: '2026',
        metrics: '120Hz Refresh // Web Audio API Integration',
        deliverables: ['Web Audio Reactive Mesh', 'Post-Processing Bloom Pipeline', 'Mobile Touch Gestures'],
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=700&auto=format&fit=crop',
        video: 'https://cdn.jsdelivr.net/gh/mediaelement/mediaelement-files@master/echo-hereweare.mp4',
        description: 'Browser-native real-time 3D audio visualizer synthesizing low-frequency sound waves into fluid geometric distortions.'
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
