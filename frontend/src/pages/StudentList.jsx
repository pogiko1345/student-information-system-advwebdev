import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, errorMessage } from '../api.js';

export default function StudentList() {
  const [students, setStudents] = useState([]); const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/students').then(({ data }) => setStudents(data.students)).catch(err => setError(errorMessage(err))).finally(() => setLoading(false)); }, []);
  return <div className="container py-4"><div className="d-flex justify-content-between align-items-center mb-4"><h1 className="page-title">Students</h1><Link className="btn btn-primary" to="/students/new">Add student</Link></div>{loading ? <p>Loading students…</p> : error ? <div className="alert alert-danger">{error}</div> : students.length ? <div className="card table-responsive"><table className="table table-hover mb-0"><thead><tr><th>Student ID</th><th>Name</th><th>Course</th><th>Year</th><th></th></tr></thead><tbody>{students.map(student => <tr key={student._id}><td>{student.studentId}</td><td>{student.fullName}</td><td>{student.course}</td><td>{student.yearLevel}</td><td><Link to={`/students/${student._id}`}>View</Link></td></tr>)}</tbody></table></div> : <div className="card p-5 text-center">No students yet. Add your first record.</div>}</div>;
}
