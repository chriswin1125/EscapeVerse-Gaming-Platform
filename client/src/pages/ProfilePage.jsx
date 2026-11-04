import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Award,
  Trophy,
  Zap,
  Clock,
  ShieldCheck,
  DoorOpen,
  Cpu,
  Search,
  Users,
  Edit2,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import api from '../services/api';

const AVATAR_OPTIONS = [
  { id: 'cyber-ninja', name: 'Ninja' },
  { id: 'quantum-hacker', name: 'Hacker' },
  { id: 'shadow-detective', name: 'Detective' },
  { id: 'vault-cracker', name: 'Cracker' },
  { id: 'alchemist', name: 'Alchemist' },
  { id: 'chrono-wanderer', name: 'Wanderer' }
];

const ACHIEVEMENT_ICONS = {
  DoorOpen,
  Zap,
  Search,
  Cpu,
  Users,
  ShieldCheck,
  Award,
  Trophy
};

const ProfilePage = () => {
  const { username } = useParams();
  const { user: authUser, updateUser } = useAuth();
  const { play } = useAudio();

  const [profileData, setProfileData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [allAchievements, setAllAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');

  const isMyProfile = authUser?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, achRes] = await Promise.all([
          api.get(`/api/users/profile/${username}`),
          api.get('/api/users/achievements').catch(() => ({ achievements: [] }))
        ]);

        if (profileRes.success) {
          setProfileData(profileRes.user);
          setSessions(profileRes.sessions || []);
          setSelectedAvatar(profileRes.user.avatar || 'cyber-ninja');
        }
        if (achRes.success) {
          setAllAchievements(achRes.achievements || []);
        }
      } catch (err) {
        toast.error('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const handleSaveAvatar = async (avatarId) => {
    try {
      play('click');
      const res = await api.put('/api/auth/profile', { avatar: avatarId });
      if (res.success) {
        setSelectedAvatar(avatarId);
        setEditingAvatar(false);
        updateUser({ avatar: avatarId });
        setProfileData((prev) => ({ ...prev, avatar: avatarId }));
        toast.success('Avatar updated!');
      }
    } catch (err) {
      toast.error('Failed to update avatar.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center text-neutral-400 text-sm">
        Loading operative profile...
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-md mx-auto text-center py-20 text-neutral-400 text-sm">
        User profile not found.
      </div>
    );
  }

  const unlockedCodes = new Set((profileData.achievements || []).map((a) => a.code));

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      {/* Profile Header Dossier */}
      <div className="rounded-3xl bg-[#121214] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#2189FF] text-white flex items-center justify-center font-bold text-3xl shadow-lg">
              {profileData.username.charAt(0).toUpperCase()}
            </div>
            {isMyProfile && (
              <button
                type="button"
                onClick={() => setEditingAvatar(!editingAvatar)}
                className="absolute -bottom-1 -right-1 p-2 bg-[#18181b] hover:bg-neutral-800 text-white rounded-full border border-white/15 shadow"
                title="Change Avatar"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-white">
                LEVEL {profileData.level || 1}
              </span>
              <span className="text-xs text-neutral-400">• {profileData.xp || 0} XP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              {profileData.username}
            </h1>
            <p className="text-xs text-[#2189FF] font-medium mt-0.5">
              {profileData.title || 'Novice Escapist'}
            </p>
          </div>
        </div>

        {/* Career Stats */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto text-center text-xs">
          <div className="p-4 bg-[#18181b] rounded-2xl border border-white/5">
            <div className="text-neutral-400 text-[10px]">GAMES</div>
            <div className="font-bold text-white text-lg mt-0.5">{profileData.stats?.gamesPlayed || 0}</div>
          </div>
          <div className="p-4 bg-[#18181b] rounded-2xl border border-white/5">
            <div className="text-neutral-400 text-[10px]">ESCAPES</div>
            <div className="font-bold text-emerald-400 text-lg mt-0.5">{profileData.stats?.escapes || 0}</div>
          </div>
          <div className="p-4 bg-[#18181b] rounded-2xl border border-white/5">
            <div className="text-neutral-400 text-[10px]">WIN STREAK</div>
            <div className="font-bold text-amber-400 text-lg mt-0.5">{profileData.stats?.winStreak || 0} 🔥</div>
          </div>
        </div>
      </div>

      {/* Avatar Selection Drawer */}
      {editingAvatar && (
        <div className="samsung-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Choose Your Avatar</h3>
            <button
              onClick={() => setEditingAvatar(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {AVATAR_OPTIONS.map((av) => (
              <div
                key={av.id}
                onClick={() => handleSaveAvatar(av.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition flex flex-col items-center gap-2 ${
                  selectedAvatar === av.id
                    ? 'border-white bg-white/15'
                    : 'border-white/10 bg-[#18181b] hover:border-white/20'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#2189FF] text-white flex items-center justify-center font-bold text-sm">
                  {av.name.charAt(0)}
                </div>
                <span className="text-xs text-white font-medium">{av.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Section */}
      <div className="samsung-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Achievements & Badges</h2>
          </div>
          <span className="text-xs text-neutral-400">
            {profileData.achievements?.length || 0} / {allAchievements.length || 6} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allAchievements.map((ach) => {
            const isUnlocked = unlockedCodes.has(ach.code);
            const IconComponent = ACHIEVEMENT_ICONS[ach.icon] || Award;

            return (
              <div
                key={ach.code}
                className={`p-4 rounded-2xl border transition flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-[#18181b] border-white/20'
                    : 'bg-[#121214] border-white/5 opacity-40'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isUnlocked ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30' : 'bg-white/5 text-neutral-600'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                    {isUnlocked && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">{ach.description}</p>
                  <div className="text-[10px] text-[#2189FF] font-medium pt-1">+{ach.xpReward} XP</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Match History */}
      <div className="samsung-card p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight pb-3 border-b border-white/10">
          Recent Matches
        </h2>

        {sessions.length === 0 ? (
          <p className="text-xs text-neutral-400 text-center py-6">No previous games recorded.</p>
        ) : (
          <div className="divide-y divide-white/5 text-xs">
            {sessions.map((sess) => (
              <div key={sess._id} className="py-3.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{sess.room?.title || 'Escape Room'}</div>
                  <div className="text-[11px] text-neutral-400">
                    Room Code: <span className="font-mono text-neutral-300">{sess.roomCode}</span> • {new Date(sess.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase ${
                      sess.status === 'escaped'
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {sess.status}
                  </span>
                  <span className="font-bold text-white">{sess.score || 0} pts</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
