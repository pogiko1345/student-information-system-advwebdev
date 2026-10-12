import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, errorMessage } from '../api.js';

const initial = { studentId: '', fullName: '', email: '', course: '', yearLevel: 1 };
export default function StudentForm() {
  const { id } = useParams(); const navigate = useNavigate();
  const [form, setForm] = useState(initial); const [error, setError] = useState(''); const [loading, setLoading] = useState(Boolean(id)); const [busy, setBusy] = useState(false);
  useEffect(() => { if (!id) return; api.get(`/students/${id}`).then(({ data }) => setForm(data.student)).catch(err => setError(errorMessage(err))).finally(() => setLoading(false)); }, [id]);
  const submit = async event => {
    event.preventDefault(); setError('');
    if (!/^[A-Za-z0-9-]{2,30}$/.test(form.studentId.trim())) return setError('Student ID must be 2-30 letters, numbers, or hyphens.');
    if (form.fullName.trim().length < 2 || form.course.trim().length < 2) return setError('Name and course must contain at least 2 characters.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email.');
    setBusy(true);
    try { const { data } = id ? await api.put(`/students/${id}`, form) : await api.post('/students', form); navigate(`/students/${data.student._id}`); }
    catch (err) { setError(errorMessage(err)); } finally { setBusy(false); }
  };
  return <div className="container py-4" style={{ maxWidth: 750 }}><Link to="/students">← Students</Link><h1 className="page-title mt-3">{id ? 'Edit student' : 'Add student'}</h1>{error && <div className="alert alert-danger" role="alert">{error}</div>}{loading ? <p>Loading student…</p> : <form className="card p-4" onSubmit={submit}><div className="row g-3">{[['studentId','Student ID'],['fullName','Full name'],['email','Email'],['course','Course']].map(([key,label]) => <div className="col-md-6" key={key}><label className="form-label" htmlFor={key}>{label}</label><input className="form-control" id={key} type={key === 'email' ? 'email' : 'text'} required maxLength={key === 'studentId' ? 30 : key === 'fullName' ? 120 : 100} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}/></div>)}<div className="col-md-6"><label className="form-label" htmlFor="yearLevel">Year level</label><select className="form-select" id="yearLevel" value={form.yearLevel} onChange={e => setForm({ ...form, yearLevel: Number(e.target.value) })}>{[1,2,3,4,5,6].map(year => <option key={year} value={year}>{year}</option>)}</select></div></div><div className="mt-4"><button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save student'}</button> <Link className="btn btn-outline-secondary" to="/students">Cancel</Link></div></form>}</div>;
}
