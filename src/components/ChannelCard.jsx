import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Tv, Trash2, Server, Pencil, Check, X } from 'lucide-react';
import { useTvStore } from '../store/tvStore';
import { useState } from 'react';

export default function ChannelCard({ channel }) {
  const navigate = useNavigate();
  const { favorites, addFavorite, removeFavorite, addToHistory, removeChannel, renameChannel } = useTvStore();
  const isFav = favorites.some((c) => c.id === channel.id);
  const multiServer = channel.urls && channel.urls.length > 1;

  const [renaming, setRenaming] = useState(false);
  const [nameInput, setNameInput] = useState(channel.name);

  const handlePlay = () => {
    if (renaming) return;
    addToHistory(channel);
    navigate(`/player/${channel.id}`);
  };

  const toggleFav = (e) => {
    e.stopPropagation();
    isFav ? removeFavorite(channel.id) : addFavorite(channel);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (window.confirm(`Remove "${channel.name}"?`)) {
      removeChannel(channel.id);
    }
  };

  const startRename = (e) => {
    e.stopPropagation();
    setNameInput(channel.name);
    setRenaming(true);
  };

  const confirmRename = (e) => {
    e.stopPropagation();
    const trimmed = nameInput.trim();
    if (trimmed && trimmed !== channel.name) {
      renameChannel(channel.id, trimmed);
    }
    setRenaming(false);
  };

  const cancelRename = (e) => {
    e.stopPropagation();
    setNameInput(channel.name);
    setRenaming(false);
  };

  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') confirmRename(e);
    if (e.key === 'Escape') cancelRename(e);
  };

  return (
    <motion.div
      whileHover={renaming ? {} : { scale: 1.03, y: -4 }}
      whileTap={renaming ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={handlePlay}
      className="relative group cursor-pointer rounded-xl overflow-hidden bg-surface border border-white/10 hover:border-primary/50 transition-colors duration-300 flex flex-col"
    >
      {/* Thumbnail/Logo Area */}
      <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {channel.logo ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-16 h-16 object-contain drop-shadow-lg"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <Tv size={32} className="text-slate-600" />
        )}

        {/* Hover Overlay */}
        {!renaming && (
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        )}

        {/* Badges top-left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="bg-black/60 text-xs text-white px-1.5 py-0.5 rounded font-mono w-fit">
            {channel.number}
          </span>
          {multiServer && (
            <span className="bg-accent/80 text-[10px] font-bold text-white px-1.5 py-0.5 rounded flex items-center gap-1 w-fit shadow-md">
              <Server size={10} /> {channel.urls.length}
            </span>
          )}
        </div>

        {/* Action Buttons top-right */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={toggleFav}
            className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              size={14}
              className={isFav ? 'text-yellow-400 fill-yellow-400' : 'text-white'}
            />
          </button>
          <button
            onClick={startRename}
            className="p-1.5 rounded-full bg-black/60 hover:bg-primary/80 text-white transition-colors"
            title="Rename Channel"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={handleRemove}
            className="p-1.5 rounded-full bg-black/60 hover:bg-red-500/80 text-white transition-colors"
            title="Remove Channel"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-3 py-2.5 flex-1 flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {renaming ? (
            <motion.div
              key="rename"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                autoFocus
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 min-w-0 bg-white/10 border border-primary/50 rounded px-2 py-0.5 text-sm text-white focus:outline-none focus:border-primary"
              />
              <button
                onClick={confirmRename}
                className="p-1 rounded bg-primary/80 hover:bg-primary text-white shrink-0"
                title="Confirm"
              >
                <Check size={12} />
              </button>
              <button
                onClick={cancelRename}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-white shrink-0"
                title="Cancel"
              >
                <X size={12} />
              </button>
            </motion.div>
          ) : (
            <motion.h3
              key="name"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-semibold text-white truncate"
            >
              {channel.name}
            </motion.h3>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
