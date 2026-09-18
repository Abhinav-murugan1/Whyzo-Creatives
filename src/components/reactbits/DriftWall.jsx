import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './DriftWall.css';

const DEFAULT_ITEMS = Array.from({ length: 15 }, (_, i) => {
  const ids = [1015, 1025, 1039, 1043, 1044, 1050, 1062, 1069, 1074, 1080, 1084, 106, 110, 133, 164];
  return {
    image: `https://picsum.photos/id/${ids[i % ids.length]}/600/400`,
    title: `Tile ${i + 1}`,
    href: undefined
  };
});

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const columnFactor = (index, variance) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

/* Reveal choreography timings (kept in sync with the dwColumnIn keyframes in DriftWall.css) */
const REVEAL_DURATION = 950;
const REVEAL_STAGGER = 80;
/* Number of posters that must decode before the wall is allowed to reveal */
const REVEAL_GATE_COUNT = 12;
/* Hard cap so a slow or offline CDN can never leave the wall hidden */
const REVEAL_GATE_TIMEOUT = 2200;
/* Grace period before an off-screen tile releases its video decoder (prevents mount churn while drifting) */
const DECODER_RELEASE_DELAY = 6000;
/* Warm caches resolve in a few ms - only surface the readout if the wait is long enough to notice */
const LOADER_APPEARANCE_DELAY = 400;
/*
 * Enough posters to dress the visible stage. The full library runs to dozens of assets and the rest are
 * far off-stage, so they are left to the tiles' own lazy loading rather than fetched up front.
 */
const PREWARM_LIMIT = 24;

const CLOUDINARY_TRANSFORM_TOKEN = /^[a-z]{1,3}_[^,/]+/;

/*
 * Cloudinary posters are delivered at full master resolution (up to 2560x3840) while a tile only ever
 * paints at ~250x158 CSS px. Requesting a width-capped derivative keeps the exact same framing but cuts
 * both transfer size and decoded bitmap memory by more than an order of magnitude.
 */
const sizedPoster = (url, width = 600) => {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  if (/\/[wh]_\d+/.test(url)) return url;

  const splitIndex = url.indexOf('/upload/');
  const head = url.slice(0, splitIndex);
  const tail = url.slice(splitIndex + '/upload/'.length);
  const segments = tail.split('/');
  const first = segments[0] || '';

  // Merge into an existing transformation component, otherwise prepend a fresh one
  if (first && !/^v\d+$/.test(first) && CLOUDINARY_TRANSFORM_TOKEN.test(first)) {
    segments[0] = `${first},w_${width},c_limit`;
    return `${head}/upload/${segments.join('/')}`;
  }
  return `${head}/upload/w_${width},c_limit/${tail}`;
};

