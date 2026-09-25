import React from 'react';
import { Flame, Trophy, Calendar, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function StreakPage({ progress, tasks, logs }) {
  const globalStreak = progress?.global_streak || 0;
  const longestGlobalStreak = progress?.longest_global_streak || 0;

  // Build log map per date
  const logsPerDate = (logs || []).reduce((acc, log) => {
    if (log.completed === 1) {
      acc[log.date] = (acc[log.date] || 0) + 1;
    }
    return acc;
  }, {});

  const totalTaskCount = tasks.length || 1;

  // Build 90-day calendar days
  const now = new Date();
  const calendarDays = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const doneCount = logsPerDate[dateStr] || 0;
    const isPerfect = doneCount >= totalTaskCount && totalTaskCount > 0;
    const isPartial = doneCount > 0 && doneCount < totalTaskCount;

    calendarDays.push({
      dateStr,
      dayNum: d.getDate(),
      month: d.toLocaleString('default', { month: 'short' }),
      isPerfect,
      isPartial,
      doneCount,
    });
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-deck hud-border rounded-xl p-6 shadow-hud-glow">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-hud mb-1">
          <Flame className="w-4 h-4 text-gold-xp fill-gold-xp" />
          DISCIPLINE PROTOCOL • STREAK TRACKING
        </div>
        <h2 className="text-2xl font-black font-mono text-frost-white uppercase tracking-wider mb-2">
          ARC STREAK TELEMETRY
        </h2>
        <p className="text-xs text-silver-tactical max-w-2xl font-sans">
          A Global Streak increments when 100% of all active routine tasks are completed on a date ("Perfect Day"). Missed routines break the active streak.
        </p>
      </div>

      {/* Streak Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-deck hud-border-glow rounded-xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-silver-tactical uppercase tracking-wider">
              CURRENT GLOBAL STREAK
            </span>
            <div className="p-2.5 bg-gold-xp/15 text-gold-xp rounded-lg">
              <Flame className="w-6 h-6 fill-gold-xp" />
            </div>
          </div>
          <div className="text-4xl font-black font-mono text-gold-xp mb-2">
            {globalStreak} <span className="text-base text-frost-white font-normal">DAYS</span>
          </div>
          <div className="text-xs text-silver-tactical font-mono">
            {globalStreak > 0 ? '🔥 UNBROKEN STREAK ACTIVE' : '⚠️ STREAK INACTIVE — COMPLETE ALL TASKS TODAY'}
          </div>
        </div>

        <div className="bg-deck hud-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-silver-tactical uppercase tracking-wider">
              LONGEST STREAK RECORD
            </span>
            <div className="p-2.5 bg-cyan-hud/15 text-cyan-hud rounded-lg">
              <Trophy className="w-6 h-6" />
            </div>
          </div>
          <div className="text-4xl font-black font-mono text-cyan-hud mb-2">
            {longestGlobalStreak} <span className="text-base text-frost-white font-normal">DAYS</span>
          </div>
          <div className="text-xs text-silver-tactical font-mono">
            ALL-TIME WINTER ARC RECORD
          </div>
        </div>
      </div>

      {/* 90-Day Global Streak Calendar */}
      <div className="bg-deck hud-border rounded-xl p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyan-hud/15">
          <h3 className="text-base font-bold font-mono text-frost-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-hud" />
            90-DAY UNBROKEN STREAK MATRIX
          </h3>
          <div className="flex items-center gap-3 text-xs font-mono text-silver-tactical">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-cyber rounded-sm"></span> Perfect Day (100%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-cyan-hud/40 rounded-sm"></span> Partial
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-deck-light border border-cyan-hud/20 rounded-sm"></span> Missed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-10 sm:grid-cols-15 gap-2">
          {calendarDays.map((day, idx) => (
            <div
              key={idx}
              title={`${day.dateStr}: ${day.doneCount}/${totalTaskCount} Tasks Done`}
              className={`h-9 rounded flex flex-col items-center justify-center text-[10px] font-mono transition-all ${
                day.isPerfect
                  ? 'bg-green-cyber text-obsidian font-bold shadow-hud-glow'
                  : day.isPartial
                  ? 'bg-cyan-hud/40 text-frost-white border border-cyan-hud/50'
                  : 'bg-deck-light border border-cyan-hud/10 text-silver-tactical/50'
              }`}
            >
              <span>{day.dayNum}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-Task Streak Breakdown */}
      <div className="bg-deck hud-border rounded-xl p-6">
        <h3 className="text-base font-bold font-mono text-frost-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-hud" />
          INDIVIDUAL HABIT STREAK BREAKDOWN
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-cyan-hud/15 text-silver-tactical">
                <th className="pb-3 uppercase">Habit Protocol</th>
                <th className="pb-3 uppercase">Category</th>
                <th className="pb-3 uppercase text-center">Active Streak</th>
                <th className="pb-3 uppercase text-center">Best Record</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-hud/10">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-deck-light/40">
                  <td className="py-3.5 font-semibold text-frost-white">{task.name}</td>
                  <td className="py-3.5 text-cyan-hud">{task.category}</td>
                  <td className="py-3.5 text-center font-bold text-gold-xp">
                    {task.current_streak} Days
                  </td>
                  <td className="py-3.5 text-center font-bold text-silver-tactical">
                    {task.longest_streak} Days
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
