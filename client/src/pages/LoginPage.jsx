import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';

const LoginPage = () => {
  const { login } = useAuth();
  const { play } = useAudio();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }

    try {
      setSubmitting(true);
      play('click');
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // toast shown in context
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    play('click');
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#121214] border border-white/10 rounded-3xl p-8 shadow-2xl relative"
      >
        <div className="text-center mb-6 space-y-1">
          <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5 text-neutral-300" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sign In to EscapeVerse</h1>
          <p className="text-xs text-neutral-400">
            Enter your email and password to access your game rooms.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-[#18181b] border border-white/10 rounded-2xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 bg-[#18181b] border border-white/10 rounded-2xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="samsung-btn-primary w-full !py-3 !text-sm mt-2"
          >
            <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>

        {/* Quick Demo Credentials Autofill */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
          <div className="text-[11px] text-neutral-400 text-center font-medium">
            One-Click Demo Accounts:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('admin@escapeverse.com', 'AdminPass123!')}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-neutral-300 transition text-center"
            >
              👑 Demo Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('player1@escapeverse.com', 'PlayerPass123!')}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-neutral-300 transition text-center"
            >
              ⚡ Demo Player
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-neutral-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-white hover:underline font-semibold">
            Create an Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
