import React, { useState, useEffect } from 'react';
import {
  fetchTasks, createTask, deleteTask,
  fetchLogs, toggleTaskLog, resetDateLogs,
  fetchWeightEntries, addWeightEntry, deleteWeightEntry,
  fetchPhotos, uploadPhoto, deletePhoto,
  fetchUserProgress
} from './services/api';

import HeaderHud from './components/HeaderHud';
import RoutineMatrix from './components/RoutineMatrix';
import HeatmapGrid from './components/HeatmapGrid';
import WeightTracker from './components/WeightTracker';
import StreakPage from './components/StreakPage';
import PhotoGallery from './components/PhotoGallery';
import BadgesGrid from './components/BadgesGrid';
import RecapReport from './components/RecapReport';
import LevelUpModal from './components/LevelUpModal';
import SettingsModal from './components/SettingsModal';

import {
  LayoutDashboard, Flame, Dumbbell, Camera, ShieldCheck,
  BarChart3, Award, Settings, UserCheck
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('command');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Data states
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [weightEntries, setWeightEntries] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [progress, setProgress] = useState(null);

  // Modal states
  const [levelUpLevel, setLevelUpLevel] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadAllData();
  }, [selectedDate]);

  const loadAllData = async () => {
    try {
      const [tList, lList, wList, pList, pData] = await Promise.all([
        fetchTasks(),
        fetchLogs(), // Fetch all historical logs across all dates
        fetchWeightEntries(),
        fetchPhotos(),
        fetchUserProgress(),
      ]);
      setTasks(tList);
      setLogs(lList);
      setWeightEntries(wList);
      setPhotos(pList);
      setProgress(pData);
    } catch (e) {
      console.error('Data load error:', e);
    }
  };

  const handleToggleTask = async (taskId, date) => {
    try {
      const res = await toggleTaskLog(taskId, date);
      if (res.level_up) {
        setLevelUpLevel(res.new_level);
      }
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTask = async (name, category) => {
    try {
      await createTask(name, category);
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetDailyChecklist = async (dateToReset = selectedDate) => {
    try {
      await resetDateLogs(dateToReset);
      await loadAllData();
    } catch (e) {
      console.error('Reset daily checklist error:', e);
    }
  };

  const handleAddWeight = async (date, weightKg) => {
    try {
      await addWeightEntry(date, weightKg);
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteWeight = async (id) => {
    try {
      await deleteWeightEntry(id);
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadPhoto = async (date, imageData, notes) => {
    try {
      await uploadPhoto(date, imageData, notes);
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePhoto = async (id) => {
    try {
      await deletePhoto(id);
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex min-h-screen bg-obsidian text-frost-white font-mono">
      {/* Tactical Left Sidebar Navigation */}
      <aside className="w-64 bg-deck border-r border-cyan-hud/15 flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-cyan-hud/15">
            <div className="flex items-center gap-2 text-cyan-hud font-bold text-lg tracking-wider">
              <span className="text-xl">▲</span>
              <span>WINTER ARC</span>
            </div>
            <div className="text-[10px] text-silver-tactical tracking-widest uppercase">TACTICAL OPS HUD</div>

            {/* Quick Status Button */}
            <div className="mt-4 p-2.5 bg-deck-light border border-cyan-hud/20 rounded-lg">
              <div className="flex justify-between text-[10px] text-silver-tactical mb-1 font-mono">
                <span>ARC PHASE 01</span>
                <span className="text-cyan-hud font-bold">ACTIVE</span>
              </div>
              <div className="text-xs font-bold text-frost-white mb-2">DAY 42 / 90 (46.7%)</div>
              <button
                onClick={() => setActiveTab('command')}
                aria-label="Log Protocol"
                className="w-full py-1.5 bg-cyan-hud hover:bg-cyan-electric text-obsidian font-mono font-bold text-xs rounded transition-all shadow-hud-glow"
              >
                ⊕ LOG PROTOCOL
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 font-mono text-xs">
            <div className="text-[10px] text-silver-tactical px-3 py-1 uppercase tracking-widest font-bold">
              NAVIGATION PROTOCOLS
            </div>

            <button
              onClick={() => setActiveTab('command')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all ${
                activeTab === 'command'
                  ? 'bg-cyan-hud/15 text-cyan-hud font-bold border-l-2 border-cyan-hud'
                  : 'text-silver-tactical hover:text-frost-white hover:bg-deck-light'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>COMMAND CENTER</span>
            </button>

            <button
              onClick={() => setActiveTab('streak')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all ${
                activeTab === 'streak'
                  ? 'bg-cyan-hud/15 text-cyan-hud font-bold border-l-2 border-cyan-hud'
                  : 'text-silver-tactical hover:text-frost-white hover:bg-deck-light'
              }`}
            >
              <Flame className="w-4 h-4 text-gold-xp" />
              <span>STREAK PROTOCOL</span>
            </button>

            <button
              onClick={() => setActiveTab('training')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all ${
                activeTab === 'training'
                  ? 'bg-cyan-hud/15 text-cyan-hud font-bold border-l-2 border-cyan-hud'
                  : 'text-silver-tactical hover:text-frost-white hover:bg-deck-light'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>TRAINING & GYM</span>
            </button>

            <button
              onClick={() => setActiveTab('photos')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all ${
                activeTab === 'photos'
                  ? 'bg-cyan-hud/15 text-cyan-hud font-bold border-l-2 border-cyan-hud'
                  : 'text-silver-tactical hover:text-frost-white hover:bg-deck-light'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>TRANSFORMATION LOG</span>
            </button>

            <button
              onClick={() => setActiveTab('discipline')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all ${
                activeTab === 'discipline'
                  ? 'bg-cyan-hud/15 text-cyan-hud font-bold border-l-2 border-cyan-hud'
                  : 'text-silver-tactical hover:text-frost-white hover:bg-deck-light'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>DISCIPLINE & WORK</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all ${
                activeTab === 'analytics'
                  ? 'bg-cyan-hud/15 text-cyan-hud font-bold border-l-2 border-cyan-hud'
                  : 'text-silver-tactical hover:text-frost-white hover:bg-deck-light'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>ARC ANALYTICS</span>
            </button>

            <button
              onClick={() => setActiveTab('badges')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all ${
                activeTab === 'badges'
                  ? 'bg-cyan-hud/15 text-cyan-hud font-bold border-l-2 border-cyan-hud'
                  : 'text-silver-tactical hover:text-frost-white hover:bg-deck-light'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>HONOR CODES</span>
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-silver-tactical hover:text-frost-white hover:bg-deck-light transition-all"
            >
              <Settings className="w-4 h-4" />
              <span>SETTINGS & BACKUP</span>
            </button>
          </nav>
        </div>

        {/* Bottom Operator Widget */}
        <div className="p-4 border-t border-cyan-hud/15">
          <div className="flex items-center gap-3 bg-deck-light p-2.5 rounded-lg border border-cyan-hud/20">
            <div className="w-8 h-8 rounded bg-cyan-hud/20 border border-cyan-hud/40 flex items-center justify-center text-cyan-hud">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-frost-white truncate uppercase">
                {progress?.user_name || 'AKASH AJITH'}
              </div>
              <div className="text-[10px] text-cyan-hud font-mono truncate">
                TITAN PROTOCOL | LVL {progress?.current_level || 1}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Mobile Top Header */}
        <div className="flex md:hidden items-center justify-between pb-4 mb-4 border-b border-cyan-hud/15">
          <div className="flex items-center gap-2 text-cyan-hud font-bold text-base">
            <span>▲</span>
            <span>WINTER ARC TACTICAL</span>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            aria-label="Settings and Backup"
            className="p-2 text-silver-tactical hover:text-cyan-hud"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Tab View Switching */}
        {activeTab === 'command' && (
          <>
            <HeaderHud progress={progress} />

            <RoutineMatrix
              tasks={tasks}
              logs={(logs || []).filter((l) => l.date === selectedDate)}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onToggleTask={handleToggleTask}
              onCreateTask={handleCreateTask}
              onDeleteTask={handleDeleteTask}
              onResetDailyChecklist={handleResetDailyChecklist}
            />
            <HeatmapGrid logs={logs} tasks={tasks} />
          </>
        )}

        {activeTab === 'streak' && (
          <StreakPage progress={progress} tasks={tasks} logs={logs} />
        )}

        {activeTab === 'training' && (
          <WeightTracker
            entries={weightEntries}
            onAddWeight={handleAddWeight}
            onDeleteWeight={handleDeleteWeight}
          />
        )}

        {activeTab === 'photos' && (
          <PhotoGallery
            photos={photos}
            onUploadPhoto={handleUploadPhoto}
            onDeletePhoto={handleDeletePhoto}
          />
        )}

        {activeTab === 'discipline' && (
          <RoutineMatrix
            tasks={tasks}
            logs={(logs || []).filter((l) => l.date === selectedDate)}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onToggleTask={handleToggleTask}
            onCreateTask={handleCreateTask}
            onDeleteTask={handleDeleteTask}
            onResetDailyChecklist={handleResetDailyChecklist}
          />
        )}

        {activeTab === 'analytics' && <RecapReport />}

        {activeTab === 'badges' && (
          <BadgesGrid unlockedBadges={progress?.badges_unlocked || []} />
        )}
      </main>

      {/* Level Up Celebration Modal */}
      {levelUpLevel && (
        <LevelUpModal
          newLevel={levelUpLevel}
          onClose={() => setLevelUpLevel(null)}
        />
      )}

      {/* Settings & Backup Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onRefreshData={loadAllData}
      />
    </div>
  );
}
