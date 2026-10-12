import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './auth.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import StudentList from './pages/StudentList.jsx';
import StudentDetail from './pages/StudentDetail.jsx';
import StudentForm from './pages/StudentForm.jsx';

export default function App() { return <AuthProvider><Routes><Route path="/login" element={<AuthPage />} /><Route path="/register" element={<AuthPage register />} /><Route element={<ProtectedRoute><Layout /></ProtectedRoute>}><Route path="/" element={<Dashboard />} /><Route path="/students" element={<StudentList />} /><Route path="/students/new" element={<StudentForm />} /><Route path="/students/:id" element={<StudentDetail />} /><Route path="/students/:id/edit" element={<StudentForm />} /><Route path="/profile" element={<Profile />} /></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes></AuthProvider>; }
