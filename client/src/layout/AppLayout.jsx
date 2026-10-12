import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to: '/', label: 'Dashboard', icon: '✨', end: true },
  { to: '/vision-board', label: 'Vision Board', icon: '🎨' },
  { to: '/progress', label: 'Progress', icon: '🌱' },
  { to: '/timeline', label: 'Timeline', icon: '🦋' },
  { to: '/ai-planner', label: 'AI Planner', icon: '💫' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <div className="bg-blobs" aria-hidden>
        <span className="bg-blob pink" />
        <span className="bg-blob blue" />
        <span className="bg-blob mint" />
      </div>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark" aria-hidden />
          <div>
            <strong>DreamBoard</strong>
            <small>Your colourful vision space</small>
          </div>
        </div>
        <nav className="nav">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span className="nav-icon" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p className="muted">{user?.email}</p>
          <button type="button" className="btn ghost" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
