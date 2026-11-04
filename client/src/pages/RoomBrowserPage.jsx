import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Users, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import api from '../services/api';

const THEMES = [
  { id: 'all', label: 'All Rooms' },
  { id: 'haunted-mansion', label: 'Haunted Mansion' },
  { id: 'secret-laboratory', label: 'Secret Laboratory' },
  { id: 'cyber-prison', label: 'Cyber Prison' },
  { id: 'ancient-temple', label: 'Ancient Temple' },
  { id: 'bank-heist', label: 'Bank Heist' }
];

const DIFFICULTIES = ['all', 'easy', 'medium', 'hard'];

const RoomBrowserPage = () => {
  const { play } = useAudio();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/api/rooms');
        if (res.success) setRooms(res.rooms || []);
      } catch (err) {
        console.error('[RoomBrowser Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTheme = selectedTheme === 'all' || room.theme === selectedTheme;
    const matchesDiff = selectedDifficulty === 'all' || room.difficulty === selectedDifficulty;
    return matchesSearch && matchesTheme && matchesDiff;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-8">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Select an Escape Room
        </h1>
        <p className="text-sm text-neutral-400">
          Pick a scenario that matches your squad's taste and difficulty preference. You can play solo or invite friends.
        </p>
      </div>

      {/* Samsung-style Horizontal Filter Pill Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-2 border-b border-white/10">
          {/* Category Pills (like Samsung Galaxy / TV filter tabs) */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  play('click');
                  setSelectedTheme(t.id);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  selectedTheme === t.id
                    ? 'bg-white text-black shadow-md'
                    : 'bg-[#18181b] text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-[#18181b] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition"
            />
          </div>
        </div>

        {/* Difficulty Pill Sub-Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 mr-1">Difficulty:</span>
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                play('click');
                setSelectedDifficulty(d);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition ${
                selectedDifficulty === d
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {d === 'all' ? 'All Difficulties' : d}
            </button>
          ))}
        </div>
      </div>

      {/* Room Cards Grid */}
      {filteredRooms.length === 0 ? (
        <div className="p-16 rounded-3xl bg-[#121214] border border-white/10 text-center text-neutral-400 text-sm">
          No rooms found matching your filter. Try picking a different theme or difficulty.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room.slug}
              className="samsung-card p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-neutral-300 px-3 py-1 rounded-full bg-white/5 border border-white/10 uppercase tracking-wide">
                    {room.difficulty}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{room.timeLimitMinutes?.medium || 20}m (Medium)</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#2189FF] transition">
                    {room.title}
                  </h3>
                  <div className="text-xs text-neutral-400 font-medium mt-0.5">{room.tagline}</div>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                  {room.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <Users className="w-4 h-4 text-neutral-400" />
                  <span>1 – 6 Players</span>
                </div>

                <Link
                  to={`/rooms/${room.slug}`}
                  onClick={() => play('click')}
                  className="samsung-btn-primary !py-1.5 !px-5 !text-xs"
                >
                  <span>Room Details</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomBrowserPage;
