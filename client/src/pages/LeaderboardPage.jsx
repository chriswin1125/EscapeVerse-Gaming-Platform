import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Users, Award } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import api from '../services/api';

const formatSeconds = (sec) => {
  const mins = Math.floor(sec / 60);
  const remainingSecs = sec % 60;
  return `${mins}m ${String(remainingSecs).padStart(2, '0')}s`;
};

const LeaderboardPage = () => {
  const { play } = useAudio();
  const [entries, setEntries] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('score');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/api/rooms');
        if (res.success) setRooms(res.rooms || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (selectedRoom) query.append('room', selectedRoom);
        if (selectedDifficulty) query.append('difficulty', selectedDifficulty);
        if (sortBy) query.append('sortBy', sortBy);

        const res = await api.get(`/api/leaderboard?${query.toString()}`);
        if (res.success) setEntries(res.leaderboard || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedRoom, selectedDifficulty, sortBy]);

  const top3 = entries.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex p-3 rounded-full bg-white/10 text-white mb-2">
          <Trophy className="w-6 h-6 text-amber-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Hall of Fame
        </h1>
        <p className="text-sm text-neutral-400">
          Rankings of the top players and teams who successfully escaped our chambers.
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="samsung-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Room Filter */}
          <select
            value={selectedRoom}
            onChange={(e) => {
              play('click');
              setSelectedRoom(e.target.value);
            }}
            className="px-4 py-2 bg-[#18181b] border border-white/10 rounded-full text-xs text-white focus:outline-none focus:border-white transition"
          >
            <option value="">All Escape Rooms</option>
            {rooms.map((r) => (
              <option key={r._id} value={r._id}>
                {r.title}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => {
              play('click');
              setSelectedDifficulty(e.target.value);
            }}
            className="px-4 py-2 bg-[#18181b] border border-white/10 rounded-full text-xs text-white focus:outline-none focus:border-white transition"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Sort Toggles */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 mr-1">Sort:</span>
          <button
            type="button"
            onClick={() => {
              play('click');
              setSortBy('score');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              sortBy === 'score'
                ? 'bg-white text-black shadow'
                : 'bg-[#18181b] text-neutral-400 hover:text-white'
            }`}
          >
            Highest Score
          </button>
          <button
            type="button"
            onClick={() => {
              play('click');
              setSortBy('time');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              sortBy === 'time'
                ? 'bg-white text-black shadow'
                : 'bg-[#18181b] text-neutral-400 hover:text-white'
            }`}
          >
            Fastest Time
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {top3.map((entry, idx) => {
            const isFirst = idx === 0;

            return (
              <div
                key={entry._id}
                className={`samsung-card p-6 flex flex-col justify-between text-center relative ${
                  isFirst
                    ? 'border-amber-400/50 bg-[#161619] order-first md:order-2'
                    : 'order-2 md:order-1'
                }`}
              >
                <div>
                  <div
                    className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold text-lg mb-4 ${
                      idx === 0
                        ? 'bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)]'
                        : idx === 1
                        ? 'bg-neutral-300 text-black'
                        : 'bg-amber-700 text-white'
                    }`}
                  >
                    #{idx + 1}
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight">{entry.teamName}</h3>
                  <p className="text-xs text-[#2189FF] font-medium mt-0.5">{entry.roomTitle}</p>

                  <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                    {entry.players?.map((p, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-300"
                      >
                        {p.username}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-white/10 text-xs">
                  <div className="p-2.5 bg-[#18181b] rounded-2xl">
                    <div className="text-[10px] text-neutral-400">SCORE</div>
                    <div className="font-bold text-white text-sm">{entry.score} pts</div>
                  </div>
                  <div className="p-2.5 bg-[#18181b] rounded-2xl">
                    <div className="text-[10px] text-neutral-400">TIME</div>
                    <div className="font-bold text-white text-sm">{formatSeconds(entry.timeTakenSeconds)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="samsung-card p-6 overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-neutral-400 font-semibold uppercase tracking-wider pb-3">
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">Team</th>
              <th className="py-3 px-4">Room</th>
              <th className="py-3 px-4">Difficulty</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4 text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {entries.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-neutral-400">
                  No records found matching your filters.
                </td>
              </tr>
            ) : (
              entries.map((entry, index) => (
                <tr key={entry._id} className="hover:bg-white/5 transition">
                  <td className="py-3.5 px-4 font-bold text-white">#{index + 1}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{entry.teamName}</div>
                    <div className="text-[11px] text-neutral-400">
                      {entry.players?.map((p) => p.username).join(', ')}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300">{entry.roomTitle}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-white/10 text-neutral-300">
                      {entry.difficulty}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-white">{formatSeconds(entry.timeTakenSeconds)}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#2189FF]">{entry.score} pts</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
