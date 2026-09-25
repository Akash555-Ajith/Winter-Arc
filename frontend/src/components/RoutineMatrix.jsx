import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Trash2, ShieldAlert, Award } from 'lucide-react';

export default function RoutineMatrix({ tasks, logs, selectedDate, onToggleTask, onCreateTask, onDeleteTask }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [category, setCategory] = useState('Fitness');

  const logMap = (logs || []).reduce((acc, log) => {
    acc[log.task_id] = log.completed === 1;
    return acc;
  }, {});

  const completedCount = tasks.filter((t) => logMap[t.id]).length;
  const totalCount = tasks.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName.trim()) {
      onCreateTask(taskName.trim(), category);
      setTaskName('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="bg-deck hud-border rounded-xl p-5 mb-6">
      {/* Matrix Header Bar */}
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

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-mono text-silver-tactical uppercase">STRIKE COMPLETION</div>
            <div className="text-xl font-extrabold font-mono text-cyan-hud">
              {completedCount} / {totalCount} <span className="text-xs text-silver-tactical">DONE</span>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-cyan-hud/10 hover:bg-cyan-hud/20 border border-cyan-hud/40 text-cyan-hud rounded font-mono text-xs font-bold transition-all"
          >
            <Plus className="w-4 h-4" />
            ADD HABIT
          </button>
        </div>
      </div>

      {/* Routine Cards List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-silver-tactical text-xs font-mono">
            NO ROUTINE PROTOCOLS SET. CLICK "ADD HABIT" TO INITIALIZE MATRIX.
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
                    className="text-cyan-hud hover:text-green-cyber transition-colors focus:outline-none"
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
                    onClick={() => onDeleteTask(task.id)}
                    className="text-silver-tactical hover:text-danger-cyber transition-colors p-1"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
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
