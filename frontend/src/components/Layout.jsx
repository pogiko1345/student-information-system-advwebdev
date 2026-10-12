import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import Brand from './Brand.jsx';

export default function Layout() {
  const { user, signOut } = useAuth(); const navigate = useNavigate();
  const logout = () => { signOut(); navigate('/login'); };
  return <><nav className="navbar navbar-expand-lg navbar-light bg-white sis-navbar"><div className="container"><Link className="navbar-brand" to="/" aria-label="NU MOA Student Information System home"><Brand compact /></Link><button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon" /></button><div className="collapse navbar-collapse" id="mainNav"><div className="navbar-nav me-auto"><NavLink className="nav-link" to="/" end>Dashboard</NavLink><NavLink className="nav-link" to="/students">Students</NavLink><NavLink className="nav-link" to="/profile">Profile</NavLink></div><span className="navbar-text me-3">{user?.name}</span><button className="btn btn-sm btn-outline-primary" onClick={logout}>Log out</button></div></div></nav><Outlet /></>;
}
