import { motion } from 'framer-motion';
import { useParams, Navigate } from 'react-router-dom';
import { useTvStore } from '../store/tvStore';
import ChannelGrid from '../components/ChannelGrid';

const categoryIcons = {
  sports: '⚽',
  music: '🎵',
  news: '📰',
  entertainment: '🎬',
  others: '📺',
};

export default function Category() {
  const { categoryId } = useParams();
  const { channels, categories } = useTvStore();

  const originalCat = categories.find((c) => c.toLowerCase() === decodeURIComponent(categoryId));

  if (!originalCat) {
    return <Navigate to="/" replace />;
  }

  const categoryChannels = channels.filter((c) => c.category === originalCat);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-xl">
          {categoryIcons[categoryId] || '📺'}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white capitalize">{originalCat}</h1>
          <p className="text-xs text-slate-500">{categoryChannels.length} channel{categoryChannels.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {categoryChannels.length === 0 ? (
        <div className="text-center py-20 text-slate-500">No channels in this category.</div>
      ) : (
        <ChannelGrid channels={categoryChannels} />
      )}
    </motion.div>
  );
}
