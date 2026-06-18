import { motion } from 'framer-motion';
import { useTvStore } from '../store/tvStore';
import ChannelGrid from '../components/ChannelGrid';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { favorites } = useTvStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-yellow-500/20 flex items-center justify-center">
          <Star size={18} className="text-yellow-400 fill-yellow-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Favorites</h1>
          <p className="text-xs text-slate-500">{favorites.length} channel{favorites.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Star size={48} className="text-slate-700 mb-4" />
          <p className="text-slate-400 font-medium">No favorites yet</p>
          <p className="text-slate-600 text-sm mt-1">Hover over a channel card and click ⭐ to save it here.</p>
          <Link to="/" className="mt-6 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/80 text-white text-sm font-medium transition-colors">
            Browse Channels
          </Link>
        </div>
      ) : (
        <ChannelGrid channels={favorites} />
      )}
    </motion.div>
  );
}
