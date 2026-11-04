import React from 'react';
import { Lock, Radio, Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black py-12 px-4 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">
            <Lock className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-tight">
              ESCAPEVERSE
            </div>
            <div className="text-[11px] text-neutral-500">Real-Time Multiplayer Escape Room Gaming Platform</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
          <Link to="/rooms" className="hover:text-white transition">Escape Rooms</Link>
          <Link to="/leaderboard" className="hover:text-white transition">Leaderboard</Link>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Multiplayer Server Online
          </span>
        </div>

        <div className="text-[11px] text-neutral-500 text-center md:text-right">
          © {new Date().getFullYear()} EscapeVerse. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
