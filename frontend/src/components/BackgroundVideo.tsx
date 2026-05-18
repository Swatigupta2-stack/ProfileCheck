import React from 'react';

const BackgroundVideo: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none w-screen h-screen">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.4] dark:opacity-[0.5] scale-100"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />
      <div className="absolute top-0 right-0 w-full h-full bg-primary/5 rounded-full blur-[120px] opacity-40" />
      <div className="absolute inset-0 bg-grid-premium opacity-[0.05]" />
    </div>
  );
};

export default BackgroundVideo;
