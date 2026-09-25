import React, { useState } from 'react';
import { exportDataJson, importDataJson } from '../services/api';
import { Settings, Download, Upload, Bell, X, Check } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, onRefreshData }) {
  const [reminderTime, setReminderTime] = useState('20:00');
  const [reminderSaved, setReminderSaved] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      const data = await exportDataJson();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `winter_arc_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMsg('BACKUP EXPORTED SUCCESSFULLY! 💾');
    } catch (e) {
      console.error(e);
      setStatusMsg('EXPORT FAILED: ' + e.message);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const backupObj = JSON.parse(text);
      await importDataJson(backupObj);
      setStatusMsg('DATA RESTORED SUCCESSFULLY! 🔄');
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
      setStatusMsg('IMPORT FAILED: ' + err.message);
    }
  };

  const handleSaveReminder = () => {
    setReminderSaved(true);
    setStatusMsg(`REMINDER SCHEDULED FOR ${reminderTime} ⏰`);
    setTimeout(() => setReminderSaved(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-obsidian/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-deck hud-border-glow rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-silver-tactical hover:text-frost-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-hud mb-1">
          <Settings className="w-4 h-4" />
          SYSTEM CONFIGURATION & BACKUP
        </div>

        <h3 className="text-xl font-bold font-mono text-frost-white uppercase tracking-wider mb-6">
          SETTINGS & DATA MANAGEMENT
        </h3>

        {statusMsg && (
          <div className="mb-4 p-3 bg-cyan-hud/10 border border-cyan-hud/40 rounded text-xs font-mono text-cyan-hud flex items-center gap-2">
            <Check className="w-4 h-4 text-green-cyber" />
            <span>{statusMsg}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Daily Reminder */}
          <div className="p-4 bg-deck-light border border-cyan-hud/15 rounded-lg">
            <h4 className="text-sm font-bold font-mono text-frost-white uppercase mb-2 flex items-center gap-2">
              <Bell className="w-4 h-4 text-gold-xp" />
              DAILY EVENING REMINDER
            </h4>
            <p className="text-xs text-silver-tactical mb-3">
              Set local check-in time prompt before the day ends.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="bg-deck border border-cyan-hud/30 rounded px-3 py-1.5 text-xs text-frost-white font-mono focus:outline-none focus:border-cyan-hud"
              />
              <button
                onClick={handleSaveReminder}
                className="px-3 py-1.5 bg-cyan-hud hover:bg-cyan-electric text-obsidian rounded font-mono text-xs font-bold"
              >
                SAVE REMINDER
              </button>
            </div>
          </div>

          {/* Backup & Restore */}
          <div className="p-4 bg-deck-light border border-cyan-hud/15 rounded-lg">
            <h4 className="text-sm font-bold font-mono text-frost-white uppercase mb-2">
              DATA BACKUP & RESTORE
            </h4>
            <p className="text-xs text-silver-tactical mb-4">
              Export all tasks, logs, weight telemetry, and XP progress to a JSON backup file or restore data.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-cyber/15 border border-green-cyber/40 text-green-cyber hover:bg-green-cyber/25 rounded font-mono text-xs font-bold transition-all"
              >
                <Download className="w-4 h-4" />
                EXPORT JSON BACKUP
              </button>

              <label className="flex items-center gap-2 px-4 py-2 bg-gold-xp/15 border border-gold-xp/40 text-gold-xp hover:bg-gold-xp/25 rounded font-mono text-xs font-bold transition-all cursor-pointer">
                <Upload className="w-4 h-4" />
                IMPORT JSON FILE
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>
          </div>

          {/* Hard Reset System */}
          <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-lg">
            <h4 className="text-sm font-bold font-mono text-red-400 uppercase mb-2 flex items-center gap-2">
              <span>⚠️</span> RESET PROTOCOL & DATA WIPE
            </h4>
            <p className="text-xs text-silver-tactical mb-4">
              Purger all tasks, daily logs, weight entries, and reset progress for <strong className="text-frost-white">Akash Ajith</strong>.
            </p>

            <button
              onClick={async () => {
                if (window.confirm("Are you sure you want to remove all tasks and reset everything for Akash Ajith?")) {
                  try {
                    const { resetAllData } = await import('../services/api');
                    await resetAllData();
                    setStatusMsg("SYSTEM RESET COMPLETE! OPERATOR: AKASH AJITH");
                    if (onRefreshData) onRefreshData();
                  } catch (err) {
                    setStatusMsg("RESET FAILED: " + err.message);
                  }
                }
              }}
              className="px-4 py-2 bg-red-500/20 border border-red-500/50 hover:bg-red-500/30 text-red-400 font-mono text-xs font-bold rounded transition-all"
            >
              ⊕ RESET ALL DATA (START FRESH)
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-cyan-hud/15 text-center text-[10px] font-mono text-silver-tactical">
          WINTER ARC TACTICAL WEB v1.0.0 • FASTAPI + REACT + TAILWIND
        </div>
      </div>
    </div>
  );
}
