import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from '../pages/Home';
import Player from '../pages/Player';
import Favorites from '../pages/Favorites';
import Search from '../pages/Search';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useTvStore } from '../store/tvStore';
import { parseM3U } from '../lib/channelData';

export default function AppRoutes() {
  const { channels, addPlaylist } = useTvStore();
  const [init, setInit] = useState(false);

  useEffect(() => {
    async function loadDefaultPlaylist() {
      if (channels.length === 0 && !init) {
        setInit(true);
        try {
          const res = await fetch('/playlist.m3u');
          if (res.ok) {
            const text = await res.text();
            const parsedChannels = parseM3U(text);
            if (parsedChannels.length > 0) {
              addPlaylist(parsedChannels, 'default-playlist');
            }
          }
        } catch (err) {
          console.error('Failed to load default playlist', err);
        }
      }
    }
    loadDefaultPlaylist();
  }, [channels.length, init, addPlaylist]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/player/:channelId" element={<Player />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
