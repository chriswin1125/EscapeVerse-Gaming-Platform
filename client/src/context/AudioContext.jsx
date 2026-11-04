import React, { createContext, useContext, useState, useEffect } from 'react';
import { playSound, startAmbientSound, stopAmbientSound } from '../utils/soundFx.js';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('escapeverse_muted') === 'true';
  });
  const [volume, setVolume] = useState(0.6);
  const [ambientEnabled, setAmbientEnabled] = useState(false);

  useEffect(() => {
    localStorage.setItem('escapeverse_muted', isMuted);
    if (isMuted) {
      stopAmbientSound();
    } else if (ambientEnabled) {
      startAmbientSound(volume);
    }
  }, [isMuted, ambientEnabled, volume]);

  const play = (soundType) => {
    if (!isMuted) {
      playSound(soundType, volume);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleAmbient = () => {
    setAmbientEnabled((prev) => !prev);
  };

  return (
    <AudioContext.Provider
      value={{
        isMuted,
        toggleMute,
        volume,
        setVolume,
        play,
        ambientEnabled,
        toggleAmbient
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
