import React, { memo, useRef } from 'react';
import { LazyMotion, domAnimation, m, useMotionValue, useSpring, useTransform } from 'framer-motion';

/*
 * A button that leans toward the cursor.
 *
 * The pointer offset is held in motion values, never in state. Driving this from useState would fire a
 * React render on every mousemove - sixty commits a second through whatever tree the button happens to
 * sit in - which is exactly the kind of thing that turns a smooth page into a stuttering one on a mid
 * range phone. Motion values write straight to the transform outside the render cycle, so the component
 * renders once and then never again while the cursor moves.
 *
 * Imported as `m` behind LazyMotion rather than the full `motion` factory. The full factory pulls the
 * entire feature set into the initial graph - 41 kB gzipped for two buttons - which is the same weight
 * that was deliberately stripped out of this project once already. `m` plus domAnimation carries only
 * the transform and gesture features these buttons actually use.
 *
 * Touch devices get none of this. There is no cursor to lean toward, and the pointer handlers would only
 * fire on tap, producing a lurch. The guard is on pointerType rather than a media query so a hybrid
 * laptop behaves correctly with either input.
 */
const SPRING = { type: 'spring', stiffness: 150, damping: 15, mass: 0.1 };

/* How far the button is allowed to travel from rest, in px */
const PULL = 6;

const MagneticButtonMotion = ({ children, className = '', as = 'button', strength = 1, ...props }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  /* The label trails the button slightly, which reads as weight rather than a rigid slab sliding around */
  const labelX = useTransform(springX, value => value * 0.35);
  const labelY = useTransform(springY, value => value * 0.35);

  const handlePointerMove = (event) => {
    if (event.pointerType === 'touch') return;
    const element = ref.current;
    if (!element) return;

    const bounds = element.getBoundingClientRect();
    const offsetX = event.clientX - (bounds.left + bounds.width / 2);
    const offsetY = event.clientY - (bounds.top + bounds.height / 2);

    x.set((offsetX / (bounds.width / 2)) * PULL * strength);
    y.set((offsetY / (bounds.height / 2)) * PULL * strength);
  };

  const release = () => {
    x.set(0);
    y.set(0);
  };

  const Component = m[as] ?? m.button;

  return (
    <LazyMotion features={domAnimation} strict>
      <Component
        ref={ref}
        onPointerMove={handlePointerMove}
        onPointerLeave={release}
        onPointerCancel={release}
        style={{ x: springX, y: springY }}
        whileTap={{ scale: 0.97 }}
        className={className}
        {...props}
      >
        <m.span style={{ x: labelX, y: labelY }} className="inline-flex items-center gap-1.5">
          {children}
        </m.span>
      </Component>
    </LazyMotion>
  );
};

export default memo(MagneticButtonMotion);
