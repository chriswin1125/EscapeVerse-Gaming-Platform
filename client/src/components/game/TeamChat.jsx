import React, { useState, useRef, useEffect } from 'react';
import { Send, Radio, MessageSquare, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

const QUICK_PINGS = [
  '🔍 Found a clue!',
  '⚡ Need help with this lock!',
  '⏰ Watch the countdown clock!',
  '🎯 Almost cracked it!'
];

const TeamChat = ({ chatLog = [], onSendMessage, currentUser }) => {
  const { play } = useAudio();
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text?.trim()) return;
    play('click');
    onSendMessage(text.trim());
    if (!textToSend) setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="samsung-card p-5 flex flex-col h-[320px]">
      <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#2189FF]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Team Chat</h3>
        </div>
        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Connected
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
        {chatLog.map((item, idx) => {
          const isSystem = item.type === 'system';
          const isClue = item.type === 'clue';
          const isSolve = item.type === 'solve';
          const isAlert = item.type === 'alert';
          const isStage = item.type === 'stage';
          const isMe = item.sender === currentUser?.username;

          if (isSystem || isClue || isSolve || isAlert || isStage) {
            return (
              <div
                key={item.id || idx}
                className={`p-2 rounded-xl text-[11px] leading-snug border ${
                  isSolve
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : isAlert
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                    : isClue
                    ? 'bg-[#2189FF]/10 border-[#2189FF]/30 text-[#2189FF]'
                    : isStage
                    ? 'bg-purple-950/40 border-purple-500/40 text-purple-300'
                    : 'bg-white/5 border-white/10 text-neutral-400'
                }`}
              >
                {item.message}
              </div>
            );
          }

          return (
            <div
              key={item.id || idx}
              className={`p-2.5 rounded-2xl border ${
                isMe
                  ? 'bg-white/10 border-white/15 ml-4'
                  : 'bg-[#18181b] border-white/10 mr-4'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-0.5">
                <span className={isMe ? 'text-white font-bold' : 'text-[#2189FF] font-bold'}>
                  {item.sender}
                </span>
                <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="text-neutral-200">{item.message}</div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Ping Pills */}
      <div className="flex gap-1.5 overflow-x-auto py-2 scrollbar-none">
        {QUICK_PINGS.map((ping, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(ping)}
            className="whitespace-nowrap px-3 py-1 bg-[#18181b] hover:bg-white/10 text-[11px] text-neutral-300 hover:text-white rounded-full border border-white/10 transition shrink-0"
          >
            {ping}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-1 border-t border-white/10">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message teammates..."
          maxLength={120}
          className="flex-1 px-4 py-2 bg-[#18181b] border border-white/10 rounded-full text-xs text-white focus:outline-none focus:border-white transition"
        />
        <button
          type="button"
          onClick={() => handleSend()}
          className="samsung-btn-primary !p-2 !w-9 !h-9 flex items-center justify-center"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default TeamChat;
