import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Skull, Flame, Hourglass, Sparkles, Key, Sun, Moon, Shield, Award } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

const ICON_MAP = {
  skull: Skull,
  crow: Eye,
  hourglass: Hourglass,
  candlestick: Flame,
  mirror: Sparkles,
  key: Key,
  sun: Sun,
  moon: Moon,
  scarab: Shield,
  ankh: Award,
  pyramid: Flame,
  eye: Eye
};

const MemoryMatchPuzzle = ({ puzzle, onSolve, isSolved }) => {
  const { play } = useAudio();
  const rawSymbols = puzzle.config?.symbols || ['skull', 'crow', 'hourglass', 'candlestick', 'mirror', 'key'];

  // Generate 12 cards (6 pairs)
  const [cards, setCards] = useState(() => {
    const deck = [...rawSymbols, ...rawSymbols].map((sym, idx) => ({
      id: `${sym}-${idx}`,
      symbol: sym,
      isFlipped: false,
      isMatched: false
    }));
    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  });

  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedCount, setMatchedCount] = useState(0);

  const handleCardClick = (index) => {
    if (isSolved || cards[index].isMatched || cards[index].isFlipped || flippedIndices.length >= 2) {
      return;
    }

    play('click');
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      if (newCards[firstIdx].symbol === newCards[secondIdx].symbol) {
        // Matched!
        setTimeout(() => {
          play('clue');
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setFlippedIndices([]);
          setMatchedCount((prev) => {
            const updated = prev + 1;
            if (updated >= rawSymbols.length) {
              onSolve({ matchedCount: updated });
            }
            return updated;
          });
        }, 500);
      } else {
        // Mismatch: flip back after brief pause
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  return (
    <div className="p-4 bg-slate-900/90 rounded-xl border border-purple-500/30 text-slate-100">
      <div className="flex items-center justify-between mb-4 border-b border-purple-500/20 pb-3">
        <div>
          <h3 className="font-heading text-lg font-bold text-purple-300">Glyph Memory Resonance</h3>
          <p className="text-xs text-slate-400">Match the pairs of occult glyphs to break the warding circle.</p>
        </div>
        <div className="text-xs font-mono px-3 py-1 bg-purple-950/60 border border-purple-500/40 rounded text-purple-300">
          Pairs: {matchedCount}/{rawSymbols.length}
        </div>
      </div>

      {/* 3x4 Card Grid */}
      <div className="grid grid-cols-4 gap-2.5 my-4">
        {cards.map((card, idx) => {
          const IconComponent = ICON_MAP[card.symbol] || Sparkles;
          const isFaceUp = card.isFlipped || card.isMatched;

          return (
            <motion.button
              key={card.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(idx)}
              disabled={isSolved || card.isMatched}
              className={`h-20 sm:h-24 rounded-lg border-2 flex items-center justify-center transition-all select-none ${
                card.isMatched
                  ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300 opacity-90'
                  : isFaceUp
                  ? 'border-purple-400 bg-purple-900/50 text-cyan-300 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-slate-500'
              }`}
            >
              {isFaceUp ? (
                <div className="flex flex-col items-center gap-1">
                  <IconComponent className="w-7 h-7 animate-bounce" />
                  <span className="text-[10px] font-mono uppercase tracking-wider">{card.symbol}</span>
                </div>
              ) : (
                <span className="text-xl font-heading opacity-30 text-purple-400">?</span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="text-center text-xs text-slate-400 mt-2">
        {isSolved || matchedCount >= rawSymbols.length ? (
          <span className="text-emerald-400 font-bold">ALL GLYPHS SYNCHRONIZED AND CLEARED!</span>
        ) : (
          <span>Select two matching runes to harmonize the ward.</span>
        )}
      </div>
    </div>
  );
};

export default MemoryMatchPuzzle;
