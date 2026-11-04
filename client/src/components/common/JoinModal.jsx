import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAudio } from '../../context/AudioContext';

const JoinModal = ({ isOpen, onClose }) => {
  const { play } = useAudio();
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleJoin = (e) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode.length < 4) {
      toast.error('Please enter a valid room code.');
      return;
    }
    play('click');
    onClose();
    navigate(`/session/${cleanCode}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-[#121214] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-white"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6 text-[#2189FF]" />
          </div>
          <h3 className="text-xl font-bold tracking-tight">Join a Game Room</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Enter the 6-character code your teammate shared with you to join their room.
          </p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. 7X9K2P"
              maxLength={8}
              autoFocus
              className="w-full px-4 py-3.5 bg-[#18181b] border border-white/15 rounded-2xl text-center font-mono text-2xl font-bold tracking-widest text-white uppercase focus:outline-none focus:border-white transition"
            />
          </div>

          <button
            type="submit"
            className="samsung-btn-primary w-full !py-3 !text-sm"
          >
            <span>Enter Game Room</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-white/10 text-center">
          <span className="text-[11px] text-neutral-400">
            Don't have a code? You can browse and create your own room from the menu.
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default JoinModal;
