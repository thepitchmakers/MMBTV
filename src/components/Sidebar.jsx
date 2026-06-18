import { NavLink } from 'react-router-dom';
import { Tv, Star, Search, LayoutDashboard } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/favorites', icon: Star, label: 'Favorites' },
  { to: '/search', icon: Search, label: 'Search' },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 bg-surface/60 border-r border-white/10 h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Tv size={16} className="text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">
          MMB <span className="text-primary">TV</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 pt-4">
        <p className="text-xs text-slate-500 uppercase tracking-widest px-2 mb-2">Menu</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-primary/20 text-primary'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
