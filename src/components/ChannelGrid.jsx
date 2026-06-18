import { motion } from 'framer-motion';
import ChannelCard from './ChannelCard';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ChannelGrid({ channels, title }) {
  if (!channels || channels.length === 0) return null;

  return (
    <section className="mb-10">
      {title && (
        <h2 className="text-lg font-bold text-white mb-4 px-1">{title}</h2>
      )}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        {channels.map((ch) => (
          <motion.div key={ch.id || ch.url} variants={item}>
            <ChannelCard channel={ch} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
