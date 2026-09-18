import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ShinyText from './reactbits/ShinyText';
import TopoField from '@/components/ui/topo-field';
import { categoryRank, previewVideo, sizedAsset } from '../data/galleryItems';
import { InstagramIcon, LinkedinIcon, GithubIcon } from './SocialIcons';
import {
  ArrowLeft,
  Check,
  Globe,
  Link2,
  Play
} from 'lucide-react';

/*
 * A single piece of work: media only, no title or copy. Video pieces stream their 480p preview inline
 * while the pointer is over the tile and release the decoder as soon as it leaves, so a shelf of 29
 * tiles never holds more than the one decoder the visitor is actually looking at.
 */
/* Cap the cascade so a 72-piece shelf still finishes revealing promptly */
const TILE_STAGGER = 45;
const TILE_STAGGER_CAP = 450;

const WorkTile = ({ work, index = 0, onSelect }) => {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const poster = useMemo(() => sizedAsset(work.image), [work.image]);
  const preview = useMemo(() => previewVideo(work.video), [work.video]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isHovered) return;

    video.muted = true;
    video.playsInline = true;
    const attempt = video.play();
    if (attempt !== undefined) attempt.catch(() => {});
  }, [isHovered]);

  const release = useCallback(() => {
    setIsHovered(false);
    setIsPlaying(false);
  }, []);

  return (
    <div
      onClick={() => onSelect && onSelect(work)}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={release}
      onFocus={() => setIsHovered(true)}
      onBlur={release}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onSelect) onSelect(work);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={work.title}
      style={{ '--reveal-delay': `${Math.min(index * TILE_STAGGER, TILE_STAGGER_CAP)}ms` }}
      className="reveal-in relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 hover:border-white/30 focus-visible:border-white transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_45px_-20px_rgba(0,0,0,0.95)] group cursor-pointer outline-none"
    >
      <img
        src={poster}
        alt={work.title}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-105"
      />

      {preview && isHovered && (
        <video
          ref={videoRef}
          src={preview}
          muted
          loop
          playsInline
          preload="metadata"
          onPlaying={() => setIsPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Smooth scrim for badges and title legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />

      {/* Top Left Category Badge */}
      {work.categoryLabel && (
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-black/85 text-white border border-white/20 backdrop-blur-sm">
            {work.categoryLabel}
          </span>
        </div>
      )}

      {/* Bottom Title Overlay */}
      <div className="absolute bottom-0 inset-x-0 p-3 sm:p-3.5 pointer-events-none z-10">
        <h4 className="text-xs sm:text-[13px] md:text-sm font-poppins font-semibold text-white tracking-wide line-clamp-2 drop-shadow-md">
          {work.title}
        </h4>
      </div>

      {/* Play affordance retires once the preview is actually running */}
      {preview && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-black/60 border border-white/25 backdrop-blur-sm flex items-center justify-center text-white transform scale-90 opacity-70 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </div>
        </div>
      )}
    </div>
  );
};

/*
 * Standalone portfolio page for one roster member, addressed by its own URL (#team/<id>) so it can be
 * shared on its own. This replaces the old dossier modal, which layered a full-viewport backdrop-blur
 * over the team grid and repainted it on every frame of its open animation.
 */
