import React, { useState, useEffect } from 'react';
import { fetchRecap } from '../services/api';
import { Award, FileText, CheckCircle, TrendingUp } from 'lucide-react';

export default function RecapReport() {
  const [days, setDays] = useState(7);
  const [recapData, setRecapData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecap();
  }, [days]);

  const loadRecap = async () => {
    setLoading(true);
    try {
      const data = await fetchRecap(days);
      setRecapData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!recapData && loading) {
    return <div className="text-center py-8 text-xs font-mono text-silver-tactical">LOADING RECAP TELEMETRY...</div>;
  }

  return (
    <div className="bg-deck hud-border rounded-xl p-5 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-cyan-hud/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-hud">
            <FileText className="w-3.5 h-3.5" />
            PERIODIC DEBRIEF • WINTER ARC REPORT CARD
          </div>
          <h2 className="text-xl font-bold font-mono text-frost-white uppercase tracking-wider">
            RECAP & PERFORMANCE REPORT
          </h2>
        </div>

        <div className="flex bg-deck-light border border-cyan-hud/20 rounded p-0.5 text-xs font-mono">
          {[7, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 rounded transition-all ${
                days === d ? 'bg-cyan-hud text-obsidian font-bold' : 'text-silver-tactical hover:text-frost-white'
              }`}
            >
              PAST {d} DAYS
            </button>
          ))}
        </div>
      </div>

      {recapData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Main Grade Card */}
          <div className="bg-deck-light hud-border-glow rounded-xl p-6 text-center">
            <div className="text-xs font-mono text-silver-tactical uppercase tracking-wider mb-2">
              WINTER ARC PERFORMANCE GRADE
            </div>
            <div className="text-5xl font-black font-mono text-gold-xp mb-2">{recapData.grade}</div>
            <div className="text-sm font-bold font-mono text-cyan-hud">
              {recapData.completion_rate}% Habit Completion
            </div>
          </div>

          {/* Stats Grid */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-deck-light border border-cyan-hud/15 rounded-lg p-4">
              <div className="flex items-center gap-2 text-xs font-mono text-silver-tactical uppercase mb-1">
                <CheckCircle className="w-4 h-4 text-green-cyber" />
                <span>CLEARED ROUTINES</span>
              </div>
              <div className="text-xl font-bold font-mono text-frost-white">
                {recapData.actual_completed} / {recapData.expected_total}
              </div>
              <div className="text-[11px] text-silver-tactical mt-1">
                Total completed in past {days} days
              </div>
            </div>

            <div className="bg-deck-light border border-cyan-hud/15 rounded-lg p-4">
              <div className="flex items-center gap-2 text-xs font-mono text-silver-tactical uppercase mb-1">
                <TrendingUp className="w-4 h-4 text-cyan-hud" />
                <span>KINETIC WEIGHT CHANGE</span>
              </div>
              <div className="text-xl font-bold font-mono text-frost-white">
                {recapData.weight_change >= 0 ? '+' : ''}
                {recapData.weight_change} kg
              </div>
              <div className="text-[11px] text-silver-tactical mt-1">
                Net change in past {days} days
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