/* Individual Video & Poster Tile Component */
const DriftTile = ({
  item,
  id,
  colIndex,
  isActive,
  isOpening = false,
  isRenderVideo,
  isInView,
  isModalOpen = false,
  onActivate,
  onRelease,
  onTileClick
}) => {
  const tileRef = useRef(null);
  const videoRef = useRef(null);
  const pointerStartRef = useRef(null);
  const lastTriggerRef = useRef(0);
  const releaseTimerRef = useRef(null);

  const [isNearViewport, setIsNearViewport] = useState(false);
  // Keeps a decoder alive briefly after the tile drifts out of range so slow crossings do not thrash
  const [holdsDecoder, setHoldsDecoder] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const posterSrc = useMemo(() => sizedPoster(item.image), [item.image]);

  // Use ultra-fast Cloudinary web preview transform (480p, eco quality) for silky-smooth 60fps wall motion
  const previewSrc = useMemo(() => {
    if (!item.video) return null;
    if (item.video.includes('cloudinary.com') && item.video.includes('/upload/')) {
      let v = item.video.replace(/\.(mov|webm|mkv)$/i, '.mp4');
      if (v.includes('/w_480')) return v;
      return v.replace('/upload/', '/upload/w_480,q_auto:eco,vc_h264,f_mp4/');
    }
    return item.video;
  }, [item.video]);

  /*
   * Observe tile visibility to virtualize video decoding (only decode tiles in or near view).
   * A decoder is claimed the moment the tile approaches and released only after a sustained absence,
   * so the constant drift never thrashes <video> elements in and out of the tree.
   */
  useEffect(() => {
    const el = tileRef.current;
    if (!el || !isRenderVideo) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const near = entry.isIntersecting;
        setIsNearViewport(near);

        if (near) {
          if (releaseTimerRef.current) {
            clearTimeout(releaseTimerRef.current);
            releaseTimerRef.current = null;
          }
          setHoldsDecoder(true);
        } else if (!releaseTimerRef.current) {
          releaseTimerRef.current = setTimeout(() => {
            releaseTimerRef.current = null;
            setHoldsDecoder(false);
          }, DECODER_RELEASE_DELAY);
        }
      },
      { rootMargin: '240px 60px' } // 240px lookahead margin starts playback before tile scrolls into view
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (releaseTimerRef.current) {
        clearTimeout(releaseTimerRef.current);
        releaseTimerRef.current = null;
      }
    };
  }, [isRenderVideo]);

  /*
   * Only tiles that are actually on stage own a <video> element. Previously every tile in every drifting
   * copy mounted one, so ~78 decoders and ~10MB of range requests fired on first paint even though the
   * gallery sits well below the fold.
   */
  const mountVideo = Boolean(isRenderVideo && previewSrc && isInView && holdsDecoder);

  // Active playback condition: Gallery in view, tile near viewport, is a video, and modal is NOT open
  const shouldPlay = isInView && isNearViewport && isRenderVideo && !isModalOpen;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlay) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.loop = true;

      // Stagger play call slightly across columns to eliminate any micro-stutter
      const timer = setTimeout(() => {
        if (!video) return;
        video.muted = true;
        video.defaultMuted = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (video) {
              video.muted = true;
              video.play().catch(() => {});
            }
          });
        }
      }, (colIndex % 5) * 30);

      return () => clearTimeout(timer);
    } else {
      video.pause();
    }
  }, [shouldPlay, colIndex, mountVideo]);

  // Autoplay recovery fallback upon first user interaction (scroll, touch, click)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldPlay) return;

    const handleInteraction = () => {
      if (video && video.paused) {
        video.muted = true;
        video.play().catch(() => {});
      }
    };

    window.addEventListener('scroll', handleInteraction, { once: true, passive: true });
    window.addEventListener('pointerdown', handleInteraction, { once: true, passive: true });
    return () => {
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('pointerdown', handleInteraction);
    };
  }, [shouldPlay, mountVideo]);

  const handleClick = (e) => {
    if (onTileClick) onTileClick(item, e);
    if (item.onClick) item.onClick(item, e);
  };

  const triggerOpen = (e) => {
    const now = Date.now();
    // Debounce to prevent duplicate fires between pointerup and fallback click
    if (now - lastTriggerRef.current < 400) return;
    lastTriggerRef.current = now;
    handleClick(e);
  };

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    };
  };

  const handlePointerUp = (e) => {
    if (!pointerStartRef.current) return;
    const start = pointerStartRef.current;
    pointerStartRef.current = null;

    const dx = Math.abs(e.clientX - start.x);
    const dy = Math.abs(e.clientY - start.y);
    const dt = Date.now() - start.time;

    // Movement under 18px and tap duration under 650ms registers immediately even if tile was drifting!
    if (dx < 18 && dy < 18 && dt < 650) {
      triggerOpen(e);
    }
  };

  const inner = (
    <span className="drift-wall__inner">
      {/* Poster always paints first so a tile is never empty while its decoder spins up */}
      <img
        src={posterSrc}
        alt={item.title ? `${item.title} - ${item.categoryLabel || 'Production'} | Whyzo Creations` : 'Whyzo Creations Portfolio Item'}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        draggable={false}
      />

      {mountVideo && (
        <video
          ref={videoRef}
          src={previewSrc}
          muted
          autoPlay
          playsInline
          loop
          preload="metadata"
          className={`drift-wall__video${isVideoReady ? ' is-ready' : ''}`}
          onLoadStart={() => setIsVideoReady(false)}
          onLoadedData={() => setIsVideoReady(true)}
        />
      )}

      <span className="drift-wall__overlay" aria-hidden="true" />

      {/* Immediate Tactile Click Feedback Indicator */}
      {isOpening && (
        <span className="drift-wall__opening-indicator" aria-live="polite">
          <span className="drift-wall__opening-pulse" />
          <span className="drift-wall__opening-text">OPENING REEL...</span>
        </span>
      )}
    </span>
  );

  const commonProps = {
    ref: tileRef,
    className: `drift-wall__tile${isActive ? ' is-active' : ''}${isOpening ? ' is-opening' : ''}`,
    'data-tile-id': id,
    'data-col': colIndex,
    onFocus: () => onActivate(id, colIndex),
    onBlur: onRelease,
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onClick: triggerOpen,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerOpen(e);
      }
    }
  };

  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer noopener" {...commonProps}>
        {inner}
      </a>
    );
  }

  return (
    <div tabIndex={0} role="button" aria-label={item.title ?? 'tile'} {...commonProps}>
      {inner}
    </div>
  );
};

