import React from 'react';
import { Shield, Zap, Flame, Target, Radio } from 'lucide-react';

export default function HeaderHud({ progress, dayNumber = 42, totalDays = 90 }) {
  if (!progress) return null;

  const { total_xp, current_level, xp_in_level, xp_required_for_level } = progress;
  const progressRatio = Math.min(1.0, Math.max(0, xp_in_level / (xp_required_for_level || 1)));
  const percentage = Math.round(progressRatio * 100);

  return (
    <div className="bg-deck hud-border rounded-xl p-5 mb-6 shadow-hud-glow relative overflow-hidden">
      {/* Background Subtle Sci-Fi Grid lines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Top Telemetry Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-cyan-hud/15">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-hud/10 border border-cyan-hud/30 rounded text-xs text-cyan-hud font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-hud animate-ping"></span>
            <Radio className="w-3.5 h-3.5" />
            TELEMETRY LINK: STABLE
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-silver-tactical">
            <span>SEC-DEF PROTOCOL 090</span>
            <span className="text-cyan-hud/40">•</span>
            <span className="text-cyan-hud font-mono">LOCKED IN 100% ADHERENCE</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-silver-tactical">
            <Target className="w-4 h-4 text-cyan-hud" />
            <span>STRIKE RATE: <strong className="text-green-cyber font-bold">98.4%</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-gold-xp font-bold">
            <Zap className="w-4 h-4 text-gold-xp fill-gold-xp" />
            <span>{total_xp.toLocaleString()} TOTAL XP</span>
          </div>
        </div>
      </div>

      {/* Main Title & Day Counter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-frost-white font-mono uppercase">
              WINTER ARC PROTOCOL
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-cyan-hud text-obsidian rounded uppercase">
              DAY {dayNumber} / {totalDays}
            </span>
          </div>
          <p className="text-xs text-silver-tactical max-w-2xl font-sans">
            Phase 2: Hyper-Trophy & Cognitive Hardening. Winter isolation threshold active. Zero compromise on caloric, kinetic, or deep work benchmarks.
          </p>
        </div>

        {/* Level Badge */}
        <div className="flex items-center gap-4 bg-deck-light border border-cyan-hud/30 px-5 py-3 rounded-lg shadow-inner">
          <div className="p-3 bg-gradient-to-br from-cyan-hud to-cyan-muted text-obsidian rounded-md font-black text-xl shadow-hud-glow">
            LVL {current_level}
          </div>
          <div>
            <div className="text-xs text-silver-tactical uppercase font-mono tracking-wider">RANK STATUS</div>
            <div className="text-sm font-bold text-frost-white font-mono">TITAN PROTOCOL</div>
          </div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div>
        <div className="flex justify-between items-center text-xs font-mono mb-2">
          <span className="text-cyan-hud font-semibold uppercase flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-gold-xp fill-gold-xp" />
            LEVEL PROGRESSION ({percentage}%)
          </span>
          <span className="text-silver-tactical">
            <strong className="text-frost-white">{xp_in_level}</strong> / {xp_required_for_level} XP
          </span>
        </div>

        {/* Progress Track */}
        <div className="h-3.5 w-full bg-deck-light rounded-full p-0.5 border border-cyan-hud/20 overflow-hidden relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-hud via-cyan-electric to-gold-xp transition-all duration-700 ease-out shadow-hud-glow"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
