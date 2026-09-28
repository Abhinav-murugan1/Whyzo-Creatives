import React from 'react';
import ShinyText from './reactbits/ShinyText';

/*
 * Shared section header.
 *
 * Centred, as the site has always had it. An earlier pass moved these to a left-aligned editorial header
 * with an index and a hairline; that was reverted because the centred mark is the site's own rhythm and
 * the asymmetric version fought it. The component stays because it keeps one definition of the heading
 * instead of four copies drifting apart.
 */
const SectionHeading = ({ title, className = '' }) => (
  <div className={`text-center flex flex-col items-center ${className}`}>
    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight font-poppins poppins-bold text-white text-center">
      <ShinyText text={title} speed={4.5} delay={3.5} color="#888888" shineColor="#ffffff" />
    </h2>
  </div>
);

export default SectionHeading;
