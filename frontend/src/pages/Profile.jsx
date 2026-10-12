import { useEffect, useState } from 'react';
import { api, errorMessage } from '../api.js';
import { useAuth } from '../auth.jsx';

export default function Profile() {
  const { user, setUser } = useAuth(); const [name, setName] = useState(user?.name || ''); const [error, setError] = useState(''); const [success, setSuccess] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { api.get('/profile').then(({ data }) => { setUser(data.user); setName(data.user.name); }).catch(err => setError(errorMessage(err))); }, [setUser]);
  const submit = async event => { event.preventDefault(); setError(''); setSuccess(''); if (name.trim().length < 2 || name.trim().length > 100) return setError('Name must be 2-100 characters.'); setBusy(true); try { const { data } = await api.put('/profile', { name }); setUser(data.user); setSuccess('Profile updated.'); } catch (err) { setError(errorMessage(err)); } finally { setBusy(false); } };
  return <main className="container py-4" style={{ maxWidth: 700 }}><h1 className="page-title mb-4">My profile</h1><div className="card p-4">{error && <div className="alert alert-danger" role="alert">{error}</div>}{success && <div className="alert alert-success" role="status">{success}</div>}<form onSubmit={submit}><div className="mb-3"><label className="form-label" htmlFor="profileName">Full name</label><input className="form-control" id="profileName" required minLength={2} maxLength={100} value={name} onChange={e => setName(e.target.value)}/></div><div className="mb-4"><label className="form-label">Email</label><input className="form-control" value={user?.email || ''} disabled/><div className="form-text">Email changes are not available in this version.</div></div><button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></form></div></main>;
}
