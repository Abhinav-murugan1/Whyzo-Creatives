import React, { useId } from 'react';
import './ShinyText.css';

const ShinyText = ({
  text,
  disabled = false,
  speed = 4,
  className = '',
  color = '#b5b5b5',
  shineColor = '#ffffff',
  spread = 120,
  pauseOnHover = false,
  direction = 'left',
  delay = 3.5
}) => {
  const uniqueId = useId().replace(/:/g, '');
  const animName = `shiny-anim-${uniqueId}`;

  const totalDuration = speed + delay;
  const activePct = totalDuration > 0 ? ((speed / totalDuration) * 100).toFixed(2) : '100';
  const startPos = direction === 'left' ? '150% center' : '-50% center';
  const endPos = direction === 'left' ? '-50% center' : '150% center';

  const gradientStyle = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: disabled ? 'none' : `${animName} ${totalDuration}s ease-in-out infinite`
  };

  return (
    <>
      {!disabled && (
        <style>{`
          @keyframes ${animName} {
            0% { background-position: ${startPos}; }
            ${activePct}%, 100% { background-position: ${endPos}; }
          }
        `}</style>
      )}
      <span
        className={`shiny-text ${pauseOnHover ? 'shiny-text-pause-hover' : ''} ${className}`}
        style={gradientStyle}
      >
        {text}
      </span>
    </>
  );
};

export default React.memo(ShinyText);
