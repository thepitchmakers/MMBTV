import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, Settings } from 'lucide-react';

const PROXIES = [
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://api.allorigins.win/raw?url='
];

export default function VideoPlayer({ channel, onPrev, onNext }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [useProxy, setUseProxy] = useState(false);
  const [proxyIndex, setProxyIndex] = useState(0);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const hideTimer = useRef(null);

  const [serverIndex, setServerIndex] = useState(0);

  const startStream = (urlList, proxy) => {
    const video = videoRef.current;
    if (!video || !urlList || urlList.length === 0) return;
    
    setLoading(true);
    setError(false);
    if (hlsRef.current) hlsRef.current.destroy();

    // The current URL to try
    const url = urlList[serverIndex];
    if (!url) {
      setLoading(false);
      setError(true);
      return;
    }

    const proxyPrefix = PROXIES[proxyIndex];
    const streamUrl = proxy ? proxyPrefix + encodeURIComponent(url) : url;

    const handleStreamError = () => {
      if (!proxy) {
        // First try proxy
        setUseProxy(true);
      } else if (proxyIndex < PROXIES.length - 1) {
        // Try next proxy
        setProxyIndex(prev => prev + 1);
      } else if (serverIndex < urlList.length - 1) {
        // All proxies failed, try NEXT SERVER
        setServerIndex(prev => prev + 1);
        setProxyIndex(0);
        setUseProxy(false);
      } else {
        // Completely failed
        setLoading(false);
        setError(true);
      }
    };

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        xhrSetup: (xhr, u) => {
          if (proxy) xhr.open('GET', proxyPrefix + encodeURIComponent(u));
          else xhr.open('GET', u);
        },
      });
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setLevels(data.levels || []);
        setCurrentLevel(-1);
        setLoading(false);
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          handleStreamError();
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => { setLoading(false); video.play().catch(()=>{}); }, { once: true });
      video.addEventListener('error', handleStreamError, { once: true });
    }
  };

  // Reset server index when changing channels
  useEffect(() => {
    setServerIndex(0);
    setProxyIndex(0);
    setUseProxy(false);
    setError(false);
  }, [channel?.id]);

  useEffect(() => {
    if (channel) {
      const urlList = channel.urls && channel.urls.length > 0 ? channel.urls : [channel.url];
      startStream(urlList, useProxy);
    }
    return () => { if (hlsRef.current) hlsRef.current.destroy(); };
  }, [channel, useProxy, proxyIndex, serverIndex]);

  useEffect(() => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = currentLevel;
    }
  }, [currentLevel]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(!muted);
  };

  const toggleFullscreen = () => {
    const el = videoRef.current?.parentElement;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen();
    else document.exitFullscreen();
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  return (
    <div
      className="relative w-full bg-black rounded-xl overflow-hidden group"
      style={{ aspectRatio: '16/9' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        id="hls-video"
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        webkit-playsinline="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onPlaying={() => { setLoading(false); setError(false); }}
      />

      {/* Loading */}
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-white/20 border-t-primary rounded-full animate-spin mb-3" />
          <p className="text-white/70 text-sm">Loading stream...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-4">
          <p className="text-red-400 font-semibold text-center px-6">Unable to load stream. Try enabling Anti-Block mode.</p>
          <button
            onClick={() => { 
              if (useProxy && proxyIndex >= PROXIES.length - 1) setProxyIndex(0); // Reset proxy if user retries
              else setUseProxy(true); 
            }}
            className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/80 text-white text-sm font-medium transition-colors"
          >
            Enable Anti-Block & Retry
          </button>
        </div>
      )}

      {/* Controls */}
      <div className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${showControls || !playing ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-gradient-to-t from-black/90 via-black/40 to-transparent px-4 pb-4 pt-12">
          {/* Channel Info */}
          <div className="flex items-center gap-2 mb-3">
            {channel?.logo && (
              <img src={channel.logo} className="w-7 h-7 object-contain rounded" alt="" />
            )}
            <span className="text-white font-semibold text-sm">{channel?.name}</span>
            <span className="text-xs text-white/40 px-2 py-0.5 rounded-full border border-white/20 ml-1">LIVE</span>
          </div>

          {/* Buttons Row */}
          <div className="flex items-center gap-2">
            <button onClick={onPrev} className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <SkipBack size={18} />
            </button>
            <button onClick={togglePlay} className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors">
              {playing ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button onClick={onNext} className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <SkipForward size={18} />
            </button>

            <div className="flex items-center gap-1.5 ml-2">
              <button onClick={toggleMute} className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
                onChange={(e) => { const v = parseFloat(e.target.value); setVolume(v); if (videoRef.current) videoRef.current.volume = v; setMuted(v === 0); }}
                className="w-20 accent-primary h-1 rounded cursor-pointer"
              />
            </div>

            <div className="ml-auto flex items-center gap-1 relative">
              {/* Settings */}
              <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                <Settings size={18} />
              </button>
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 w-44 rounded-xl bg-slate-900/95 border border-white/10 backdrop-blur-md shadow-xl p-2 z-50">
                  {/* Proxy Toggle */}
                  <div className="flex items-center justify-between px-2 py-2 text-xs text-slate-300">
                    <span>Anti-Block</span>
                    <button
                      onClick={() => setUseProxy(!useProxy)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${useProxy ? 'bg-primary' : 'bg-slate-600'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${useProxy ? 'left-4' : 'left-0.5'}`} />
                    </button>
                  </div>
                  {/* Quality */}
                  {levels.length > 0 && (
                    <div className="border-t border-white/10 mt-1 pt-1">
                      <p className="text-xs text-slate-500 px-2 py-1">Quality</p>
                      <button onClick={() => setCurrentLevel(-1)} className={`w-full text-left px-2 py-1.5 text-xs rounded-lg ${currentLevel === -1 ? 'text-primary font-bold' : 'text-slate-300 hover:bg-white/5'}`}>Auto</button>
                      {[...levels].sort((a, b) => b.height - a.height).map((l, i) => (
                        <button key={i} onClick={() => setCurrentLevel(levels.indexOf(l))} className={`w-full text-left px-2 py-1.5 text-xs rounded-lg ${currentLevel === levels.indexOf(l) ? 'text-primary font-bold' : 'text-slate-300 hover:bg-white/5'}`}>
                          {l.height ? `${l.height}p` : `Level ${i}`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <button onClick={toggleFullscreen} className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
