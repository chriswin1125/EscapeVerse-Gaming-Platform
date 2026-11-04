import React, { useState } from 'react';
import { Copy, Check, Users, Crown, Play, Shield, Clock, HelpCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAudio } from '../../context/AudioContext';
import TeamChat from './TeamChat';

const RoomLobby = ({
  session,
  currentUser,
  onToggleReady,
  onStartGame,
  onSendMessage,
  onOpenHowToPlay
}) => {
  const { play } = useAudio();
  const [copied, setCopied] = useState(false);

  const room = session?.room;
  const isHost = session?.players?.find((p) => p.username === currentUser?.username)?.isHost;
  const currentPlayer = session?.players?.find((p) => p.username === currentUser?.username);
  const isReady = currentPlayer?.isReady;

  const handleCopyCode = () => {
    play('click');
    navigator.clipboard.writeText(session.roomCode);
    setCopied(true);
    toast.success(`Invite code [${session.roomCode}] copied to clipboard!`);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-6">
      {/* Top Banner & Room Invite Code */}
      <div className="rounded-3xl bg-[#121214] border border-white/10 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white">
                Game Lobby
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#2189FF]/10 text-[#2189FF]">
                {session?.difficulty?.toUpperCase()} MODE
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {room?.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
              {room?.tagline}
            </p>
          </div>

          {/* Invitation Code Box (Samsung-style clean card) */}
          <div className="p-5 rounded-2xl bg-[#18181b] border border-white/10 flex flex-col items-center gap-2 text-center min-w-[240px]">
            <span className="text-[11px] font-medium text-neutral-400">
              INVITE CODE FOR FRIENDS
            </span>
            <div className="text-3xl font-mono font-black text-white tracking-widest my-1">
              {session?.roomCode}
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="samsung-btn-primary !py-1.5 !px-4 !text-xs w-full"
            >
              {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              <span>{copied ? 'Code Copied!' : 'Copy Invite Code'}</span>
            </button>
          </div>
        </div>

        {/* 3-Step Simple Guide for New Players */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2189FF] text-white flex items-center justify-center font-bold text-xs shrink-0">
              ?
            </div>
            <div className="text-xs text-neutral-300">
              <strong className="text-white">How to Start: </strong>
              1. Send the code to friends (or play solo). 2. Click <strong>"I'm Ready"</strong>. 3. Host clicks <strong>"Start Escape Room"</strong>!
            </div>
          </div>
          {onOpenHowToPlay && (
            <button
              type="button"
              onClick={onOpenHowToPlay}
              className="text-xs font-semibold text-[#2189FF] hover:underline whitespace-nowrap"
            >
              Read Full Rules →
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Player Slots & Team Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Player Slots */}
        <div className="lg:col-span-2 space-y-6">
          <div className="samsung-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-white" />
                <h2 className="text-base font-bold text-white">
                  Players in Lobby ({session?.players?.length || 1} / 6)
                </h2>
              </div>
              <span className="text-xs text-neutral-400">Can play with 1 to 6 people</span>
            </div>

            {/* Players Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {session?.players?.map((player, idx) => (
                <div
                  key={player.username || idx}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition ${
                    player.isReady
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-[#18181b] border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2189FF] text-white font-bold text-sm flex items-center justify-center shadow">
                      {player.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-white">{player.username}</span>
                        {player.isHost && (
                          <span className="text-[10px] font-semibold text-amber-400 px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
                            HOST
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-400">
                        {player.connected ? 'Online' : 'Reconnecting...'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      player.isReady
                        ? 'bg-emerald-500 text-black'
                        : 'bg-white/10 text-neutral-400'
                    }`}
                  >
                    {player.isReady ? 'READY' : 'Waiting...'}
                  </span>
                </div>
              ))}

              {/* Empty Slots */}
              {Array.from({ length: Math.max(0, 6 - (session?.players?.length || 1)) }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-dashed border-white/10 bg-transparent flex items-center justify-center text-xs text-neutral-500"
                >
                  + Empty Player Slot
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => onToggleReady(!isReady)}
                className={`w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold transition border ${
                  isReady
                    ? 'bg-emerald-500 text-black border-emerald-500 font-bold'
                    : 'bg-transparent text-white border-white/25 hover:border-white'
                }`}
              >
                {isReady ? '✓ You Are Ready (Click to Cancel)' : 'Click When Ready'}
              </button>

              {isHost ? (
                <button
                  type="button"
                  onClick={onStartGame}
                  className="samsung-btn-primary w-full sm:w-auto"
                >
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  <span>Start Escape Room</span>
                </button>
              ) : (
                <div className="text-xs text-neutral-400 text-center sm:text-right">
                  Waiting for the host ({session?.players?.find((p) => p.isHost)?.username}) to start the game...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1-Col: Team Chat */}
        <div className="space-y-6">
          <TeamChat
            chatLog={session?.chatLog || []}
            onSendMessage={onSendMessage}
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
};

export default RoomLobby;
