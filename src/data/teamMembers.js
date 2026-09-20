import { Camera, Clapperboard, Code2, Megaphone, Palette } from 'lucide-react';
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
    }
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
    }
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
    }
  },
  {
    id: 'mithin',
    num: '05',
    name: 'Mithin',
    role: 'Content Creator',
    discipline: 'Content Creation & Social Media',
    icon: Clapperboard,
    tag: 'CONTENT & SOCIAL',
    stat: '3 Years Exp',
    image: 'https://res.cloudinary.com/hbmeplwl/image/upload/v1789902713/team/member_05.jpg',
    bio: 'Content creator with 3 years turning brand ideas into short-form video and social campaigns. Works the whole loop - concept, shoot, cut and the posting calendar that keeps a feed moving.',
    specialties: [
      'Short-Form & Social Video',
      'Content Strategy & Calendars',
      'Social Media Management',
      'Concept & Scripting',
      'Trend & Format Research',
      'Community & Engagement'
    ],
    awards: '3 Years Content Creation // Social Media Management',
    socials: {
      instagram: 'https://www.instagram.com/whyzo.ae?stkn=dnBnMWNkY3V0cWt0'
    }
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
