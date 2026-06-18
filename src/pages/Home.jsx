import { motion } from 'framer-motion';
import { parseM3U } from '../lib/channelData';
import ChannelGrid from '../components/ChannelGrid';
import { useTvStore } from '../store/tvStore';
import { Clock, Link as LinkIcon, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const { channels, recentlyWatched, addPlaylist, clearPlaylists, playlistUrls } = useTvStore();
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoadPlaylist = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError('');

    try {
      let text;
      try {
        const directRes = await fetch(urlInput);
        if (!directRes.ok) throw new Error('Direct fetch failed');
        text = await directRes.text();
      } catch (err) {
        const proxyUrl = 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(urlInput);
        const proxyRes = await fetch(proxyUrl);
        if (!proxyRes.ok) throw new Error('Failed to load playlist');
        text = await proxyRes.text();
      }

      const parsedChannels = parseM3U(text);
      if (parsedChannels.length === 0) throw new Error('No valid channels found in playlist');

      addPlaylist(parsedChannels, urlInput);
      setUrlInput('');
    } catch (err) {
      setError(err.message || 'Error loading playlist. Check the URL.');
    } finally {
      setLoading(false);
    }
  };

  const PlaylistForm = ({ isMain }) => (
    <div className={`w-full ${isMain ? 'max-w-md mx-auto' : 'mt-6'}`}>
      <form onSubmit={handleLoadPlaylist} className="w-full relative">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://example.com/playlist.m3u"
          className={`w-full bg-surface border border-white/10 rounded-xl pl-4 pr-32 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors ${isMain ? 'py-4' : 'py-3 text-sm'}`}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-primary hover:bg-primary/80 text-white font-medium rounded-lg transition-colors flex items-center justify-center min-w-[80px] ${isMain ? '' : 'text-sm'}`}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Load'}
        </button>
      </form>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );

  if (channels.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 max-w-2xl mx-auto h-[80vh] flex flex-col items-center justify-center text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
          <LinkIcon size={32} className="text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Add Your Playlist</h1>
        <p className="text-slate-400 mb-8 max-w-md">
          To start watching TV, please provide a link to an M3U playlist containing your channels.
        </p>
        <PlaylistForm isMain={true} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-10 bg-gradient-to-br from-primary/30 via-accent/20 to-slate-900 border border-white/10 p-8 flex flex-col md:flex-row gap-8 justify-between items-end">
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white" style={{ width: `${20 + Math.random() * 60}px`, height: `${20 + Math.random() * 60}px`, left: `${Math.random() * 90}%`, top: `${Math.random() * 90}%`, opacity: 0.2 }} />
          ))}
        </div>
        <div className="relative z-10 w-full md:w-1/2">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Welcome to</span>
          <h1 className="text-4xl font-extrabold text-white mt-1 mb-2">
            MMB <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">TV</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-sm mb-4">
            Watching {channels.length} channels from {playlistUrls?.length || 1} playlist{(playlistUrls?.length || 1) > 1 ? 's' : ''}.
          </p>
          <div className="max-w-md">
            <p className="text-xs font-medium text-slate-500 mb-1">Add another playlist:</p>
            <PlaylistForm isMain={false} />
          </div>
        </div>
        <div className="relative z-10 flex shrink-0">
          <button
            onClick={clearPlaylists}
            className="flex items-center gap-2 text-xs bg-black/40 hover:bg-red-500/20 text-red-400 px-4 py-2.5 rounded-lg transition-colors border border-red-500/20"
          >
            <Trash2 size={16} /> Clear All Playlists
          </button>
        </div>
      </div>

      {/* Recently Watched */}
      {recentlyWatched.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-primary" />
            <h2 className="text-base font-bold text-white">Recently Watched</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {recentlyWatched.slice(0, 5).map((ch) => (
              <motion.div key={ch.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <ChannelGrid channels={[ch]} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* All Channels */}
      <section>
        <h2 className="text-base font-bold text-white mb-4">All Channels</h2>
        <ChannelGrid channels={channels} />
      </section>
    </motion.div>
  );
}
