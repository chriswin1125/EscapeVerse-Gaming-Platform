import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Trophy, Compass, Shield, User, LogOut, KeyRound, HelpCircle, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

const Navbar = ({ onOpenJoinModal, onOpenHowToPlay }) => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { play } = useAudio();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Explore Rooms', path: '/rooms', auth: false },
    { label: 'Leaderboard', path: '/leaderboard', auth: false },
    ...(isAuthenticated ? [{ label: 'Dashboard', path: '/dashboard', auth: true }] : []),
    ...(isAdmin ? [{ label: 'Admin CMS', path: '/admin', auth: true }] : [])
  ];

  return (
    <nav className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Samsung-style Bold Minimal Brand Logo */}
          <Link
            to="/"
            onClick={() => play('click')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-black text-sm transition group-hover:scale-105">
              <Lock className="w-4 h-4 fill-current" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-neutral-300 transition">
              ESCAPEVERSE
            </span>
          </Link>

          {/* Desktop Links (Samsung-style clean text navigation) */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => play('click')}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* How to Play Button */}
            <button
              type="button"
              onClick={() => {
                play('click');
                onOpenHowToPlay();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition border border-white/15"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#2189FF]" />
              <span>How to Play</span>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Join Pill */}
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  play('click');
                  onOpenJoinModal();
                }}
                className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 bg-transparent hover:bg-white/10 text-white rounded-full text-xs font-semibold border border-white/25 transition"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#2189FF]" />
                <span>Join by Code</span>
              </button>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={`/profile/${user?.username}`}
                  onClick={() => play('click')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-[#2189FF] text-white flex items-center justify-center font-bold text-xs">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-white hidden sm:inline">
                    {user?.username}
                  </span>
                  <span className="text-[10px] text-neutral-400 hidden lg:inline">
                    Lvl {user?.level || 1}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    play('click');
                    logout();
                    navigate('/');
                  }}
                  className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/5 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  onClick={() => play('click')}
                  className="px-4 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => play('click')}
                  className="samsung-btn-primary !py-1.5 !px-4 !text-xs"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-3 bg-[#0a0a0c] border-b border-white/10 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => {
                setMobileMenuOpen(false);
                play('click');
              }}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-neutral-300 hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenHowToPlay();
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-[#2189FF] hover:bg-white/5 flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span>How to Play Guide</span>
          </button>
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenJoinModal();
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-white bg-white/10"
            >
              + Join by Code
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
