import React from 'react';
import { Activity } from 'lucide-react';

export default function HeatmapGrid({ logs }) {
  const daysToShow = 84; // 12 columns x 7 rows
  const now = new Date();
  
  // Format log dates into a set for O(1) lookup
  const completedDates = new Set(
    (logs || [])
      .filter((l) => l.completed === 1)
      .map((l) => l.date)
  );

  // Generate date array
  const dateList = [];
  for (let i = daysToShow - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    dateList.push({
      dateStr,
      dayNumber: d.getDate(),
      month: d.toLocaleString('default', { month: 'short' }),
      isCompleted: completedDates.has(dateStr),
      isToday: i === 0,
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
            ARC CONSISTENCY HEATMAP
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-silver-tactical">AUSTERITY SCALE:</span>
          <div className="flex gap-1 items-center">
            <div className="w-3 h-3 bg-deck-light border border-cyan-hud/20 rounded-sm"></div>
            <div className="w-3 h-3 bg-cyan-hud/30 rounded-sm"></div>
            <div className="w-3 h-3 bg-cyan-hud rounded-sm shadow-hud-glow"></div>
            <span className="text-cyan-hud font-bold ml-1">MAX 100%</span>
          </div>
        </div>
      </div>

      {/* Heatmap 84-Day Grid (12 Columns x 7 Rows) */}
      <div className="grid grid-cols-12 gap-2 my-2">
        {dateList.map((item, idx) => (
          <div
            key={idx}
            title={`${item.dateStr}: ${item.isCompleted ? 'COMPLETED' : 'MISSED'}`}
            className={`h-8 rounded-sm flex items-center justify-center text-[10px] font-mono transition-all cursor-pointer ${
              item.isCompleted
                ? item.isToday
                  ? 'bg-green-cyber text-obsidian font-bold shadow-hud-glow border border-frost-white'
                  : 'bg-cyan-hud text-obsidian font-semibold shadow-hud-glow'
                : 'bg-deck-light border border-cyan-hud/10 text-silver-tactical/50 hover:border-cyan-hud/40'
            }`}
          >
            {item.dayNumber}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center text-[11px] font-mono text-silver-tactical pt-3 border-t border-cyan-hud/10">
        <span>START: OCT 01 (CYCLE 01)</span>
        <span className="text-cyan-hud font-bold">CURRENT STREAK: UNBROKEN</span>
        <span>TARGET: DEC 31 / JAN 01 APEX</span>
      </div>
    </div>
  );
}
