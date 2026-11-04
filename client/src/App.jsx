import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import JoinModal from './components/common/JoinModal';
import HowToPlayModal from './components/common/HowToPlayModal';

import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import RoomBrowserPage from './pages/RoomBrowserPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import GameSessionPage from './pages/GameSessionPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-400 text-xs">
        Loading...
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-black text-[#f5f5f7] selection:bg-white selection:text-black">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: '500'
          }
        }}
      />

      <Navbar
        onOpenJoinModal={() => setJoinModalOpen(true)}
        onOpenHowToPlay={() => setHowToPlayOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onOpenJoinModal={() => setJoinModalOpen(true)}
                onOpenHowToPlay={() => setHowToPlayOpen(true)}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage
                  onOpenJoinModal={() => setJoinModalOpen(true)}
                  onOpenHowToPlay={() => setHowToPlayOpen(true)}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/rooms" element={<RoomBrowserPage />} />
          <Route path="/rooms/:slug" element={<RoomDetailsPage />} />
          <Route
            path="/session/:roomCode"
            element={
              <ProtectedRoute>
                <GameSessionPage />
              </ProtectedRoute>
            }
          />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Modals */}
      <JoinModal isOpen={joinModalOpen} onClose={() => setJoinModalOpen(false)} />
      <HowToPlayModal isOpen={howToPlayOpen} onClose={() => setHowToPlayOpen(false)} />
    </div>
  );
}

export default App;
