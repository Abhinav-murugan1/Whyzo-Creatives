import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './StaggeredMenu.css';

export const StaggeredMenu = ({
  position = 'right',
  colors = ['#121212', '#222222'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = null,
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  accentColor = '#ffffff',
  changeMenuColorOnOpen = true,
  isFixed = false,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
  currentPage = 'home',
  onNavigate
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);
  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const iconRef = useRef(null);

  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const colorTweenRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const busyRef = useRef(false);
  const itemEntranceTweenRef = useRef(null);

  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  useEffect(() => {
    if (currentPage === 'team') return;

    const hero = document.getElementById('hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolledPastHero(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [currentPage]);

  // Any page other than home has no hero to clear, so the mark shows straight away
  const isLogoVisible = currentPage !== 'home' || isScrolledPastHero;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      if (!panel || !plusH || !plusV || !icon) return;

      let preLayers = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen, visibility: 'hidden', force3D: true });
      if (preContainer) {
        gsap.set(preContainer, { xPercent: 0, visibility: 'hidden' });
      }
      gsap.set(plusH, { transformOrigin: '50% 50%', y: -3.5, rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', y: 3.5, rotate: 0 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const preContainer = preLayersRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    if (preContainer) {
      gsap.set(preContainer, { visibility: 'visible' });
    }
    gsap.set([panel, ...layers], { visibility: 'visible', force3D: true });

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

    const offscreen = position === 'left' ? -100 : 100;
    const layerStates = layers.map(el => ({ el, start: offscreen }));
    const panelStart = offscreen;

    if (itemEls.length) {
      gsap.set(itemEls, { yPercent: 100, rotate: 0, force3D: true });
    }
    if (numberEls.length) {
      gsap.set(numberEls, { '--sm-num-opacity': 0 });
    }
    if (socialTitle) {
      gsap.set(socialTitle, { opacity: 0 });
    }
    if (socialLinks.length) {
      gsap.set(socialLinks, { y: 15, opacity: 0, force3D: true });
    }

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: 0.52, ease: 'power3.out', force3D: true },
        i * 0.05
      );
    });
    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.05 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.05 : 0);
    const panelDuration = 0.62;
    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power3.out', force3D: true },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStart = panelInsertTime + 0.12;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 0.55,
          ease: 'power3.out',
          stagger: { each: 0.05, from: 'start' },
          force3D: true
        },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.42,
            ease: 'power2.out',
            '--sm-num-opacity': 1,
            stagger: { each: 0.04, from: 'start' }
          },
          itemsStart + 0.06
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + 0.20;
      if (socialTitle) {
        tl.to(
          socialTitle,
          {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
          },
          socialsStart
        );
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.48,
            ease: 'power3.out',
            stagger: { each: 0.04, from: 'start' },
            force3D: true,
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: 'opacity' });
            }
          },
          socialsStart + 0.03
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    busyRef.current = false;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.play(0);
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const preContainer = preLayersRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();
    const offscreen = position === 'left' ? -100 : 100;
    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.40,
      ease: 'power3.inOut',
      force3D: true,
      overwrite: 'auto',
      onComplete: () => {
        if (preContainer) {
          gsap.set(preContainer, { visibility: 'hidden' });
        }
        gsap.set([panel, ...layers], { visibility: 'hidden' });
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        if (itemEls.length) {
          gsap.set(itemEls, { yPercent: 100, rotate: 0 });
        }
        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        if (numberEls.length) {
          gsap.set(numberEls, { '--sm-num-opacity': 0 });
        }
        const socialTitle = panel.querySelector('.sm-socials-title');
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 15, opacity: 0 });
        busyRef.current = false;
      }
    });
  }, [position]);

  const animateIcon = useCallback(opening => {
    const plusH = plusHRef.current;
    const plusV = plusVRef.current;
    if (!plusH || !plusV) return;
    spinTweenRef.current?.kill();
    if (opening) {
      spinTweenRef.current = gsap.to([plusH, plusV], {
        duration: 0.38,
        ease: 'power3.out',
        y: 0,
        rotate: (i) => (i === 0 ? 45 : -45)
      });
    } else {
      spinTweenRef.current = gsap.to([plusH, plusV], {
        duration: 0.32,
        ease: 'power3.inOut',
        y: (i) => (i === 0 ? -3.5 : 3.5),
        rotate: 0
      });
    }
  }, []);

  const animateColor = useCallback(
    opening => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          duration: 0.32,
          ease: 'power2.out'
        });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const toggleMenu = useCallback((e) => {
    e?.stopPropagation();
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }
    animateIcon(target);
    animateColor(target);
  }, [playOpen, playClose, animateIcon, animateColor, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      playClose();
      animateIcon(false);
      animateColor(false);
    }
  }, [playClose, animateIcon, animateColor, onMenuClose]);

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = event => {
      const btn = toggleBtnRef.current;
      const panel = panelRef.current;
      if (btn && (btn === event.target || btn.contains(event.target))) {
        return;
      }
      if (panel && (panel === event.target || panel.contains(event.target))) {
        return;
      }
      closeMenu();
    };

    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [closeOnClickAway, open, closeMenu]);

  return (
    <div
      className={(className ? className + ' ' : '') + 'staggered-menu-wrapper' + (isFixed ? ' fixed-wrapper' : '')}
      style={accentColor ? { ['--sm-accent']: accentColor } : undefined}
      data-position={position}
      data-open={open || undefined}
    >
      <div className="sm-backdrop" onClick={closeMenu} aria-hidden="true" />
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {(() => {
          const raw = colors && colors.length ? colors.slice(0, 4) : ['#121212', '#222222'];
          let arr = [...raw];
          if (arr.length >= 3) {
            const mid = Math.floor(arr.length / 2);
            arr.splice(mid, 1);
          }
          return arr.map((c, i) => <div key={i} className="sm-prelayer" style={{ background: c }} />);
        })()}
      </div>
      <header className="staggered-menu-header" aria-label="Main navigation header">
        <div 
          className={`sm-logo transition-all duration-500 ease-out ${
            isLogoVisible 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`} 
          aria-label="Logo"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Whyzo Creatives Logo"
              className="sm-logo-img cursor-pointer h-7 sm:h-8 w-auto object-contain transition-opacity duration-300 hover:opacity-80"
              draggable={false}
              width={125}
              height={32}
              onClick={() => {
                if (onNavigate) onNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            <a 
              href="/" 
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center no-underline group cursor-pointer"
            >
              <span className="font-poppins text-xs sm:text-[15px] tracking-tight text-white group-hover:text-gray-300 transition-colors">
                <span className="font-bold poppins-bold">WHYZO</span>{' '}
                <span className="font-normal poppins-regular text-zinc-300">Creatives</span>
              </span>
            </a>
          )}
        </div>

        {/* Right Nav Controls: Team Link + Hamburger Toggle */}
        <div className="flex items-center gap-4 sm:gap-6 pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              if (onNavigate) {
                onNavigate(currentPage === 'team' ? 'home' : 'team');
              }
            }}
            className="text-xs sm:text-[13px] font-mono uppercase tracking-widest text-zinc-300 hover:text-white transition-colors cursor-pointer py-1 px-0.5 relative group"
            aria-label={currentPage === 'team' ? 'Go to Home' : 'Go to Team'}
          >
            <span className={currentPage === 'team' ? 'text-white font-bold' : 'font-medium'}>
              {currentPage === 'team' ? 'HOME' : 'TEAM'}
            </span>
            <span 
              className={`absolute bottom-0 left-0 h-[1.5px] bg-white transition-all duration-300 ${
                currentPage === 'team' ? 'w-full' : 'w-0 group-hover:w-full'
              }`} 
            />
          </button>

          <button
            ref={toggleBtnRef}
            className="sm-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span ref={iconRef} className="sm-icon" aria-hidden="true">
              <span ref={plusHRef} className="sm-icon-line" />
              <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
            </span>
          </button>
        </div>
      </header>

      <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
            {items && items.length ? (
              items.map((it, idx) => (
                <li className="sm-panel-itemWrap" key={it.label + idx}>
                  <a 
                    className="sm-panel-item" 
                    href={it.link} 
                    aria-label={it.ariaLabel} 
                    data-index={idx + 1}
                    onClick={(e) => {
                      closeMenu();
                      if (it.onClick) {
                        e.preventDefault();
                        it.onClick(e);
                        return;
                      }
                      if (it.link && it.link.startsWith('#')) {
                        e.preventDefault();
                        const targetElem = document.querySelector(it.link);
                        if (targetElem) {
                          setTimeout(() => {
                            targetElem.scrollIntoView({ behavior: 'smooth' });
                          }, 350);
                        }
                      }
                    }}
                  >
                    <span className="sm-panel-itemLabel">{it.label}</span>
                  </a>
                </li>
              ))
            ) : (
              <li className="sm-panel-itemWrap" aria-hidden="true">
                <span className="sm-panel-item">
                  <span className="sm-panel-itemLabel">No items</span>
                </span>
              </li>
            )}
          </ul>
          {displaySocials && socialItems && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Social links">
              <h3 className="sm-socials-title">Connect With Us</h3>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((s, i) => (
                  <li key={s.label + i} className="sm-socials-item">
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="sm-socials-link">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default StaggeredMenu;
