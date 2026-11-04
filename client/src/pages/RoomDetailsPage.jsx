import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Clock,
  Users,
  Shield,
  Play,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import api from '../services/api';

const RoomDetailsPage = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const { play } = useAudio();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState('medium');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/api/rooms/${slug}`);
        if (res.success) {
          setRoom(res.room);
          setDifficulty(res.room.difficulty || 'medium');
        }
      } catch (err) {
        toast.error('Failed to load room details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [slug]);

  const handleLaunchSession = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in or create an account to start playing.');
      navigate('/login');
      return;
    }

    try {
      setCreating(true);
      play('click');
      const res = await api.post('/api/sessions/create', {
        roomId: room._id,
        difficulty
      });

      if (res.success && res.roomCode) {
        toast.success(`Game lobby ready! Code: ${res.roomCode}`);
        navigate(`/session/${res.roomCode}`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to initialize session.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center text-neutral-400 text-sm">
        Loading room details...
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <h2 className="text-xl font-bold text-white">Room Not Found</h2>
        <Link to="/rooms" className="text-xs text-[#2189FF] mt-4 inline-block hover:underline">
          Return to Room List
        </Link>
      </div>
    );
  }

  const timeLimits = room.timeLimitMinutes || { easy: 30, medium: 20, hard: 15 };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8">
      {/* Back button */}
      <Link
        to="/rooms"
        onClick={() => play('click')}
        className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Rooms</span>
      </Link>

      {/* Hero Showcase Card */}
      <div className="rounded-3xl bg-[#121214] border border-white/10 p-8 sm:p-10 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white">
            {room.theme}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#2189FF]/10 text-[#2189FF] border border-[#2189FF]/25">
            {difficulty.toUpperCase()} MODE
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {room.title}
        </h1>
        <p className="text-base text-neutral-300 max-w-2xl leading-relaxed">
          {room.description}
        </p>

        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-white" />
            <span>1 to 6 Players</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white" />
            <span>{timeLimits[difficulty] || 20} Minutes Timer</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-white" />
            <span>{room.stages?.length || 3} Consecutive Stages</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Difficulty & Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Stages Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="samsung-card p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>What You Need to Do (Stages)</span>
            </h2>

            <div className="space-y-3 pt-2">
              {room.stages?.map((stage, idx) => (
                <div
                  key={stage.stageNumber || idx}
                  className="p-4 rounded-2xl bg-[#18181b] border border-white/10 flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {stage.stageNumber}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">{stage.name}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">{stage.lore}</p>
                    <div className="text-[11px] text-[#2189FF] font-medium pt-1">
                      Contains {stage.hotspots?.length || 0} clues to discover
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Difficulty & Start Playing Card */}
        <div className="space-y-6">
          <div className="samsung-card p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Select Difficulty</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Choose how much time your team gets on the clock:
              </p>
            </div>

            {/* Difficulty Cards */}
            <div className="space-y-2">
              {[
                { id: 'easy', label: 'Easy (Beginner)', mins: timeLimits.easy || 30, desc: 'Generous 30 minutes. Great for first-time players.' },
                { id: 'medium', label: 'Medium (Standard)', mins: timeLimits.medium || 20, desc: 'Balanced 20 minutes timer. Moderate puzzle difficulty.' },
                { id: 'hard', label: 'Hard (Expert)', mins: timeLimits.hard || 15, desc: 'Fast 15 minutes clock with stricter time penalties.' }
              ].map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => {
                    play('click');
                    setDifficulty(tier.id);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition select-none ${
                    difficulty === tier.id
                      ? 'bg-white text-black border-white shadow-md'
                      : 'bg-[#18181b] border-white/10 text-white hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{tier.label}</span>
                    <span className={`text-xs font-mono font-semibold ${difficulty === tier.id ? 'text-black' : 'text-[#2189FF]'}`}>
                      {tier.mins} mins
                    </span>
                  </div>
                  <p className={`text-[11px] mt-1 leading-snug ${difficulty === tier.id ? 'text-neutral-700' : 'text-neutral-400'}`}>
                    {tier.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Start Button */}
            <button
              type="button"
              onClick={handleLaunchSession}
              disabled={creating}
              className="samsung-btn-primary w-full !py-3.5 !text-sm"
            >
              <span>{creating ? 'Creating Room...' : 'Start Game / Invite Friends'}</span>
              <Play className="w-4 h-4 ml-2 fill-current" />
            </button>

            <p className="text-[11px] text-neutral-400 text-center leading-relaxed">
              Clicking will create a private game lobby and generate a 6-letter room code you can send to your friends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;
