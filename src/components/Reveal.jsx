import React, { useEffect, useRef, useState } from 'react';

/*
 * Scroll-triggered wrapper around the `.reveal-in` animation in index.css.
 *
 * A mount-triggered reveal is wasted on anything below the fold — it plays out while the section is
 * still off screen and the visitor scrolls into content that has already finished animating. This
 * holds the content at `.reveal-pending` (opacity 0) until it actually approaches the viewport, then
 * swaps in the animation class once and disconnects. Anything already on screen at mount fires
 * immediately, so above-the-fold content is not delayed.
 */
const Reveal = ({
  as: Tag = 'div',
  delay = 0,
  className = '',
  style,
  children,
  ...rest
}) => {
  const ref = useRef(null);
  // Without IntersectionObserver there is nothing to wait for, so start revealed
  const [isRevealed, setIsRevealed] = useState(
    () => typeof IntersectionObserver === 'undefined',
  );

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsRevealed(true);
        observer.disconnect();
      },
      // Start slightly before the block is fully on screen so it lands as the visitor arrives
      { rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${isRevealed ? 'reveal-in' : 'reveal-pending'} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
