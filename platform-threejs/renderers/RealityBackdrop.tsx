import React from 'react';
import wallpaperUrl from '../assets/wallpaper.png';

const RealityBackdrop: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage: `url(${wallpaperUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px) brightness(0.7)',
          transform: 'scale(1.05)',
          transition: 'transform 4s ease-in-out',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/60" />
    </div>
  );
};

export default RealityBackdrop;
