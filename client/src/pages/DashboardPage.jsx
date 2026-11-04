import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Zap,
  Lock,
  Play,
  Users,
  Compass,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Clock,
  Award,
  HelpCircle,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import api from '../services/api';

const DashboardPage = ({ onOpenJoinModal, onOpenHowToPlay }) => {
  const { user } = useAuth();
  const { play } = useAudio();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [leaderboardPreview, setLeaderboardPreview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickCode, setQuickCode] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [roomsRes, recentRes, lbRes] = await Promise.all([
          api.get('/api/rooms'),
          api.get('/api/sessions/my/recent').catch(() => ({ sessions: [] })),
          api.get('/api/leaderboard?limit=5').catch(() => ({ leaderboard: [] }))
        ]);

        if (roomsRes.success) setRooms(roomsRes.rooms || []);
        if (recentRes.success) setRecentSessions(recentRes.sessions || []);
        if (lbRes.success) setLeaderboardPreview(lbRes.leaderboard || []);
      } catch (err) {
        console.error('[Dashboard Error]', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleQuickJoin = (e) => {
    e.preventDefault();
    if (!quickCode.trim()) return;
    play('click');
    navigate(`/session/${quickCode.trim().toUpperCase()}`);
  };

  const currentXP = user?.xp || 0;
  const currentLevel = user?.level || 1;
  const nextLevelXP = Math.pow(currentLevel, 2) * 100;
  const prevLevelXP = Math.pow(currentLevel - 1, 2) * 100;
  const xpInCurrentLevel = currentXP - prevLevelXP;
  const xpNeededForLevel = nextLevelXP - prevLevelXP;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100))) || 45;

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-8">
      {/* Welcome Showcase Banner */}
      <div className="rounded-3xl bg-[#121214] border border-white/10 p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#2189FF] text-white flex items-center justify-center font-bold text-2xl shadow-lg">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-400">
                LEVEL {user?.level || 1} • {user?.title || 'Escapist'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
              Welcome back, {user?.username}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Ready for your next challenge? Choose a room or join a friend's game.
            </p>
          </div>
        </div>

        {/* Level XP Bar & Rules Button */}
        <div className="w-full lg:w-96 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-300">
            <span>Level {currentLevel + 1} Progress</span>
            <span className="font-mono text-white font-semibold">{currentXP} / {nextLevelXP} XP</span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <span>Win Streak: {user?.stats?.winStreak || 0} 🔥</span>
            <button
              type="button"
              onClick={onOpenHowToPlay}
              className="text-[#2189FF] hover:underline font-medium flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How to Play Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launch & Join Code Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Join Card */}
        <div className="samsung-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="w-4 h-4 text-[#2189FF]" />
              <h3 className="text-sm font-bold text-white">Join by Code</h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Have an invitation code from a friend? Enter it below to join their game.
            </p>
          </div>

          <form onSubmit={handleQuickJoin} className="mt-4 flex gap-2">
            <input
              type="text"
              value={quickCode}
              onChange={(e) => setQuickCode(e.target.value.toUpperCase())}
              placeholder="e.g. 7X9K2P"
              maxLength={8}
              className="flex-1 px-4 py-2 bg-[#18181b] border border-white/10 rounded-full text-xs font-mono tracking-widest uppercase text-white focus:outline-none focus:border-white transition"
            />
            <button
              type="submit"
              className="samsung-btn-primary !py-2 !px-4 !text-xs"
            >
              Join
            </button>
          </form>
        </div>

        {/* Career Stats */}
        <div className="samsung-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Your Stats</h3>
            </div>
            <Link
              to={`/profile/${user?.username}`}
              className="text-xs text-[#2189FF] hover:underline"
            >
              Profile →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center my-2">
            <div className="p-3 bg-[#18181b] rounded-2xl border border-white/5">
              <div className="text-base font-bold text-white">{user?.stats?.gamesPlayed || 0}</div>
              <div className="text-[10px] text-neutral-400">PLAYED</div>
            </div>
            <div className="p-3 bg-[#18181b] rounded-2xl border border-white/5">
              <div className="text-base font-bold text-emerald-400">{user?.stats?.escapes || 0}</div>
              <div className="text-[10px] text-neutral-400">ESCAPED</div>
            </div>
            <div className="p-3 bg-[#18181b] rounded-2xl border border-white/5">
              <div className="text-base font-bold text-[#2189FF]">{user?.stats?.puzzlesSolved || 0}</div>
              <div className="text-[10px] text-neutral-400">PUZZLES</div>
            </div>
          </div>
        </div>

        {/* Quick Rules Help Card */}
        <div className="samsung-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Game Rules</h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              1. Click glowing pins to find clues.<br />
              2. Open locks and solve puzzles.<br />
              3. Beat the timer to escape!
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenHowToPlay}
            className="samsung-btn-secondary !py-2 !text-xs mt-3 w-full"
          >
            Open How to Play Guide
          </button>
        </div>
      </div>

      {/* Available Escape Rooms */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Available Escape Rooms</h2>
          <Link to="/rooms" className="text-xs text-[#2189FF] hover:underline flex items-center gap-1 font-semibold">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.slice(0, 3).map((room) => (
            <div
              key={room.slug}
              className="samsung-card p-6 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-neutral-300 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 uppercase">
                    {room.difficulty}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {room.timeLimitMinutes?.medium || 20}m Timer
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[#2189FF] transition">
                  {room.title}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {room.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-neutral-500">1 – 6 Players</span>
                <Link
                  to={`/rooms/${room.slug}`}
                  onClick={() => play('click')}
                  className="samsung-btn-primary !py-1.5 !px-4 !text-xs"
                >
                  <span>Play</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
