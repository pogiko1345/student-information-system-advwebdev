import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, ProtectedRoute, useAuth } from './auth.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Brand from './components/Brand.jsx';

function Home() { const { user, signOut } = useAuth(); return <main className="container py-5"><Brand compact /><h1 className="mt-4">Student Information System</h1><p>Welcome, {user.name}.</p><button className="btn btn-outline-secondary" onClick={signOut}>Log out</button></main>; }
export default function App() { return <AuthProvider><Routes><Route path="/login" element={<AuthPage />} /><Route path="/register" element={<AuthPage register />} /><Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></AuthProvider>; }
