import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, LabelList } from 'recharts';
import { Scale, TrendingUp, Plus, Trash2, Calendar } from 'lucide-react';

export default function WeightTracker({ entries, onAddWeight, onDeleteWeight }) {
  const [unit, setUnit] = useState('kg'); // 'kg' or 'lbs'
  const [daysFilter, setDaysFilter] = useState(30);
  const [weightInput, setWeightInput] = useState('');
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);

  // Convert weights based on unit preference
  const convertWeight = (valKg) => {
    return unit === 'lbs' ? (valKg * 2.20462).toFixed(1) : valKg.toFixed(1);
  };

  // Filter entries based on days filter
  const now = new Date();
  const filteredEntries = entries.filter((e) => {
    if (daysFilter === 0) return true; // All
    const d = new Date(e.date);
    const diffDays = (now - d) / (1000 * 60 * 60 * 24);
    return diffDays <= daysFilter;
  });

  // Recharts formatted data
  const chartData = filteredEntries.map((e) => ({
    date: e.date.substring(5), // MM-DD
    fullDate: e.date,
    weight: parseFloat(convertWeight(e.weight_kg)),
    labelStr: `${convertWeight(e.weight_kg)} ${unit}`,
    rawKg: e.weight_kg,
    id: e.id,
  }));

  // Net change
  let netChange = 0;
  if (entries.length >= 2) {
    const first = entries[0].weight_kg;
    const last = entries[entries.length - 1].weight_kg;
    netChange = last - first;
  }

  const handleAdd = (e) => {
    e.preventDefault();
    const val = parseFloat(weightInput);
    if (!isNaN(val) && val > 0) {
      const valKg = unit === 'lbs' ? val / 2.20462 : val;
      onAddWeight(dateInput, valKg);
      setWeightInput('');
    }
  };

  return (
    <div className="bg-deck hud-border rounded-xl p-5 mb-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-cyan-hud/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-hud">
            <Scale className="w-3.5 h-3.5" />
            CHRONO-SPLIT • VELOCITY CURVE & METRICS
          </div>
          <h2 className="text-xl font-bold font-mono text-frost-white uppercase tracking-wider">
            WEIGHT & KINETIC TELEMETRY
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Unit Toggle */}
          <button
            onClick={() => setUnit(unit === 'kg' ? 'lbs' : 'kg')}
            className="px-3 py-1.5 bg-deck-light hover:bg-cyan-hud/10 border border-cyan-hud/30 text-cyan-hud rounded font-mono text-xs font-bold transition-all"
          >
            UNIT: {unit.toUpperCase()}
          </button>

          {/* Range Filter Buttons */}
          <div className="flex bg-deck-light border border-cyan-hud/20 rounded p-0.5 text-xs font-mono">
            {[7, 30, 0].map((d) => (
              <button
                key={d}
                onClick={() => setDaysFilter(d)}
                className={`px-2.5 py-1 rounded transition-all ${
                  daysFilter === d
                    ? 'bg-cyan-hud text-obsidian font-bold'
                    : 'text-silver-tactical hover:text-frost-white'
                }`}
              >
                {d === 0 ? 'ALL' : `${d}D`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-deck-light border border-cyan-hud/15 rounded-lg p-4">
          <div className="text-xs font-mono text-silver-tactical uppercase">CURRENT WEIGHT</div>
          <div className="text-2xl font-extrabold font-mono text-cyan-hud">
            {entries.length > 0
              ? `${convertWeight(entries[entries.length - 1].weight_kg)} ${unit}`
              : '--'}
          </div>
        </div>

        <div className="bg-deck-light border border-cyan-hud/15 rounded-lg p-4">
          <div className="text-xs font-mono text-silver-tactical uppercase">NET TELEMETRY CHANGE</div>
          <div className="text-2xl font-extrabold font-mono text-gold-xp flex items-center gap-1">
            <TrendingUp className="w-5 h-5 text-gold-xp" />
            {entries.length >= 2
              ? `${netChange >= 0 ? '+' : ''}${convertWeight(netChange)} ${unit}`
              : '--'}
          </div>
        </div>

        <div className="bg-deck-light border border-cyan-hud/15 rounded-lg p-4">
          <div className="text-xs font-mono text-silver-tactical uppercase">TOTAL LOGGED ENTRIES</div>
          <div className="text-2xl font-extrabold font-mono text-green-cyber">
            {entries.length} SESSIONS
          </div>
        </div>
      </div>

      {/* Recharts Velocity Line Chart with On-Point Weight Labels */}
      <div className="h-72 w-full mb-6">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs font-mono text-silver-tactical">
            NO KINETIC DATA LOGGED YET. LOG YOUR WEIGHT BELOW.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 25, right: 30, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.1)" />
              <XAxis
                dataKey="date"
                stroke="#8d99ae"
                fontSize={11}
                tickLine={false}
                dy={10}
              />
              <YAxis stroke="#8d99ae" fontSize={11} domain={['auto', 'auto']} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0d121f',
                  borderColor: '#00f0ff',
                  borderRadius: '6px',
                  color: '#edf6f9',
                  fontFamily: 'monospace',
                }}
                formatter={(value) => [`${value} ${unit}`, 'Weight']}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#00f0ff"
                strokeWidth={3}
                dot={{ fill: '#00f0ff', r: 5 }}
                activeDot={{ r: 7, fill: '#ffd700', stroke: '#080c14', strokeWidth: 2 }}
              >
                {/* Display weight directly above each data point on the graph */}
                <LabelList
                  dataKey="labelStr"
                  position="top"
                  fill="#00f0ff"
                  fontSize={11}
                  fontWeight="bold"
                  offset={10}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Record Weight Form */}
      <form onSubmit={handleAdd} className="flex flex-wrap items-center gap-3 pt-4 border-t border-cyan-hud/15 mb-6">
        <div className="flex-1 min-w-[140px]">
          <input
            type="number"
            step="0.1"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            placeholder={`Log weight (${unit})...`}
            className="w-full bg-deck-light border border-cyan-hud/30 rounded px-3 py-2 text-xs text-frost-white font-mono focus:outline-none focus:border-cyan-hud"
            required
          />
        </div>

        <div className="min-w-[130px]">
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="w-full bg-deck-light border border-cyan-hud/30 rounded px-3 py-2 text-xs text-frost-white font-mono focus:outline-none focus:border-cyan-hud"
            required
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 px-4 py-2 bg-cyan-hud hover:bg-cyan-electric text-obsidian rounded font-mono text-xs font-black transition-all shadow-hud-glow"
        >
          <Plus className="w-4 h-4" />
          RECORD WEIGHT
        </button>
      </form>

      {/* Date-by-Date Weight Telemetry Cards Below Graph */}
      <div>
        <h3 className="text-xs font-mono font-bold text-silver-tactical uppercase tracking-wider mb-3 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-cyan-hud" />
          DATE-BY-DATE WEIGHT BREAKDOWN
        </h3>

        {entries.length === 0 ? (
          <div className="text-xs font-mono text-silver-tactical text-center py-4">
            NO LOGGED ENTRIES
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...entries].reverse().map((entry, idx) => {
              const displayVal = convertWeight(entry.weight_kg);

              return (
                <div
                  key={entry.id}
                  className="bg-deck-light border border-cyan-hud/15 hover:border-cyan-hud/40 rounded-lg p-3 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-hud/10 text-cyan-hud rounded border border-cyan-hud/20">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-silver-tactical">
                        {entry.date}
                      </div>
                      <div className="text-sm font-bold font-mono text-frost-white">
                        {displayVal} <span className="text-xs text-cyan-hud">{unit}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteWeight(entry.id)}
                    className="text-silver-tactical hover:text-danger-cyber p-1 transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
