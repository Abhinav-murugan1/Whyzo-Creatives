import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2 
} from 'lucide-react';

const formatTime = (seconds) => {
  if (isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const ProjectModal = ({ project, onClose }) => {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimeout = useRef(null);
  const lastTimeUpdateRef = useRef(0);

  // High-performance Cloudinary hardware-accelerated MP4 stream
  const videoSrc = useMemo(() => {
    if (!project?.video) return null;
    let url = project.video;
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
      // If already an MP4, serve with q_auto for instant sub-120ms start time
      if (/\.mp4$/i.test(url)) {
        if (!url.includes('/q_auto')) {
          return url.replace('/upload/', '/upload/q_auto/');
        }
        return url;
      }
      // For MOV or other formats, convert to MP4 with f_mp4 without breaking the public ID
      if (!url.includes('/f_mp4')) {
        return url.replace('/upload/', '/upload/f_mp4,q_auto/');
      }
    }
    return url;
  }, [project?.video]);

  const [fallbackToRaw, setFallbackToRaw] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(Boolean(project?.video));

  // Reset fallback and error states when project changes
  const [prevProject, setPrevProject] = useState(project);
  if (project !== prevProject) {
    setPrevProject(project);
    setFallbackToRaw(false);
    setVideoError(false);
    setIsBuffering(Boolean(project?.video));
  }

  const effectiveSrc = fallbackToRaw ? project?.video : videoSrc;

  const handleVideoError = () => {
    if (!fallbackToRaw && project?.video && videoSrc !== project.video) {
      // Fallback to raw video URL
      setFallbackToRaw(true);
      setIsBuffering(true);
    } else {
      setVideoError(true);
      setIsBuffering(false);
    }
  };

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    setIsMuted((prevMuted) => {
      const nextMuted = !prevMuted;
      if (videoRef.current) {
        videoRef.current.muted = nextMuted;
      }
      return nextMuted;
    });
  }, []);

  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    if (isPlaying) {
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 4000);
    }
  }, [isPlaying]);

  // Auto-hide controls when video is actively playing
  useEffect(() => {
    if (!isPlaying) return;

    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    hideControlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);

    return () => {
      if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    };
  }, [isPlaying]);

  // Lock scroll, mark body modal-open to halt background animations, handle key shortcuts
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' && videoRef.current) {
        e.preventDefault();
        togglePlay();
      }
      if ((e.key === 'm' || e.key === 'M') && videoRef.current) {
        toggleMute();
      }
    };

    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
      if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    };
  }, [project, onClose, togglePlay, toggleMute]);

  // Start video playback with audio enabled (or fallback to muted if browser autoplay blocks audio)
  useEffect(() => {
    if (!project || !videoRef.current || !effectiveSrc) return;
    const video = videoRef.current;

    video.volume = volume;
    video.muted = isMuted;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Browser requires muted initial playback fallback
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        });
    }
  }, [project, effectiveSrc, volume, isMuted]);

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  // Throttled timeupdate: at most once every 250ms to prevent React re-render thrashing
  const handleTimeUpdate = useCallback(() => {
    const now = Date.now();
    if (now - lastTimeUpdateRef.current < 250) return;
    lastTimeUpdateRef.current = now;

    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  }, []);

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  if (!project) return null;

  const hasVideo = Boolean(videoSrc);

  /*
   * Every piece of player chrome fades together once playback is under way - the close button used to
   * float over the reel permanently. Any pointer movement, a touch, or pausing brings it all straight
   * back, and Escape still closes the player at any time.
   */
  const chromeVisible = showControls || !isPlaying || !hasVideo;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/95 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Video Theater & Caption Container */}
      <div 
        className="relative w-full max-w-5xl flex flex-col gap-3 sm:gap-4 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pure Cinema Video Theater Stage */}
        <div 
          ref={videoContainerRef}
          onMouseMove={resetControlsTimeout}
          onMouseEnter={resetControlsTimeout}
          onTouchStart={resetControlsTimeout}
          className={`relative w-full aspect-video max-h-[82vh] flex items-center justify-center bg-black rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-[0_30px_120px_rgba(0,0,0,0.98)] select-none group ${
            chromeVisible ? '' : 'cursor-none'
          }`}
        >
        {/* Floating Close Button - fades out with the rest of the chrome during playback */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-40 w-11 h-11 rounded-full bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 shadow-2xl cursor-pointer ${
            chromeVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Close Cinema Player"
        >
          <X className="w-5 h-5" />
        </button>

        {hasVideo ? (
          <>
            {/*
              onPlay/onPause keep isPlaying authoritative: the element can also start or stop outside the
              custom controls (autoplay resolution, keyboard media keys, the browser pausing a hidden tab),
              and the chrome's visibility now hangs off that flag.
            */}
            <video
              ref={videoRef}
              src={effectiveSrc}
              poster={project.image}
              playsInline
              autoPlay
              loop
              preload="auto"
              controls={false}
              disablePictureInPicture
              controlsList="nodownload noplaybackrate noremoteplayback"
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => setIsBuffering(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onCanPlay={() => setIsBuffering(false)}
              onLoadedData={() => setIsBuffering(false)}
              onError={handleVideoError}
              onTimeUpdate={handleTimeUpdate}
              onClick={togglePlay}
              className="w-full h-full object-contain bg-black cursor-pointer"
            />

            {/* Cinema Video Buffering Indicator */}
            {isBuffering && !videoError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] z-30 pointer-events-none transition-opacity duration-300">
                <div className="relative flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />
                </div>
                <span className="mt-4 text-[10px] font-mono tracking-widest text-zinc-300 uppercase">
                  INITIALIZING CINEMA REEL...
                </span>
              </div>
            )}

            {/* Video Error Recovery Fallback */}
            {videoError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 z-30 p-6 text-center">
                <p className="text-xs font-mono text-zinc-300 mb-3 uppercase tracking-wider">
                  Stream took longer than expected or was interrupted.
                </p>
                <button
                  onClick={() => {
                    setVideoError(false);
                    setIsBuffering(true);
                    setEffectiveSrc(project?.video);
                    if (videoRef.current) videoRef.current.load();
                  }}
                  className="px-4 py-2 bg-white text-black text-xs font-mono font-bold uppercase rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer shadow-lg"
                >
                  Reload Stream
                </button>
              </div>
            )}

            {/* Cinema Player Controls HUD */}
            <div 
              className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4 sm:p-6 transition-opacity duration-300 pointer-events-none ${
                chromeVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Bottom HUD Controls - stop intercepting clicks once faded out */}
              <div className={`space-y-3 ${chromeVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                {/* Timeline Scrubber */}
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white transition-all hover:h-2.5"
                  aria-label="Seek Timeline"
                />

                <div className="flex items-center justify-between">
                  {/* Left Controls: Play/Pause, Volume, Time Counter */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button
                      onClick={togglePlay}
                      className="p-2 rounded-full bg-white/10 hover:bg-white hover:text-black text-white transition-all cursor-pointer"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleMute}
                        className="p-1.5 text-white hover:text-zinc-300 transition-colors cursor-pointer"
                        title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-5 h-5 text-zinc-400" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-emerald-400" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 sm:w-20 h-1 bg-white/20 rounded appearance-none cursor-pointer accent-white"
                        title="Volume"
                      />
                    </div>

                    <span className="text-zinc-400 text-[11px] font-mono hidden sm:inline">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Right Controls: Fullscreen */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-full bg-white/10 hover:bg-white hover:text-black text-white transition-all cursor-pointer"
                      title="Toggle Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-contain bg-black"
          />
        )}
        </div>

        {/* Category only - the reel speaks for itself, no title readout */}
        {project.categoryLabel && (
          <div className="px-1 sm:px-2 text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              {project.categoryLabel}
            </span>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ProjectModal;
