import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Zap } from 'lucide-react';

export default function LevelUpModal({ newLevel, onClose }) {
  useEffect(() => {
    // Trigger confetti cannon on modal mount
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#00e5ff', '#ffd700', '#00ff9d'],
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-obsidian/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-deck hud-border-glow rounded-2xl max-w-md w-full p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-cyan-hud/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-gold-xp/20 rounded-full blur-3xl"></div>

        {/* Animated Badge Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gold-xp to-cyan-hud text-obsidian rounded-2xl flex items-center justify-center shadow-gold-glow animate-bounce">
          <Award className="w-10 h-10" />
        </div>

        <div className="text-xs font-mono text-gold-xp font-extrabold tracking-widest uppercase mb-1">
          LEVEL UP CELEBRATION
        </div>

        <h2 className="text-3xl font-black font-mono text-frost-white uppercase tracking-wider mb-2">
          LEVEL {newLevel} REACHED!
        </h2>

        <p className="text-xs text-silver-tactical font-sans mb-6">
          Your discipline is forging a stronger version of you in the Winter Arc. Target protocol threshold unlocked!
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-cyan-hud to-cyan-electric hover:from-cyan-electric hover:to-gold-xp text-obsidian font-mono font-black text-sm rounded-lg shadow-hud-glow transition-all uppercase tracking-wider"
        >
          CLAIM REWARD & CONTINUE ❄️
        </button>
      </div>
    </div>
  );
}
