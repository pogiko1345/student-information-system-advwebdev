import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, errorMessage } from '../api.js';
import { useAuth } from '../auth.jsx';
import Icon from '../components/Icon.jsx';
import StatCard from '../components/StatCard.jsx';

function Breakdown({ title, subtitle, items, total, tone }) {
  const max = Math.max(...items.map(item => item.count), 1);
  return <section className="insight-card"><div className="insight-heading"><div><h2>{title}</h2><p>{subtitle}</p></div><span className={`insight-heading-icon ${tone}`}><Icon name={tone === 'gold' ? 'layers' : 'book'} size={20} /></span></div>{items.length ? <div className="insight-list">{items.map(item => <div className="insight-row" key={item.label}><div className="insight-row-label"><span>{item.label}</span><strong>{item.count}<small> / {total}</small></strong></div><div className="insight-track" role="img" aria-label={`${item.label}: ${item.count} of ${total} students`}><div className={`insight-fill ${tone}`} style={{ width: `${(item.count / max) * 100}%` }} /></div></div>)}</div> : <div className="insight-empty">Add students to see a breakdown here.</div>}</section>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { setLoading(true); setError(''); try { const response = await api.get('/dashboard'); setData(response.data); } catch (err) { setError(errorMessage(err)); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const firstName = user?.name?.trim().split(/\s+/)[0] || 'there';

  return <main className="container dashboard-page py-4 py-lg-5">
    <div className="dashboard-header"><div><div className="dashboard-eyebrow"><span className="live-dot" /> ADMIN WORKSPACE</div><h1>Good day, {firstName}<span className="dashboard-wave" aria-hidden="true">✦</span></h1><p>Here is your student information overview.</p></div><div className="dashboard-actions"><button className="btn btn-light dashboard-refresh" onClick={load} disabled={loading}><Icon name="refresh" size={17} /> Refresh</button><Link className="btn btn-primary dashboard-add" to="/students/new"><Icon name="plus" size={18} /> Add student</Link></div></div>
    {error && <div className="alert alert-danger d-flex align-items-center justify-content-between gap-3" role="alert"><span>{error}</span><button className="btn btn-sm btn-outline-danger" onClick={load}>Try again</button></div>}
    {loading && !data ? <div className="dashboard-loading" role="status"><div className="dashboard-skeleton" /><div className="dashboard-skeleton" /><div className="dashboard-skeleton" /></div> : data && <>
      <div className="metric-grid"><StatCard title="Total students" value={data.totalStudents} icon="users" detail="Records in the system" index={0}/><StatCard title="Courses" value={data.byCourse.length} icon="book" detail="Programs represented" index={1}/><StatCard title="Year levels" value={data.byYearLevel.length} icon="layers" detail="Levels represented" index={2}/></div>
      <div className="dashboard-section-heading"><div><h2>Enrollment insights</h2><p>Live distribution across your student records</p></div><span className="data-badge"><span className="live-dot" /> Live data</span></div>
      <div className="insight-grid"><Breakdown title="By course" subtitle="Students across programs" items={data.byCourse} total={data.totalStudents} tone="blue"/><Breakdown title="By year level" subtitle="Current year distribution" items={data.byYearLevel} total={data.totalStudents} tone="gold"/></div>
      <div className="dashboard-section-heading recent-heading"><div><h2>Recently added</h2><p>Your newest student records</p></div><Link className="dashboard-view-all" to="/students">View all students <Icon name="arrow" size={16} /></Link></div>
      <section className="recent-card">{data.recentStudents?.length ? <div className="recent-list">{data.recentStudents.map(student => <Link className="recent-row" key={student._id} to={`/students/${student._id}`}><span className="recent-avatar">{student.fullName?.trim()[0]?.toUpperCase()}</span><span className="recent-person"><strong>{student.fullName}</strong><small>{student.studentId}</small></span><span className="recent-course">{student.course}</span><span className="recent-year">Year {student.yearLevel}</span><Icon name="chevron" size={17} /></Link>)}</div> : <div className="recent-empty"><span className="recent-empty-icon"><Icon name="users" size={25} /></span><strong>No student records yet</strong><p>Start by adding your first student.</p><Link className="btn btn-primary btn-sm" to="/students/new">Add student</Link></div>}</section>
    </>}
  </main>;
}