const DriftWall = ({
  items = DEFAULT_ITEMS,
  columns = 10,
  tileWidth = 250,
  tileHeight = 158,
  gap = 18,
  radius = 14,
  tilt = 14,
  turn = -12,
  roll = 0,
  perspective = 1100,
  depth = 120,
  speed = 38,
  direction = 'up',
  variance = 0.42,
  parallax = 0.55,
  pauseOnHover = false,
  lift = 56,
  fade = 0.5,
  dim = 0.65,
  grayscale = false,
  overlayColor = '#050508',
  className = '',
  style,
  onTileClick
}) => {
  const containerRef = useRef(null);
  const planeRef = useRef(null);
  const trackRefs = useRef([]);
  const rafRef = useRef(null);
  const pointerRafRef = useRef(null);

  const offsetsRef = useRef([]);
  const velocitiesRef = useRef([]);
  const hoveredColRef = useRef(-1);
  const wallHoveredRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef(null);

  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const [containerHeight, setContainerHeight] = useState(600);
  const [activeId, setActiveId] = useState(null);
  const activeIdRef = useRef(null);
  const [reduced, setReduced] = useState(() => prefersReducedMotion());
  const [isInView, setIsInView] = useState(false);
  const [openingTileId, setOpeningTileId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(() => {
    if (typeof document === 'undefined') return false;
    return document.body.classList.contains('modal-open');
  });

  /* Intro choreography: 'idle' (hidden, warming posters) -> 'revealing' (staggered cascade) -> 'settled' (resting state) */
  const [introPhase, setIntroPhase] = useState('idle');
  const [postersLoaded, setPostersLoaded] = useState(false);
  const [posterProgress, setPosterProgress] = useState(0);
  const [loaderVisible, setLoaderVisible] = useState(false);

  const effectiveOpeningTileId = isModalOpen ? null : openingTileId;

  const handleTileClick = useCallback(
    (item, tileId, e) => {
      setOpeningTileId(tileId);
      if (onTileClick) onTileClick(item, e);
      setTimeout(() => {
        setOpeningTileId(prev => (prev === tileId ? null : prev));
      }, 1500);
    },
    [onTileClick]
  );

  // Pause wall animation and video decoders when any modal is open
  useEffect(() => {
    const checkModal = () => {
      setIsModalOpen(document.body.classList.contains('modal-open'));
    };
    checkModal();
    const observer = new MutationObserver(checkModal);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  /* Passive scroll detection to skip forced reflows during active page scrolling */
  useEffect(() => {
    const onScroll = () => {
      isScrollingRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  /* Viewport visibility detection with lookahead margin */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '100px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = e => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* Every distinct poster the wall can show, at the size it will actually paint */
  const posters = useMemo(() => {
    const seen = new Set();
    const list = [];
    for (const item of items) {
      const src = sizedPoster(item.image);
      if (src && !seen.has(src)) {
        seen.add(src);
        list.push(src);
      }
    }
    return list;
  }, [items]);

  /* Warm the poster cache up-front so the reveal uncovers finished artwork instead of empty frames */
  useEffect(() => {
    if (typeof window === 'undefined' || !posters.length) return;

    let cancelled = false;
    const gateSize = Math.min(REVEAL_GATE_COUNT, posters.length);
    let pending = gateSize;

    const settle = () => {
      if (cancelled) return;
      pending -= 1;
      setPosterProgress((gateSize - pending) / gateSize);
      if (pending <= 0) setPostersLoaded(true);
    };

    const loaders = posters.slice(0, PREWARM_LIMIT).map((src, index) => {
      const img = new Image();
      img.decoding = 'async';
      // Below-the-fold artwork must never contend with the hero for bandwidth
      img.fetchPriority = 'low';
      if (index < REVEAL_GATE_COUNT) {
        img.onload = settle;
        img.onerror = settle;
      }
      img.src = src;
      return img;
    });

    // Never let a stalled CDN hold the wall hostage
    const cap = setTimeout(() => {
      if (!cancelled) setPostersLoaded(true);
    }, REVEAL_GATE_TIMEOUT);

    return () => {
      cancelled = true;
      clearTimeout(cap);
      loaders.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [posters]);

  const columnItems = useMemo(() => {
    const cols = Array.from({ length: columns }, () => []);
    const count = Math.max(items.length, columns * 2);
    for (let i = 0; i < count; i++) {
      cols[i % columns].push(items[i % items.length]);
    }
    return cols;
  }, [items, columns]);

  /* Centre-out cascade delays - the wall opens from the middle outwards */
  const columnDelays = useMemo(() => {
    const centre = (columns - 1) / 2;
    return Array.from({ length: columns }, (_, c) => Math.round(Math.abs(c - centre) * REVEAL_STAGGER));
  }, [columns]);

  const columnMeta = useMemo(() => {
    const unit = tileHeight + gap;
    return columnItems.map(col => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(2, Math.ceil((containerHeight * 1.3) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  /* The gate opens once the artwork is decoded, or immediately when there is nothing to warm */
  const postersReady = postersLoaded || posters.length === 0;

  /*
   * A repeat visit resolves the poster cache in a few milliseconds. Surfacing the readout for that long
   * would only register as a flicker, so it is withheld until the wait is genuinely worth reporting.
   */
  useEffect(() => {
    if (introPhase !== 'idle' || postersReady) return;
    const timer = setTimeout(() => setLoaderVisible(true), LOADER_APPEARANCE_DELAY);
    return () => clearTimeout(timer);
  }, [introPhase, postersReady]);

  /*
   * Hand over to the staggered cascade once the section is on screen and its artwork is decoded.
   * Flipping on the next frame guarantees the hidden state is painted first, so the cascade never
   * starts mid-way through its own keyframes.
   */
  useEffect(() => {
    if (introPhase !== 'idle') return;
    if (!isInView || !postersReady) return;

    const frame = requestAnimationFrame(() => setIntroPhase(reduced ? 'settled' : 'revealing'));
    return () => cancelAnimationFrame(frame);
  }, [introPhase, isInView, postersReady, reduced]);

  /* Drop every intro class once the cascade finishes so the resting wall is identical to before */
  useEffect(() => {
    if (introPhase !== 'revealing') return;
    const maxDelay = columnDelays.length ? Math.max(...columnDelays) : 0;
    const timer = setTimeout(() => setIntroPhase('settled'), REVEAL_DURATION + maxDelay + 120);
    return () => clearTimeout(timer);
  }, [introPhase, columnDelays]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height || 600);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo(() => {
    const dirSign = direction === 'up' ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback(
    (px, py) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.26) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth]
  );

  /*
   * Seed the plane's base transform before the first paint. The RAF loop only writes a transform once the
   * damped pointer actually moves, so without this the wall rendered un-centred and un-tilted from its
   * top-left corner on every fresh load until the cursor happened to cross it.
   */
  useLayoutEffect(() => {
    applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);
  }, [applyPlaneTransform]);

  useEffect(() => {
    if (!isInView || isModalOpen) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
      return;
    }

    const animate = ts => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const diffX = Math.abs(targetX - pointerDampedRef.current.x);
      const diffY = Math.abs(targetY - pointerDampedRef.current.y);

      // Only re-apply plane transform if pointer is active or still dampening
      if (diffX > 0.005 || diffY > 0.005) {
        const damp = 1 - Math.exp(-dt / 0.12);
        pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
        pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
        applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);
      }

      if (!reduced) {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const meta = columnMeta[c];
          if (!meta) continue;
          const paused = wallHoveredRef.current && pauseOnHover;
          const factor = paused || hoveredColRef.current === c ? 0 : 1;
          const target = baseVelocities[c] * factor;

          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[c] = next;

          const el = trackRefs.current[c];
          if (el) el.style.transform = `translate3d(0, ${(-next).toFixed(2)}px, 0)`;
        }
      } else {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const el = trackRefs.current[c];
          const meta = columnMeta[c];
          if (el && meta) el.style.transform = `translate3d(0, ${(-(offsetsRef.current[c] ?? 0)).toFixed(2)}px, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [baseVelocities, columnMeta, pauseOnHover, parallax, reduced, applyPlaneTransform, isInView, isModalOpen]);

  const activate = useCallback((id, index) => {
    activeIdRef.current = id;
    hoveredColRef.current = index;
    setActiveId(id);
  }, []);

  const release = useCallback(() => {
    activeIdRef.current = null;
    hoveredColRef.current = -1;
    setActiveId(null);
  }, []);

  /* RAF-throttled pointer tracking that skips reflows while user is scrolling */
  const handlePointerMove = useCallback(
    e => {
      if (isScrollingRef.current) return;
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (pointerRafRef.current) return;

      pointerRafRef.current = requestAnimationFrame(() => {
        pointerRafRef.current = null;
        if (isScrollingRef.current) return;

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        if (parallax > 0 && !reduced) {
          pointerRef.current = {
            x: (clientX - rect.left) / rect.width - 0.5,
            y: (clientY - rect.top) / rect.height - 0.5
          };
        }

        const hit = document.elementFromPoint(clientX, clientY);
        const tile = hit && hit.closest ? hit.closest('[data-tile-id]') : null;
        if (!tile) return;
        const id = tile.dataset.tileId;
        if (id === activeIdRef.current) return;
        activeIdRef.current = id;
        hoveredColRef.current = Number(tile.dataset.col);
        setActiveId(id);
      });
    },
    [parallax, reduced]
  );

  const handlePointerLeaveWall = useCallback(() => {
    wallHoveredRef.current = false;
    pointerRef.current = { x: 0, y: 0 };
    if (pointerRafRef.current) {
      cancelAnimationFrame(pointerRafRef.current);
      pointerRafRef.current = null;
    }
    release();
  }, [release]);

  const cssVars = useMemo(
    () => ({
      '--dw-tile-w': `${tileWidth}px`,
      '--dw-tile-h': `${tileHeight}px`,
      '--dw-gap': `${gap}px`,
      '--dw-radius': `${radius}px`,
      '--dw-perspective': `${perspective}px`,
      '--dw-lift': `${lift}px`,
      '--dw-dim': dim,
      '--dw-gray': grayscale ? 1 : 0,
      '--dw-overlay': overlayColor,
      '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
      '--dw-reveal-duration': `${REVEAL_DURATION}ms`,
      ...style
    }),
    [tileWidth, tileHeight, gap, radius, perspective, lift, dim, grayscale, overlayColor, fade, style]
  );

  const rootClass = [
    'drift-wall',
    reduced ? 'drift-wall--reduced' : '',
    introPhase !== 'settled' ? 'drift-wall--intro' : '',
    introPhase === 'revealing' ? 'is-revealing' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      className={rootClass}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true;
      }}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label="Drifting video wall of creative projects"
    >
      <div ref={planeRef} className="drift-wall__plane">
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          const copies = Array.from({ length: meta.copies });
          return (
            <div
              className="drift-wall__col"
              key={`col-${c}`}
              style={{ '--dw-col-delay': `${columnDelays[c] ?? 0}ms` }}
            >
              <div className="drift-wall__track" ref={el => (trackRefs.current[c] = el)}>
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) => {
                    const id = `${c}-${copyIndex}-${itemIndex}`;
                    // Render and play video on every video item across all drifting tracks without sound
                    const isRenderVideo = Boolean(item.video);
                    return (
                      <DriftTile
                        key={id}
                        id={id}
                        item={item}
                        colIndex={c}
                        isActive={activeId === id}
                        isOpening={effectiveOpeningTileId === id}
                        isRenderVideo={isRenderVideo}
                        isInView={isInView}
                        isModalOpen={isModalOpen}
                        onActivate={activate}
                        onRelease={release}
                        onTileClick={(clickedItem, e) => handleTileClick(clickedItem, id, e)}
                      />
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Intro status readout - only appears on a genuinely slow warm-up, unmounts once the wall settles */}
      {loaderVisible && introPhase !== 'settled' && (
        <div className={`drift-wall__loader${introPhase === 'revealing' ? ' is-hiding' : ''}`} aria-hidden="true">
          <span className="drift-wall__loader-head">
            <span className="drift-wall__loader-text">Loading Archive</span>
            <span className="drift-wall__loader-pct">{Math.round(posterProgress * 100)}%</span>
          </span>
          <span className="drift-wall__loader-track">
            <span className="drift-wall__loader-fill" style={{ transform: `scaleX(${posterProgress})` }} />
          </span>
        </div>
      )}
    </div>
  );
};

export default DriftWall;
