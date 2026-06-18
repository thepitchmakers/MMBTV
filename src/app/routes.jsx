import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Player from '../pages/Player';
import Favorites from '../pages/Favorites';
import Search from '../pages/Search';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function AppRoutes() {
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
