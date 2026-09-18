import React, { useCallback, useState, useEffect, useRef, Suspense } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import Services from './components/Services';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AboutSection from './components/AboutSection';
import { updatePageSEO } from './utils/seo';

// Code-split secondary routes to reduce initial JS bundle size
const Team = React.lazy(() => import('./components/Team'));
const MemberPortfolio = React.lazy(() => import('./components/MemberPortfolio'));
import ProjectModal from './components/ProjectModal';
import { getMemberById } from './data/teamMembers';

/*
 * Real paths, not fragments. Search engines discard everything after `#`, so the previous
 * `/#team/alex-vance` scheme collapsed every route onto a single indexable URL — the per-route
 * canonicals all resolved to the home page and the sitemap entries were duplicates. Static hosts
 * need a rewrite for this to work on a cold load; see public/404.html, public/_redirects and
 * vercel.json.
 */
const MEMBER_PATH = /^\/team\/([a-z0-9-]+)\/?$/;

const currentPath = () => {
  const path = window.location.pathname.replace(/\/index\.html$/, '/');
  return (path || '/').toLowerCase();
};

const resolveRoute = () => {
  const path = currentPath();

  const memberMatch = MEMBER_PATH.exec(path);
  if (memberMatch) {
    const member = getMemberById(memberMatch[1]);
    return member ? { page: 'member', memberId: member.id } : { page: '404', memberId: null };
  }

  if (path === '/team' || path === '/team/') return { page: 'team', memberId: null };
  if (path === '/') return { page: 'home', memberId: null };
  return { page: '404', memberId: null };
};

/*
 * Links to the old fragment routes are already in the wild (the Share control handed them out), so
 * rewrite them to their path equivalent before the first render. In-page anchors such as #gallery
 * are left alone — those are still fragments and still scroll.
 */
const LEGACY_MEMBER_HASH = /^#\/?team\/([a-z0-9-]+)$/;

const migrateLegacyHash = () => {
  if (typeof window === 'undefined') return;
  const hash = window.location.hash.toLowerCase();
  if (!hash) return;

  const memberMatch = LEGACY_MEMBER_HASH.exec(hash);
  if (memberMatch) {
    window.history.replaceState(null, '', `/team/${memberMatch[1]}`);
    return;
  }
  if (hash === '#team') window.history.replaceState(null, '', '/team');
};

migrateLegacyHash();

function App() {
  const [route, setRoute] = useState(resolveRoute);
  const currentPage = route.page;
  const activeMember = route.memberId ? getMemberById(route.memberId) : null;
  const [selectedProject, setSelectedProject] = useState(null);
  const [inquiryService, setInquiryService] = useState(null);

  const navigate = useCallback((path, { scrollToTop = true } = {}) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setRoute(resolveRoute());
    if (scrollToTop) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const next = resolveRoute();
      setRoute(next);
      if (next.page !== 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update dynamic SEO metadata whenever page or modal changes
  useEffect(() => {
    if (selectedProject) {
      updatePageSEO('home', `${selectedProject.title} // Case Study // Whyzo Creations`);
    } else if (currentPage === 'member' && activeMember) {
      // A member page is shared on its own, so it carries its own title, description and canonical
      updatePageSEO('member', `${activeMember.name} // ${activeMember.role} // Whyzo Creations`, {
        description: activeMember.bio,
        path: `/team/${activeMember.id}`
      });
    } else {
      updatePageSEO(currentPage);
    }
  }, [currentPage, activeMember, selectedProject]);

  const handleOpenMember = (memberId) => {
    navigate(`/team/${memberId}`);
  };

  const handleNavigate = (page) => {
    // Staying on home (a section link in the menu) must not yank the page to the top first
    const alreadyHome = page === 'home' && currentPage === 'home';
    navigate(page === 'team' ? '/team' : '/', { scrollToTop: !alreadyHome });
  };

  const handleSelectService = (serviceName) => {
    if (serviceName) {
      setInquiryService(serviceName);
    }

    const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

    if (currentPage !== 'home') {
      navigate('/', { scrollToTop: false });
      // The home sections have to mount before there is anything to scroll to
      setTimeout(scrollToContact, 150);
    } else {
      scrollToContact();
    }
  };

  const [footerHeight, setFooterHeight] = useState(0);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const footerContainerRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const updateHeight = () => {
      if (el) {
        const nextH = el.offsetHeight;
        setFooterHeight((prev) => (Math.abs(prev - nextH) > 2 ? nextH : prev));
      }
    };

    updateHeight();

    const ro = new ResizeObserver(() => {
      updateHeight();
    });

    ro.observe(el);
    window.addEventListener('resize', updateHeight, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  useEffect(() => {
    const el = footerContainerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { rootMargin: '200px 0px 0px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans antialiased">
      {/* Header & Staggered Menu */}
      <Header 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        onOpenInquiry={handleSelectService} 
      />

      {/* Main Page Content - Sits on top of the static footer with hardware-accelerated crisp boundary */}
      <main className="relative z-10 bg-black border-b border-white/10">
        {currentPage === 'team' ? (
          <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <Team
              onBack={() => handleNavigate('home')}
              onInquire={handleSelectService}
              onOpenMember={handleOpenMember}
            />
          </Suspense>
        ) : currentPage === 'member' ? (
          <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <MemberPortfolio
              member={activeMember}
              onBack={() => handleNavigate('team')}
              onSelectWork={(project) => setSelectedProject(project)}
            />
          </Suspense>
        ) : currentPage === '404' ? (
          <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-36 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-lines opacity-10 pointer-events-none"></div>
            <div className="relative z-10 max-w-lg space-y-6">
              <span className="inline-block text-[11px] font-mono tracking-widest text-zinc-400 uppercase px-4 py-1.5 rounded-full border border-white/15 bg-white/5">
                404 // ROUTE NOT FOUND
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight font-poppins poppins-bold text-white">
                LOST IN SPACE
              </h1>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto font-poppins">
                The requested coordinate or project does not exist in the Whyzo Creations production matrix.
              </p>
              <div>
                <button
                  onClick={() => handleNavigate('home')}
                  className="px-8 py-3.5 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                >
                  Return to Portfolio
                </button>
              </div>
            </div>
          </section>
        ) : (
          <>
            <Hero />
            <AboutSection onNavigateToTeam={() => handleNavigate('team')} />
            <Gallery onSelectWork={(project) => setSelectedProject(project)} />
            <Services onSelectService={handleSelectService} />
            <ContactSection initialService={inquiryService} />
          </>
        )}
      </main>

      {/* Project Detail Modal Lightbox */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onInquire={(projectName) => {
            setSelectedProject(null);
            handleSelectService(projectName);
          }}
        />
      )}

      {/* Static Revealing Footer Container */}
      <div 
        ref={footerContainerRef} 
        className="relative z-0 w-full" 
        style={{ height: footerHeight > 0 ? `${footerHeight}px` : undefined }}
      >
        <div 
          ref={footerRef}
          className="fixed bottom-0 left-0 w-full z-0 pointer-events-auto"
          style={{
            visibility: isFooterVisible ? 'visible' : 'hidden',
            pointerEvents: isFooterVisible ? 'auto' : 'none'
          }}
        >
          <Footer onNavigate={handleNavigate} isRevealed={isFooterVisible} />
        </div>
      </div>
    </div>
  );
}

export default App;
