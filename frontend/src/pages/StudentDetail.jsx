import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, errorMessage } from '../api.js';

export default function StudentDetail() {
  const { id } = useParams(); const navigate = useNavigate(); const [student, setStudent] = useState(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  useEffect(() => { api.get(`/students/${id}`).then(({ data }) => setStudent(data.student)).catch(err => setError(errorMessage(err))).finally(() => setLoading(false)); }, [id]);
  const remove = async () => { if (!window.confirm('Delete this student record?')) return; try { await api.delete(`/students/${id}`); navigate('/students'); } catch (err) { setError(errorMessage(err)); } };
  return <div className="container py-4"><Link to="/students">← Students</Link>{loading ? <p className="mt-4">Loading student…</p> : error ? <div className="alert alert-danger mt-4">{error}</div> : <div className="card p-4 mt-3"><h1 className="page-title">{student.fullName}</h1><dl className="row mt-3">{[['Student ID',student.studentId],['Email',student.email],['Course',student.course],['Year level',student.yearLevel]].map(([label,value]) => <div className="col-md-6 mb-3" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div><Link className="btn btn-primary" to={`/students/${id}/edit`}>Edit</Link> <button className="btn btn-outline-danger" onClick={remove}>Delete</button></div></div>}</div>;
}
