import React from 'react';
import { Activity } from 'lucide-react';

export default function HeatmapGrid({ logs, tasks }) {
  const totalDays = 90; // 90-Day Winter Arc Protocol Grid

  // Get all unique dates where tasks were completed, sorted chronologically
  const sortedCompletedDates = Array.from(
    new Set(
      (logs || [])
        .filter((l) => l.completed === 1)
        .map((l) => l.date)
    )
  ).sort();

  const totalCompletedDays = sortedCompletedDates.length;
  const currentActiveProtocolDay = totalCompletedDays + 1;

  // Generate 90 Protocol Days (Day 1 to Day 90) sequentially
  const gridCells = [];
  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    const isCompleted = dayNum <= totalCompletedDays;
    const isToday = dayNum === currentActiveProtocolDay;
    const isFuture = dayNum > currentActiveProtocolDay;
    const dateAssigned = isCompleted ? sortedCompletedDates[dayNum - 1] : null;

    gridCells.push({
      dayNum,
      dateAssigned,
      isCompleted,
      isToday,
      isFuture,
    });
  }

  return (
    <div className="bg-deck hud-border rounded-xl p-5 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-cyan-hud/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-hud">
            <Activity className="w-3.5 h-3.5" />
            TELEMETRY GRID • 90-DAY HABIT CONSTELLATION
          </div>
          <h2 className="text-xl font-bold font-mono text-frost-white uppercase tracking-wider">
            ARC CONSISTENCY HEATMAP (DAY 1 - 90)
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-silver-tactical">AUSTERITY SCALE:</span>
          <div className="flex gap-1 items-center">
            <div className="w-3 h-3 bg-deck-light border border-cyan-hud/20 rounded-sm"></div>
            <div className="w-3 h-3 bg-cyan-hud/30 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-cyber rounded-sm shadow-hud-glow"></div>
            <span className="text-cyan-hud font-bold ml-1">MAX 100%</span>
          </div>
        </div>
      </div>

      {/* Heatmap 90-Day Protocol Grid (15 Columns x 6 Rows) */}
      <div className="grid grid-cols-10 sm:grid-cols-15 gap-2 my-2">
        {gridCells.map((cell) => (
          <div
            key={cell.dayNum}
            title={`Protocol Day ${cell.dayNum}${
              cell.dateAssigned ? ` (Logged: ${cell.dateAssigned})` : ''
            }: ${
              cell.isCompleted ? 'COMPLETED' : cell.isToday ? 'CURRENT ACTIVE DAY' : 'FUTURE'
            }`}
            className={`h-9 rounded flex flex-col items-center justify-center text-[10px] font-mono transition-all ${
              cell.isToday
                ? 'bg-cyan-hud/20 text-cyan-hud font-black border-2 border-cyan-hud shadow-hud-glow animate-pulse'
                : cell.isCompleted
                ? 'bg-cyan-hud text-obsidian font-bold shadow-hud-glow'
                : 'bg-deck-light/30 border border-cyan-hud/15 text-silver-tactical/40'
            }`}
          >
            <span className="text-[9px] opacity-60">DAY</span>
            <span className="font-extrabold text-[11px]">{cell.dayNum}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center text-[11px] font-mono text-silver-tactical pt-3 border-t border-cyan-hud/10">
        <span>COMPLETED: {totalCompletedDays} / 90 DAYS</span>
        <span className="text-cyan-hud font-bold">CURRENT PROTOCOL STAGE: DAY {currentActiveProtocolDay} / 90</span>
        <span>TARGET: DAY 90 APEX</span>
      </div>
    </div>
  );
}
