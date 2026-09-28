import React from 'react';
import ShinyText from './reactbits/ShinyText';

/*
 * Shared section header.
 *
 * Every section used to open with the same centred stack: a mono eyebrow over a centred title, the whole
 * thing pinned to the middle of the page. Repeated five times down a scroll it reads as a template - each
 * section announces itself identically and the eye has no reason to travel. Anchoring the title to the
 * left and letting a hairline run out to the right gives the page a consistent reading edge and leaves
 * the asymmetric white space on the side, which is where it belongs on a production company's site.
 *
 * Type, colour and the ShinyText treatment are unchanged - this moves the furniture, it does not repaint.
 */
const SectionHeading = ({ index, eyebrow, title, className = '' }) => (
  <div className={`flex items-end gap-6 ${className}`}>
    <div className="min-w-0">
      {(index || eyebrow) && (
        <div className="flex items-center gap-3 mb-3">
          {index && (
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
              {index}
            </span>
          )}
          {index && eyebrow && <span className="h-px w-6 bg-white/15" />}
          {eyebrow && (
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              {eyebrow}
            </span>
          )}
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight font-poppins poppins-bold text-white">
        <ShinyText text={title} speed={4.5} delay={3.5} color="#888888" shineColor="#ffffff" />
      </h2>
    </div>

    {/* Carries the eye off to the right instead of stopping dead at the end of the word */}
    <span
      aria-hidden="true"
      className="hidden md:block flex-1 h-px bg-gradient-to-r from-white/20 to-transparent mb-4"
    />
  </div>
);

export default SectionHeading;
