import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lock, Play, Users, Trophy, Zap, Shield, KeyRound, ArrowRight, Sparkles, HelpCircle, Search, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';

const ROOM_SHOWCASES = [
  {
    title: 'Haunted Mansion',
    subtitle: 'The Cursed Ancestry',
    theme: 'haunted-mansion',
    difficulty: 'Medium',
    time: '20 min',
    desc: 'Explore an abandoned 1889 estate. Find hidden notes, match haunted portraits, and crack the master iron cellar lock.'
  },
  {
    title: 'Secret Laboratory',
    subtitle: 'Biohazard Protocol',
    theme: 'secret-laboratory',
    difficulty: 'Medium',
    time: '20 min',
    desc: 'An airborne pathogen has breached containment. Mix the chemical antidote, adjust cryogenic valves, and override the quarantine door.'
  },
  {
    title: 'Cyber Prison',
    subtitle: 'System Override',
    theme: 'cyber-prison',
    difficulty: 'Hard',
    time: '15 min',
    desc: 'Trapped by a rogue AI Warden. Safely snip circuit wires, reconstruct the neural grid matrix, and enter the root access key.'
  },
  {
    title: 'Bank Heist',
    subtitle: 'The Federal Vault',
    theme: 'bank-heist',
    difficulty: 'Hard',
    time: '15 min',
    desc: 'Slip past infrared laser scanners, sever the silent alarm circuits, and spin the 20-ton titanium vault combination.'
  },
  {
    title: 'Ancient Temple',
    subtitle: 'Pharaoh’s Tomb',
    theme: 'ancient-temple',
    difficulty: 'Easy',
    time: '30 min',
    desc: 'Match ancient deity runes, align solar obelisk mirrors to reflect sunlight, and pronounce the sacred guardian name.'
  }
];

const HOW_IT_WORKS = [
  {
    step: '1',
    icon: Search,
    title: 'Search for Clues',
    desc: 'Click on glowing items in the virtual room to reveal secret notes, keys, and combination codes.'
  },
  {
    step: '2',
    icon: Lock,
    title: 'Solve Interactive Puzzles',
    desc: 'Click the lock buttons. Type keypad codes, shift ciphers, or cut wires using the clues your team found.'
  },
  {
    step: '3',
    icon: Trophy,
    title: 'Escape Together',
    desc: 'Clear all 3 stages before the countdown timer hits zero. Earn XP, unlock medals, and top the leaderboard!'
  }
];

const HomePage = ({ onOpenJoinModal, onOpenHowToPlay }) => {
  const { isAuthenticated } = useAuth();
  const { play } = useAudio();

  return (
    <div className="space-y-24 py-8">
      {/* Samsung-style Minimalist Hero Banner */}
      <section className="text-center px-4 pt-12 pb-16 max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#2189FF] animate-pulse" />
          <span>Multiplayer Virtual Escape Rooms</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
          Think fast. Work together. <br className="hidden sm:inline" />
          <span className="text-neutral-400">Escape before time runs out.</span>
        </h1>

        <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          An interactive online escape room game for you and your friends. Search virtual chambers for clues, solve tactile puzzles collaboratively, and beat the clock.
        </p>

        {/* Hero CTA Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            to={isAuthenticated ? '/rooms' : '/register'}
            onClick={() => play('click')}
            className="samsung-btn-primary"
          >
            <span>{isAuthenticated ? 'Browse Rooms' : 'Get Started Free'}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>

          <button
            type="button"
            onClick={() => {
              play('click');
              onOpenJoinModal();
            }}
            className="samsung-btn-secondary"
          >
            <KeyRound className="w-4 h-4 mr-2 text-[#2189FF]" />
            <span>Join with Code</span>
          </button>

          <button
            type="button"
            onClick={() => {
              play('click');
              onOpenHowToPlay();
            }}
            className="px-4 py-2.5 rounded-full text-neutral-400 hover:text-white text-xs font-medium transition flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4" />
            <span>How to Play</span>
          </button>
        </div>

        {/* Demo Login Quick Hint */}
        <div className="pt-4">
          <div className="inline-block px-4 py-2 rounded-full bg-[#121214] border border-white/10 text-xs text-neutral-400">
            <span className="text-white font-semibold">Demo credentials: </span>
            <span className="font-mono text-neutral-300">admin@escapeverse.com / AdminPass123!</span>
          </div>
        </div>
      </section>

      {/* "How It Works" 3-Step Section (Crystal Clear for Beginners) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How the Game Works
          </h2>
          <p className="text-sm text-neutral-400">
            No gaming experience needed. In 3 simple steps, anyone can jump in and have fun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="samsung-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-white/10 text-white font-bold flex items-center justify-center text-sm mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Samsung Product Showcase Style Room Cards */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Featured Escape Rooms
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Choose from 5 distinct immersive scenarios, each with unique puzzles.
            </p>
          </div>
          <Link
            to="/rooms"
            onClick={() => play('click')}
            className="text-xs font-semibold text-[#2189FF] hover:underline flex items-center gap-1"
          >
            <span>View All Rooms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ROOM_SHOWCASES.map((room) => (
            <div
              key={room.theme}
              className="samsung-card p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-neutral-300 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    {room.difficulty} Level
                  </span>
                  <span className="text-xs text-neutral-400">{room.time}</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#2189FF] transition">
                    {room.title}
                  </h3>
                  <div className="text-xs text-neutral-400 font-medium mt-0.5">{room.subtitle}</div>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">{room.desc}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-neutral-400">1 – 6 Players</span>
                <Link
                  to={`/rooms/${room.theme}`}
                  onClick={() => play('click')}
                  className="samsung-btn-primary !py-1.5 !px-4 !text-xs"
                >
                  <span>Play Room</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Teamwork & Clean Features Banner */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl bg-[#121214] border border-white/10 p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to test your team's wits?
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            Create a private room in seconds, invite your squad with a quick code, and start solving puzzles together in real time.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              to="/rooms"
              onClick={() => play('click')}
              className="samsung-btn-primary"
            >
              Browse Rooms Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
