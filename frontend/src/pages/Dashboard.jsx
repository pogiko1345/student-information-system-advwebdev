import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, errorMessage } from '../api.js';
import StatCard from '../components/StatCard.jsx';

function Breakdown({ title, items }) { return <div className="col-lg-6"><div className="card p-4 h-100"><h2 className="h5 mb-3">{title}</h2>{items.length ? <ul className="list-group list-group-flush">{items.map(item => <li className="list-group-item d-flex justify-content-between px-0" key={item.label}><span>{item.label}</span><strong>{item.count}</strong></li>)}</ul> : <p className="text-muted mb-0">No student records yet.</p>}</div></div>; }
export default function Dashboard() {
  const [data, setData] = useState(null); const [error, setError] = useState('');
  useEffect(() => { api.get('/dashboard').then(response => setData(response.data)).catch(err => setError(errorMessage(err))); }, []);
  return <main className="container py-4"><div className="d-flex justify-content-between align-items-center mb-4"><div><h1 className="page-title mb-0">Dashboard</h1><p className="text-muted mb-0">Live overview of student records</p></div><Link className="btn btn-primary" to="/students/new">Add student</Link></div>{error ? <div className="alert alert-danger" role="alert">{error}</div> : !data ? <div role="status">Loading dashboard…</div> : <><div className="row g-3 mb-4"><StatCard title="Total students" value={data.totalStudents}/><StatCard title="Courses" value={data.byCourse.length}/><StatCard title="Year levels" value={data.byYearLevel.length}/></div><div className="row g-3"><Breakdown title="Students by course" items={data.byCourse}/><Breakdown title="Students by year level" items={data.byYearLevel}/></div></>}</main>;
}
