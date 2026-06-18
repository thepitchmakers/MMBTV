import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useTvStore } from '../store/tvStore';
import ChannelGrid from '../components/ChannelGrid';
import { Search as SearchIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const { channels } = useTvStore();

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const results = query.trim()
    ? channels.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <h1 className="text-xl font-bold text-white mb-6">Search Channels</h1>

      {/* Search Input */}
      <div className="relative mb-8 max-w-lg">
        <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchParams(e.target.value ? { q: e.target.value } : {});
          }}
          placeholder="Search by name or category..."
          className="w-full bg-surface border border-white/10 rounded-xl pl-11 pr-5 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors text-sm"
        />
      </div>

      {/* Results */}
      {query.trim() ? (
        results.length > 0 ? (
          <>
            <p className="text-xs text-slate-500 mb-4">{results.length} result{results.length !== 1 ? 's' : ''} for "{query}"</p>
            <ChannelGrid channels={results} />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400">No channels found for "{query}"</p>
            <p className="text-slate-600 text-sm mt-1">Try a different search term</p>
          </div>
        )
      ) : (
        <div className="text-center py-20">
          <SearchIcon size={48} className="text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500">Start typing to search channels</p>
        </div>
      )}
    </motion.div>
  );
}
