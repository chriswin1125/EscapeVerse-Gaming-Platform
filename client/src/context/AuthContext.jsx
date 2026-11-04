import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('escapeverse_token') || null);
  const [loading, setLoading] = useState(true);

  const safeJson = async (res) => {
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await res.json();
    }
    const raw = await res.text();
    const clean = raw.replace(/<[^>]*>/g, '').trim().slice(0, 120);
    throw new Error(clean || `Server communication error (${res.status})`);
  };

  // Fetch current user if token exists
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await safeJson(res);

        if (data.success && data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem('escapeverse_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('[Auth] Failed to verify auth token:', err);
        localStorage.removeItem('escapeverse_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });
      const data = await safeJson(res);

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('escapeverse_token', data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success(`Welcome back, Agent ${data.user.username}!`);
      return data.user;
    } catch (err) {
      toast.error(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (username, email, password, avatar = 'cyber-ninja') => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), email: email.trim().toLowerCase(), password, avatar })
      });
      const data = await safeJson(res);

      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('escapeverse_token', data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success(`Welcome to EscapeVerse, ${data.user.username}!`);
      return data.user;
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('escapeverse_token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
