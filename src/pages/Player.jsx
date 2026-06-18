import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import { useTvStore } from '../store/tvStore';
import useKeyboardNavigation from '../hooks/useKeyboardNavigation';
import { Trash2, Server } from 'lucide-react';

export default function Player() {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { addToHistory, channels, removeChannel } = useTvStore();

  const channel = channels.find((c) => c.id === channelId) || channels[0];
  const idx = channels.findIndex((c) => c.id === channelId);
  const categoryChannels = channels.filter((c) => c.category === channel?.category);

  useKeyboardNavigation(channels, channelId);

  const goTo = (ch) => {
    addToHistory(ch);
    navigate(`/player/${ch.id}`);
  };

  const handleRemove = (e, ch, isActive) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove ${ch.name}?`)) {
      removeChannel(ch.id);
      if (isActive) navigate('/');
    }
  };

  const prevCh = channels[idx > 0 ? idx - 1 : channels.length - 1];
  const nextCh = channels[idx < channels.length - 1 ? idx + 1 : 0];

  if (!channel) return <div className="flex items-center justify-center h-full text-slate-400">Channel not found.</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-[1600px] mx-auto h-[calc(100vh-80px)]"
    >
      <div className="flex flex-col xl:flex-row gap-6 h-full">
        {/* Channel List Sidebar (Left Side) */}
        {categoryChannels.length > 0 && (
          <div className="xl:w-80 shrink-0 flex flex-col h-full bg-surface/30 rounded-2xl border border-white/5 p-4 order-2 xl:order-1">
            <h2 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-widest px-1">
              {channel.category} Channels
            </h2>
            <div className="flex flex-col gap-2 overflow-y-auto pr-2 pb-4 flex-1 scrollbar-thin">
              {categoryChannels.map((ch) => {
                const isActive = ch.id === channelId;
                const multiServer = ch.urls && ch.urls.length > 1;
                return (
                  <button
                    key={ch.id}
                    onClick={() => goTo(ch)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group relative
                      ${isActive 
                        ? 'bg-primary/20 border-primary/50' 
                        : 'bg-surface hover:bg-white/5 border-white/5 hover:border-primary/30'
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors relative
                      ${isActive ? 'bg-primary/30' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
                      {ch.logo ? (
                        <img src={ch.logo} alt={ch.name} className="w-8 h-8 object-contain" onError={(e) => e.target.style.display='none'} />
                      ) : (
                        <span className="text-slate-500 text-xs font-bold">TV</span>
                      )}
                      {multiServer && (
                        <span className="absolute -bottom-1 -right-1 bg-accent/90 text-[9px] font-bold text-white px-1 rounded flex items-center shadow-md border border-black/20">
                          <Server size={8} className="mr-0.5" /> {ch.urls.length}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 pr-6">
                      <p className={`text-sm font-medium truncate transition-colors
                        ${isActive ? 'text-primary font-bold' : 'text-white group-hover:text-primary'}`}>
                        {ch.name}
                      </p>
                      <p className={`text-xs mt-0.5 ${isActive ? 'text-primary/70' : 'text-slate-500'}`}>
                        Ch. {ch.number}
                      </p>
                    </div>
                    {isActive ? (
                      <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--color-primary),0.8)]" />
                    ) : (
                      <div 
                        onClick={(e) => handleRemove(e, ch, isActive)}
                        className="absolute right-3 p-1.5 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all z-10"
                        title="Remove Channel"
                      >
                        <Trash2 size={14} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Player Section (Right Side) */}
        <div className="flex-1 min-w-0 flex flex-col order-1 xl:order-2 h-full">
          <div className="w-full xl:h-[calc(100vh-200px)]">
            <VideoPlayer
              channel={channel}
              onPrev={() => goTo(prevCh)}
              onNext={() => goTo(nextCh)}
            />
          </div>
          <div className="mt-6 bg-surface/40 p-5 rounded-2xl border border-white/5">
            <h1 className="text-2xl font-bold text-white">{channel.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs font-medium text-slate-300 bg-white/10 px-3 py-1 rounded-full">{channel.category}</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" /> LIVE
              </span>
              <span className="text-xs font-medium text-slate-400 bg-black/40 px-3 py-1 rounded-full">Channel {channel.number}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
