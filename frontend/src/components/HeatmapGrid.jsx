import React from 'react';
import { Activity } from 'lucide-react';

export default function HeatmapGrid({ logs, tasks }) {
  const totalDays = 90; // 90-Day Winter Arc Protocol Grid (6 rows x 15 cols or 9 rows x 10 cols)
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Determine Day 1 Start Date from earliest task created_date or earliest log date
  let startDateStr = todayStr;

  if (tasks && tasks.length > 0) {
    const createdDates = tasks
      .map((t) => t.created_date)
      .filter(Boolean)
      .sort();
    if (createdDates.length > 0) {
      startDateStr = createdDates[0];
    }
  }

  const startDate = new Date(startDateStr);

  // Set of dates where at least 1 task was completed
  const completedDates = new Set(
    (logs || [])
      .filter((l) => l.completed === 1)
      .map((l) => l.date)
  );

  // Calculate elapsed protocol day for today (1-indexed)
  const msPerDay = 1000 * 60 * 60 * 24;
  const todayDiffDays = Math.floor((new Date(todayStr) - startDate) / msPerDay);
  const currentProtocolDay = Math.max(1, todayDiffDays + 1);

  // Generate 90 Protocol Days (Day 1 to Day 90)
  const gridCells = [];
  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + (dayNum - 1));
    const cellDateStr = cellDate.toISOString().split('T')[0];

    const isCompleted = completedDates.has(cellDateStr);
    const isToday = dayNum === currentProtocolDay;
    const isPast = dayNum < currentProtocolDay;
    const isFuture = dayNum > currentProtocolDay;

    gridCells.push({
      dayNum,
      dateStr: cellDateStr,
      isCompleted,
      isToday,
      isPast,
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
            title={`Day ${cell.dayNum} (${cell.dateStr}): ${
              cell.isCompleted ? 'COMPLETED' : cell.isToday ? 'TODAY (ACTIVE)' : cell.isFuture ? 'FUTURE' : 'MISSED'
            }`}
            className={`h-9 rounded flex flex-col items-center justify-center text-[10px] font-mono transition-all ${
              cell.isToday
                ? cell.isCompleted
                  ? 'bg-green-cyber text-obsidian font-black shadow-hud-glow border-2 border-frost-white'
                  : 'bg-cyan-hud/20 text-cyan-hud font-black border-2 border-cyan-hud shadow-hud-glow animate-pulse'
                : cell.isCompleted
                ? 'bg-cyan-hud text-obsidian font-bold shadow-hud-glow'
                : cell.isFuture
                ? 'bg-deck-light/30 border border-cyan-hud/5 text-silver-tactical/30'
                : 'bg-deck-light border border-cyan-hud/15 text-silver-tactical/60'
            }`}
          >
            <span className="text-[9px] opacity-60">DAY</span>
            <span className="font-extrabold text-[11px]">{cell.dayNum}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center text-[11px] font-mono text-silver-tactical pt-3 border-t border-cyan-hud/10">
        <span>START DATE: {startDateStr} (DAY 1)</span>
        <span className="text-cyan-hud font-bold">CURRENT PROTOCOL STATUS: DAY {currentProtocolDay} / 90</span>
        <span>TARGET: DAY 90 APEX</span>
      </div>
    </div>
  );
}