const MemberPortfolio = ({ member, onBack, onSelectWork }) => {
  const [shareState, setShareState] = useState('idle');

  /*
   * Split the member's work onto the shelves it is filed under in Cloudinary, keeping both the
   * shelves and the pieces inside them in manifest order. Entries with no shelf fall into one
   * unlabelled group, which is what the smaller hand-written rosters produce.
   */
  const works = useMemo(() => member?.works ?? [], [member]);
  const shelves = useMemo(() => {
    const grouped = [];
    for (const work of works) {
      const key = work.group ?? work.category ?? 'work';
      const existing = grouped.find(shelf => shelf.key === key);
      if (existing) existing.items.push(work);
      else grouped.push({ key, label: work.groupLabel ?? work.categoryLabel ?? 'Selected Work', items: [work] });
    }
    return grouped.sort((a, b) => categoryRank(a.key) - categoryRank(b.key));
  }, [works]);

  /*
   * One shelf is shown at a time. Opening on the first category rather than the whole catalogue keeps
   * the page short — the founder's profile carries 72 pieces — while "All Work" stays one click away.
   * The choice is tagged with the member it was made on, so it resolves back to that member's first
   * shelf on navigation instead of carrying a stale category across profiles.
   */
  const [selection, setSelection] = useState(null);
  const activeShelf =
    selection &&
    selection.memberId === member?.id &&
    (selection.key === 'all' || shelves.some(shelf => shelf.key === selection.key))
      ? selection.key
      : shelves[0]?.key ?? 'all';

  const selectShelf = useCallback(
    (key) => setSelection({ memberId: member?.id, key }),
    [member],
  );

  const visibleShelves = useMemo(
    () => (activeShelf === 'all' ? shelves : shelves.filter(shelf => shelf.key === activeShelf)),
    [shelves, activeShelf],
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [member?.id]);

  useEffect(() => {
    if (shareState === 'idle') return;
    const timer = setTimeout(() => setShareState('idle'), 2200);
    return () => clearTimeout(timer);
  }, [shareState]);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const title = `${member.name} // ${member.role} // Whyzo Creations`;

    // Native sheet on mobile, clipboard everywhere else
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Cancelled or unavailable - fall through to the clipboard path
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareState('copied');
    } catch {
      setShareState('failed');
    }
  }, [member]);

  if (!member) return null;

  const MemberIcon = member.icon;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans antialiased pt-16 sm:pt-20 md:pt-24 pb-20 relative overflow-hidden">
      {/*
        Animated topographic backdrop. Fixed to the viewport rather than the (tall) page so the
        shader only ever paints one screen. Vignettes keep the copy readable over the contour lines.
      */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <TopoField
          className="absolute inset-0 h-full w-full"
          mode="dark"
          speed={0.55}
          density={0.9}
          opacity={0.7}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-85" />
      </div>

      <div className="w-full max-w-[1700px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 relative z-10">
        {/* Breadcrumb & Share Bar */}
        <div className="reveal-in flex items-center justify-between gap-4 mb-8 sm:mb-10">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/15 hover:border-white/40 text-zinc-300 hover:text-white text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Our Team</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/15 hover:border-white/40 text-zinc-300 hover:text-white text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
            aria-label={`Share ${member.name} portfolio`}
          >
            {shareState === 'copied' ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
            <span>
              {shareState === 'copied' ? 'Link Copied' : shareState === 'failed' ? 'Copy Failed' : 'Share Portfolio'}
            </span>
          </button>
        </div>

        {/* Profile Hero */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start mb-16 sm:mb-20">
          {/* Portrait */}
          <div className="reveal-in md:col-span-5 lg:col-span-4 space-y-4" style={{ '--reveal-delay': '80ms' }}>
            <div className="relative aspect-[4/4.8] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-xl">
              <img
                src={member.image}
                alt={member.name}
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />
            </div>

            {/* Social Channels */}
            <div className="flex items-center gap-2">
              {member.socials.linkedin && (
                <a
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition-colors"
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
                  className="p-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition-colors"
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
                  className="p-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition-colors"
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
                  className="p-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition-colors"
                  aria-label={`${member.name} Portfolio`}
                >
                  <Globe className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="reveal-in md:col-span-7 lg:col-span-8 space-y-7" style={{ '--reveal-delay': '160ms' }}>
            <div>
              <span className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2.5">
                <span className="shrink-0">{member.tag}</span>
                <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight font-poppins poppins-bold text-white">
                <ShinyText text={member.name} speed={4.5} delay={3.5} color="#888888" shineColor="#ffffff" />
              </h1>
              <span className="mt-2.5 block text-xs sm:text-sm font-mono uppercase tracking-widest text-zinc-400">
                {member.role}
              </span>
            </div>

            {/* Capped at a comfortable reading measure - the strip and grid below take the full width */}
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light font-poppins poppins-regular max-w-4xl">
              {member.bio}
            </p>

            {/* Discipline / Output / Accolades Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="group/stat relative rounded-xl bg-zinc-950 border border-white/10 hover:border-white/25 transition-colors p-4 overflow-hidden">
                <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block mb-1.5">
                  Discipline
                </span>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-zinc-200 font-poppins leading-snug">
                  {MemberIcon && <MemberIcon className="w-4 h-4 mt-0.5 shrink-0 text-zinc-400" />}
                  <span>{member.discipline}</span>
                </div>
              </div>

              <div className="group/stat relative rounded-xl bg-zinc-950 border border-white/10 hover:border-white/25 transition-colors p-4 overflow-hidden">
                <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block mb-1.5">
                  Output
                </span>
                <span className="text-xs sm:text-sm text-zinc-200 font-poppins">{member.stat}</span>
              </div>

              <div className="group/stat relative rounded-xl bg-zinc-950 border border-white/10 hover:border-white/25 transition-colors p-4 overflow-hidden">
                <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block mb-1.5">
                  Accolades
                </span>
                <span className="text-xs sm:text-sm text-zinc-200 font-poppins leading-snug">{member.awards}</span>
              </div>
            </div>

            {/* Core Specializations */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2.5">
                CORE SPECIALIZATIONS & PIPELINE
              </span>
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${member.specialties.length % 3 === 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-3 text-xs sm:text-sm text-zinc-200 font-poppins`}>
                {member.specialties.map((spec, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/25 transition-colors px-3.5 py-3 text-zinc-200 leading-snug"
                  >
                    <span className="block text-[9px] font-mono tracking-widest text-zinc-600 mb-1.5">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {spec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* SELECTED WORK                                                  */}
        {/* ============================================================= */}
        <div className="reveal-in pt-10 border-t border-white/10 space-y-10" style={{ '--reveal-delay': '240ms' }}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">
              // SELECTED WORK // {String(works.length).padStart(2, '0')} PROJECTS
              {shelves.length > 1 && ` // ${shelves.length} CATEGORIES`}
            </span>
            <div className="flex items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight font-poppins poppins-bold text-white shrink-0">
                Directed Projects & Production Archives
              </h2>
              <span className="hidden sm:block h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            </div>
          </div>

          {/* Category selector - only meaningful once the work spans more than one shelf */}
          {shelves.length > 1 && (
            <div className="sticky top-0 z-20 -mx-2 px-2 py-3 flex flex-wrap gap-2 bg-black/80 backdrop-blur-md rounded-b-xl" role="tablist" aria-label="Filter work by category">
              {[{ key: 'all', label: 'All Work', count: works.length }, ...shelves.map((shelf) => ({
                key: shelf.key,
                label: shelf.label,
                count: shelf.items.length
              }))].map((option) => {
                const isActive = activeShelf === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => selectShelf(option.key)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[11px] font-mono uppercase tracking-wider border transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-white text-black border-white'
                        : 'border-white/15 text-zinc-400 hover:text-white hover:border-white/40'
                    }`}
                  >
                    <span>{option.label}</span>
                    <span className={isActive ? 'text-black/50' : 'text-zinc-600'}>
                      {String(option.count).padStart(2, '0')}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {visibleShelves.map((shelf) => (
            <section key={shelf.key} className="space-y-5">
              {/* Heading only earns its place when more than one shelf is on screen at once */}
              {visibleShelves.length > 1 && (
                <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2.5">
                  <h3 className="text-sm sm:text-base font-mono uppercase tracking-widest text-zinc-200">
                    {shelf.label}
                  </h3>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 shrink-0">
                    {String(shelf.items.length).padStart(2, '0')} {shelf.items.length === 1 ? 'Piece' : 'Pieces'}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 2xl:gap-7">
                {shelf.items.map((work, index) => (
                  <WorkTile key={work.id} work={work} index={index} onSelect={onSelectWork} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberPortfolio;
