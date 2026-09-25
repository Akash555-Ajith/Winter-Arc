import React from 'react';
import { Lock, Award } from 'lucide-react';

const BADGES_CATALOG = [
  // Streak Milestones
  { id: 'streak_1', title: '1-DAY INITIATION', desc: 'Complete a 1-day unbroken protocol streak.', icon: '⚡' },
  { id: 'streak_10', title: '10-DAY STRIKE FORCE', desc: 'Complete a 10-day unbroken protocol streak.', icon: '🔥' },
  { id: 'streak_30', title: '30-DAY IRON ADHERENCE', desc: 'Complete a 30-day unbroken protocol streak.', icon: '🏆' },
  { id: 'streak_50', title: '50-DAY HALF-WAY APEX', desc: 'Complete a 50-day unbroken protocol streak.', icon: '🏔️' },
  { id: 'streak_70', title: '70-DAY TITAN FORTITUDE', desc: 'Complete a 70-day unbroken protocol streak.', icon: '🛡️' },
  { id: 'streak_90', title: '90-DAY WINTER CHAMPION', desc: 'Complete a full 90-day unbroken Winter Arc streak.', icon: '❄️' },

  // Level Milestones
  { id: 'level_2', title: 'ASCENSION (LEVEL 2)', desc: 'Reach Level 2 discipline rank.', icon: '🌟' },
  { id: 'level_10', title: 'VETERAN (LEVEL 10)', desc: 'Reach Level 10 discipline rank.', icon: '⚔️' },
  { id: 'level_25', title: 'COMMANDER (LEVEL 25)', desc: 'Reach Level 25 discipline rank.', icon: '🎖️' },
  { id: 'level_50', title: 'WARLORD (LEVEL 50)', desc: 'Reach Level 50 discipline rank.', icon: '👑' },
  { id: 'level_75', title: 'OVERLORD (LEVEL 75)', desc: 'Reach Level 75 discipline rank.', icon: '💎' },
  { id: 'level_100', title: 'IMMORTAL TITAN (LEVEL 100)', desc: 'Reach Level 100 apex discipline rank.', icon: '🌌' },
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
