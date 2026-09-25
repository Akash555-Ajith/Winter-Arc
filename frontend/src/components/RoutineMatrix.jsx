import React, { useState } from 'react';
import {
  CheckSquare, Square, Plus, Trash2, ShieldAlert, Award,
  RotateCcw, ChevronLeft, ChevronRight, Calendar, Sparkles
} from 'lucide-react';

export default function RoutineMatrix({
  tasks,
  logs,
  selectedDate,
  onSelectDate,
  onToggleTask,
  onCreateTask,
  onDeleteTask,
  onResetDailyChecklist
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [category, setCategory] = useState('Fitness');

  const logMap = (logs || []).reduce((acc, log) => {
    acc[log.task_id] = log.completed === 1;
    return acc;
  }, {});

  const completedCount = tasks.filter((t) => logMap[t.id]).length;
  const totalCount = tasks.length;
  const isPerfectDay = completedCount === totalCount && totalCount > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName.trim()) {
      onCreateTask(taskName.trim(), category);
      setTaskName('');
      setShowAddModal(false);
    }
  };

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    onSelectDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    onSelectDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    onSelectDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="bg-deck hud-border rounded-xl p-5 mb-6">
      {/* Date Navigation & Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-cyan-hud/15 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-hud" />
          <span className="text-silver-tactical uppercase">LOGGING DATE:</span>
          <button
            onClick={handlePrevDay}
            className="p-1 bg-deck-light border border-cyan-hud/30 hover:bg-cyan-hud/20 text-cyan-hud rounded"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onSelectDate(e.target.value)}
            className="bg-deck-light border border-cyan-hud/40 rounded px-2.5 py-1 text-frost-white font-mono text-xs focus:outline-none focus:border-cyan-hud"
          />

          <button
            onClick={handleNextDay}
            className="p-1 bg-deck-light border border-cyan-hud/30 hover:bg-cyan-hud/20 text-cyan-hud rounded"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {selectedDate !== new Date().toISOString().split('T')[0] && (
            <button
              onClick={handleToday}
              className="px-2.5 py-1 bg-cyan-hud/15 border border-cyan-hud/40 text-cyan-hud hover:bg-cyan-hud/30 rounded font-bold transition-all text-[11px]"
            >
              TODAY
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {totalCount > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Reset checkmarks for today? Your XP, Level & Streaks will remain intact on the progress bar!")) {
                  onResetDailyChecklist(selectedDate);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-deck-light border border-cyan-hud/30 hover:bg-cyan-hud/20 text-silver-tactical hover:text-cyan-hud rounded text-xs font-bold transition-all"
              title="Uncheck today's tasks to complete them again without resetting XP"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-hud" />
              <span>RESET DAILY CHECKMARKS</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-hud hover:bg-cyan-electric text-obsidian rounded text-xs font-black transition-all shadow-hud-glow"
          >
            <Plus className="w-4 h-4" />
            <span>ADD HABIT</span>
          </button>
        </div>
      </div>

      {/* Matrix Header Title & Completion Count */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-cyan-hud/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-hud">
            <ShieldAlert className="w-3.5 h-3.5" />
            PROTOCOL STRICT-01 • DAILY ZERO-TOLERANCE CHECK
          </div>
          <h2 className="text-xl font-bold font-mono text-frost-white uppercase tracking-wider">
            NON-NEGOTIABLE ROUTINE MATRIX
          </h2>
        </div>

        <div className="text-right font-mono">
          <div className="text-[10px] text-silver-tactical uppercase">STRIKE COMPLETION</div>
          <div className="text-xl font-extrabold text-cyan-hud">
            {completedCount} / {totalCount} <span className="text-xs text-silver-tactical">DONE</span>
          </div>
        </div>
      </div>

      {/* Perfect Day Completion Banner */}
      {isPerfectDay && (
        <div className="mb-4 p-4 bg-gradient-to-r from-green-cyber/20 via-cyan-hud/15 to-gold-xp/20 border border-green-cyber/50 rounded-lg flex flex-wrap items-center justify-between gap-3 animate-fade-in shadow-hud-glow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-cyber text-obsidian rounded-lg font-black text-lg">
              <Sparkles className="w-5 h-5 fill-obsidian" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-green-cyber uppercase tracking-wider">
                100% PERFECT DAY PROTOCOL CLEARED! (+25 BONUS XP)
              </div>
              <div className="text-[11px] font-sans text-silver-tactical">
                All daily tasks completed! Your level & EXP bar are saved. Ready to complete tasks again for the next day?
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => {
                onResetDailyChecklist(selectedDate);
              }}
              className="px-3 py-1.5 bg-green-cyber text-obsidian font-bold rounded hover:bg-cyan-hud transition-all shadow-md"
            >
              ↻ RESET CHECKLIST (NEW DAY)
            </button>
            <button
              onClick={handleNextDay}
              className="px-3 py-1.5 bg-deck-light border border-cyan-hud/40 text-cyan-hud font-bold rounded hover:bg-cyan-hud/20 transition-all"
            >
              NEXT DAY ►
            </button>
          </div>
        </div>
      )}

      {/* Routine Cards List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-cyan-hud/20 rounded-lg bg-deck-light/40">
            <div className="text-cyan-hud font-mono text-sm font-bold mb-1">
              NO HABITS OR TASKS FOUND
            </div>
            <div className="text-silver-tactical text-xs font-mono mb-4">
              Click "+ ADD HABIT" above to initialize your daily routines!
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-cyan-hud hover:bg-cyan-electric text-obsidian font-mono font-bold text-xs rounded transition-all shadow-hud-glow"
            >
              ⊕ ADD FIRST HABIT
            </button>
          </div>
        ) : (
          tasks.map((task) => {
            const isCompleted = !!logMap[task.id];
            return (
              <div
                key={task.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  isCompleted
                    ? 'bg-cyan-hud/5 border-green-cyber/40'
                    : 'bg-deck-light border-cyan-hud/15 hover:border-cyan-hud/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onToggleTask(task.id, selectedDate)}
                    className="text-cyan-hud hover:text-green-cyber transition-colors focus:outline-none cursor-pointer"
                  >
                    {isCompleted ? (
                      <CheckSquare className="w-6 h-6 text-green-cyber fill-green-cyber/20" />
                    ) : (
                      <Square className="w-6 h-6 text-cyan-hud/60" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-deck text-cyan-hud border border-cyan-hud/20">
                        {task.category}
                      </span>
                      <h3
                        className={`text-sm font-semibold font-sans ${
                          isCompleted ? 'line-through text-silver-tactical' : 'text-frost-white'
                        }`}
                      >
                        {task.name}
                      </h3>
                    </div>

                    {task.current_streak > 0 && (
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono text-gold-xp">
                        <Award className="w-3 h-3" />
                        <span>STREAK: {task.current_streak} DAYS</span>
                        <span className="text-silver-tactical text-[10px]">(BEST: {task.longest_streak})</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-[10px] font-mono font-bold rounded uppercase tracking-wider ${
                      isCompleted
                        ? 'bg-green-cyber/15 text-green-cyber border border-green-cyber/40'
                        : 'bg-cyan-hud/10 text-cyan-hud border border-cyan-hud/30'
                    }`}
                  >
                    {isCompleted ? 'CLEARED' : 'ENGAGED'}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete "${task.name}"?`)) {
                        onDeleteTask(task.id);
                      }
                    }}
                    className="text-silver-tactical hover:text-red-400 hover:bg-red-500/10 transition-all p-1.5 rounded cursor-pointer"
                    title="Delete Task"
                    aria-label={`Delete task ${task.name}`}
                  >
                    <Trash2 className="w-4 h-4 text-silver-tactical hover:text-red-400" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-deck hud-border-glow rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold font-mono text-cyan-hud mb-4 uppercase">
              NEW PROTOCOL INITIALIZATION
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-silver-tactical mb-1 uppercase">
                  Routine Name / Goal
                </label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="e.g. Cold Shower / 10k Steps / 2h Deep Work"
                  className="w-full bg-deck-light border border-cyan-hud/30 rounded px-3 py-2 text-sm text-frost-white font-mono focus:outline-none focus:border-cyan-hud"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-silver-tactical mb-1 uppercase">
                  Category Tag
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-deck-light border border-cyan-hud/30 rounded px-3 py-2 text-sm text-frost-white font-mono focus:outline-none focus:border-cyan-hud"
                >
                  <option value="Fitness">Fitness</option>
                  <option value="Mindset">Mindset</option>
                  <option value="Discipline">Discipline</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-cyan-hud/15">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-deck-light hover:bg-silver-tactical/20 text-silver-tactical rounded font-mono text-xs font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-hud hover:bg-cyan-electric text-obsidian rounded font-mono text-xs font-black shadow-hud-glow"
                >
                  INITIALIZE PROTOCOL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
