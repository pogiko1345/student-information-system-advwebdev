import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api, errorMessage } from '../api.js';
import { useAuth } from '../auth.jsx';
import Brand from '../components/Brand.jsx';

export default function AuthPage({ register = false }) {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;
  const submit = async event => {
    event.preventDefault(); setError('');
    if (register && (form.name.trim().length < 2 || form.name.trim().length > 100)) return setError('Name must be 2-100 characters.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address.');
    if (register && form.password.length < 8) return setError('Password must contain at least 8 characters.');
    setBusy(true);
    try { const { data } = await api.post(register ? '/auth/register' : '/auth/login', form); signIn(data); navigate(location.state?.from?.pathname || '/', { replace: true }); }
    catch (err) { setError(errorMessage(err)); } finally { setBusy(false); }
  };
  return <main className="container py-5" style={{ maxWidth: 480 }}><div className="card auth-card p-4 p-md-5"><Brand /><div className="auth-card__divider" /><h1 className="page-title h3 mb-2">{register ? 'Create an account' : 'Welcome back'}</h1><p className="text-muted mb-4">Student Information System</p>{error && <div className="alert alert-danger" role="alert">{error}</div>}<form onSubmit={submit}>{register && <div className="mb-3"><label className="form-label" htmlFor="name">Full name</label><input id="name" className="form-control" value={form.name} maxLength={100} required onChange={e => setForm({ ...form, name: e.target.value })}/></div>}<div className="mb-3"><label className="form-label" htmlFor="email">Email</label><input id="email" type="email" className="form-control" value={form.email} required onChange={e => setForm({ ...form, email: e.target.value })}/></div><div className="mb-4"><label className="form-label" htmlFor="password">Password</label><input id="password" type="password" className="form-control" value={form.password} required minLength={register ? 8 : 1} onChange={e => setForm({ ...form, password: e.target.value })}/></div><button className="btn btn-primary w-100" disabled={busy}>{busy ? 'Please wait…' : register ? 'Register' : 'Sign in'}</button></form><p className="mt-4 mb-0 text-center">{register ? 'Already have an account?' : 'New here?'} <Link to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Register'}</Link></p></div></main>;
}
