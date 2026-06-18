import { Link, useNavigate } from 'react-router-dom';
import { Search, Tv } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-surface/60 backdrop-blur-md sticky top-0 z-30 shrink-0">
      {/* Mobile Logo */}
      <Link to="/" className="flex md:hidden items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Tv size={14} className="text-white" />
        </div>
        <span className="font-bold text-white">MMB <span className="text-primary">TV</span></span>
      </Link>

      {/* Page title on desktop */}
      <div className="hidden md:block text-sm text-slate-400">
        Welcome back 👋
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative flex-1 max-w-xs mx-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search channels..."
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors"
        />
      </form>

      {/* Mobile nav buttons */}
      <div className="flex md:hidden gap-3 text-slate-400">
        <Link to="/favorites" className="hover:text-primary transition-colors">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </Link>
      </div>
    </header>
  );
}
