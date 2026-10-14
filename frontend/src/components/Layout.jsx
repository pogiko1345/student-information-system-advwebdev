import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import Icon from './Icon.jsx';

const links = [
  { to: '/', label: 'Overview', icon: 'grid', end: true },
  { to: '/students', label: 'Students', icon: 'users' },
  { to: '/profile', label: 'My profile', icon: 'user' },
];

export default function Layout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.classList.toggle('sis-menu-open', menuOpen);
    return () => document.body.classList.remove('sis-menu-open');
  }, [menuOpen]);
  const logout = () => { signOut(); navigate('/login'); };
  const section = location.pathname.startsWith('/students') ? 'Students' : location.pathname.startsWith('/profile') ? 'My profile' : 'Overview';
  const initials = user?.name?.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase()).join('') || 'NU';

  return <div className="admin-shell">
    <button className={`sidebar-scrim ${menuOpen ? 'is-visible' : ''}`} onClick={() => setMenuOpen(false)} aria-label="Close navigation" tabIndex={menuOpen ? 0 : -1} />
    <aside className={`admin-sidebar ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
      <Link className="sidebar-brand" to="/" aria-label="Student Information System home">
        <span className="sidebar-brand-mark"><img src="/nu-logo.webp" alt="" /></span>
        <span className="sidebar-brand-copy"><strong>Student Hub</strong><small>MOA Campus</small></span>
      </Link>
      <div className="sidebar-section-label">WORKSPACE</div>
      <nav className="sidebar-nav">
        {links.map(link => <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}><Icon name={link.icon} size={20} /><span>{link.label}</span>{link.to === '/' && <span className="sidebar-link-dot" />}</NavLink>)}
      </nav>
      <div className="sidebar-bottom"><div className="sidebar-help"><span className="sidebar-help-icon"><Icon name="sparkle" size={19} /></span><strong>Keep records organized</strong><p>Everything your team needs in one place.</p><Link to="/students/new">Add a student <span aria-hidden="true">↗</span></Link></div><button className="sidebar-logout" onClick={logout}><Icon name="logout" size={19} /> Log out</button></div>
    </aside>
    <div className="admin-main">
      <header className="admin-topbar"><div className="topbar-left"><button className="topbar-menu" aria-label="Open navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}><Icon name="menu" size={22} /></button><div className="topbar-breadcrumb"><span>Workspace</span><Icon name="chevron" size={15} /><strong>{section}</strong></div></div><div className="topbar-right"><span className="topbar-role">Student Information System</span><span className="topbar-avatar" aria-hidden="true">{initials}</span><span className="topbar-user">{user?.name}</span></div></header>
      <Outlet />
    </div>
  </div>;
}
