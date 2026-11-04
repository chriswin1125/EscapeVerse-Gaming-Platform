import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, KeyRound, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';

const AVATARS = [
  { id: 'cyber-ninja', name: 'Ninja' },
  { id: 'quantum-hacker', name: 'Hacker' },
  { id: 'shadow-detective', name: 'Detective' },
  { id: 'vault-cracker', name: 'Cracker' },
  { id: 'alchemist', name: 'Alchemist' }
];

const RegisterPage = () => {
  const { register } = useAuth();
  const { play } = useAudio();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('cyber-ninja');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      toast.error('All fields are required.');
      return;
    }

    try {
      setSubmitting(true);
      play('click');
      await register(username, email, password, selectedAvatar);
      navigate('/dashboard');
    } catch (err) {
      // toast shown in context
    } finally {
      setSubmitting(false);
    }
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
            <User className="w-5 h-5 text-neutral-300" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create an Account</h1>
          <p className="text-xs text-neutral-400">
            Sign up to create escape rooms, invite friends, and save your progress.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Player Username
            </label>
            <input
              type="text"
              required
              minLength={3}
              maxLength={20}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. AlexSolver"
              className="w-full px-4 py-3 bg-[#18181b] border border-white/10 rounded-2xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition"
            />
          </div>

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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-3 bg-[#18181b] border border-white/10 rounded-2xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition"
            />
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">Select Avatar</label>
            <div className="grid grid-cols-5 gap-2">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`p-2 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                    selectedAvatar === av.id
                      ? 'border-white bg-white/15 text-white shadow'
                      : 'border-white/10 bg-[#18181b] text-neutral-500 hover:text-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#2189FF] text-white font-bold text-xs flex items-center justify-center">
                    {av.name.charAt(0)}
                  </div>
                  <span className="text-[10px] font-medium">{av.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="samsung-btn-primary w-full !py-3 !text-sm mt-3"
          >
            <span>{submitting ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-neutral-400">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:underline font-semibold">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
