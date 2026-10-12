import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api } from './api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(sessionStorage.getItem('sis_token')));
  useEffect(() => {
    if (!sessionStorage.getItem('sis_token')) return;
    api.get('/auth/me').then(({ data }) => setUser(data.user)).catch(() => sessionStorage.removeItem('sis_token')).finally(() => setLoading(false));
  }, []);
  const signIn = data => { sessionStorage.setItem('sis_token', data.token); setUser(data.user); };
  const signOut = () => { sessionStorage.removeItem('sis_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, signIn, signOut, setUser }}>{children}</AuthContext.Provider>;
}
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="container py-5">Checking session…</div>;
  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
}
