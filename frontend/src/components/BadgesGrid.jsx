import React from 'react';
import { ShieldCheck, Lock, Award } from 'lucide-react';

const BADGES_CATALOG = [
  { id: 'first_task', title: 'IRON WILL PROTOCOL', desc: '30-day perfect adherence streak unlocked.', icon: '❄️' },
  { id: 'streak_7', title: 'STRIKE FORCE 7', desc: 'Maintain 7 consecutive days of discipline.', icon: '🔥' },
  { id: 'streak_30', title: 'UNSTOPPABLE APEX', desc: '30-day unbroken tactical routine execution.', icon: '🏆' },
  { id: 'perfect_week', title: 'PERFECT WEEK MATRIX', desc: '100% task clearance 7 days straight.', icon: '⭐' },
  { id: 'level_10', title: 'CENTURY TITAN', desc: 'Reach Level 10 discipline benchmark.', icon: '🏔️' },
  { id: 'weight_10', title: 'TRACKING TITAN', desc: 'Log 10 kinetic telemetry weight entries.', icon: '⚖️' },
  { id: 'xp_1000', title: 'WINTER CHAMPION', desc: 'Accumulate 1,000 total protocol XP.', icon: '🌨️' },
];

export default function BadgesGrid({ unlockedBadges = [] }) {
  const unlockedSet = new Set(unlockedBadges);

  return (
    <div className="bg-deck hud-border rounded-xl p-5 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-cyan-hud/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-hud">
            <Award className="w-3.5 h-3.5" />
            HONOR CODES • UNLOCKED MILESTONES
          </div>
          <h2 className="text-xl font-bold font-mono text-frost-white uppercase tracking-wider">
            ACHIEVEMENT & BADGE MATRIX
          </h2>
        </div>

        <div className="text-xs font-mono text-silver-tactical">
          UNLOCKED: <strong className="text-cyan-hud">{unlockedSet.size}</strong> / {BADGES_CATALOG.length}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BADGES_CATALOG.map((badge) => {
          const isUnlocked = unlockedSet.has(badge.id);
          return (
            <div
              key={badge.id}
              className={`p-4 rounded-lg border transition-all ${
                isUnlocked
                  ? 'bg-deck-light border-gold-xp/40 shadow-gold-glow'
                  : 'bg-deck-light/30 border-cyan-hud/10 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded text-2xl flex items-center justify-center ${
                    isUnlocked ? 'bg-gold-xp/15 text-gold-xp' : 'bg-deck text-silver-tactical'
                  }`}
                >
                  {isUnlocked ? badge.icon : <Lock className="w-6 h-6 text-silver-tactical/50" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold font-mono text-frost-white uppercase tracking-wide">
                      {badge.title}
                    </h3>
                    {isUnlocked && (
                      <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-green-cyber/20 text-green-cyber rounded">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-silver-tactical mt-1 leading-snug">{badge.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
