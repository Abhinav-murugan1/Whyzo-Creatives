import React, { Suspense } from 'react';

/*
 * Magnetic button, split so the physics never sits on the critical path.
 *
 * Framer Motion is 28 kB gzipped even trimmed to LazyMotion + domAnimation, and this site uses it for
 * exactly two call-to-action buttons. Loading that before first paint to animate a hover would be a bad
 * trade - particularly on a site where the motion library was deliberately removed once already for
 * weight. So the plain button renders immediately and is what every visitor sees first; the motion
 * build streams in beside it and takes over once it lands.
 *
 * The fallback is not a placeholder. It is the real, fully working button with identical markup and
 * classes, so the swap is invisible: nothing shifts, nothing flashes, and the form still submits if the
 * chunk never arrives at all.
 */
const MagneticButtonMotion = React.lazy(() => import('./MagneticButtonMotion'));

/* `strength` is consumed only by the motion build; swallow it so it never reaches the DOM */
const PlainButton = ({ children, className = '', as = 'button', strength: _strength, ...props }) => {
  const Component = as;
  return (
    <Component className={className} {...props}>
      <span className="inline-flex items-center gap-1.5">{children}</span>
    </Component>
  );
};

const MagneticButton = (props) => (
  <Suspense fallback={<PlainButton {...props} />}>
    <MagneticButtonMotion {...props} />
  </Suspense>
);

export default MagneticButton;
