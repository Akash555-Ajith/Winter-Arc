import React, { useState } from 'react';
import { Camera, Plus, Trash2, Sliders, Calendar, X } from 'lucide-react';

export default function PhotoGallery({ photos, onUploadPhoto, onDeletePhoto }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Upload state
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [imageBase64, setImageBase64] = useState('');

  // Comparison selection
  const [photoAId, setPhotoAId] = useState(photos.length > 0 ? photos[photos.length - 1]?.id : null);
  const [photoBId, setPhotoBId] = useState(photos.length > 0 ? photos[0]?.id : null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (imageBase64) {
      onUploadPhoto(selectedDate, imageBase64, notes);
      setImageBase64('');
      setNotes('');
      setShowUploadModal(false);
    }
  };

  const photoA = photos.find((p) => p.id === photoAId);
  const photoB = photos.find((p) => p.id === photoBId);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-deck hud-border rounded-xl p-6 shadow-hud-glow">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-hud mb-1">
              <Camera className="w-4 h-4" />
              PHYSICAL TELEMETRY • TRANSFORMATION LOG
            </div>
            <h2 className="text-2xl font-black font-mono text-frost-white uppercase tracking-wider mb-2">
              PHYSICAL TRANSFORMATION GALLERY
            </h2>
            <p className="text-xs text-silver-tactical max-w-2xl font-sans">
              Log progress photos for specific dates to visually inspect physical transformation, conditioning, and physique benchmarks across your Winter Arc cycle.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {photos.length >= 2 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gold-xp/15 hover:bg-gold-xp/25 border border-gold-xp/40 text-gold-xp rounded font-mono text-xs font-bold transition-all"
              >
                <Sliders className="w-4 h-4" />
                COMPARE PHOTOS
              </button>
            )}

            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-hud hover:bg-cyan-electric text-obsidian rounded font-mono text-xs font-black shadow-hud-glow transition-all"
            >
              <Plus className="w-4 h-4" />
              LOG NEW PHOTO
            </button>
          </div>
        </div>
      </div>

      {/* Photos Timeline Grid */}
      {photos.length === 0 ? (
        <div className="bg-deck hud-border rounded-xl p-12 text-center text-silver-tactical font-mono text-xs">
          NO TRANSFORMATION PHOTOS LOGGED YET. CLICK "LOG NEW PHOTO" TO START YOUR GALLERY.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-deck hud-border rounded-xl overflow-hidden group">
              <div className="relative h-64 bg-obsidian overflow-hidden">
                <img
                  src={photo.image_data}
                  alt={`Progress ${photo.date}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-obsidian/80 backdrop-blur-md px-2.5 py-1 rounded text-xs font-mono text-cyan-hud border border-cyan-hud/30 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{photo.date}</span>
                </div>

                <button
                  onClick={() => onDeletePhoto(photo.id)}
                  className="absolute top-3 right-3 bg-danger-cyber/20 hover:bg-danger-cyber text-frost-white p-2 rounded transition-colors"
                  title="Delete Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {photo.notes && (
                <div className="p-4 bg-deck-light border-t border-cyan-hud/10 text-xs font-mono text-silver-tactical">
                  {photo.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Photo Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-obsidian/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-deck hud-border-glow rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-silver-tactical hover:text-frost-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-mono text-cyan-hud uppercase mb-4">
              LOG PROGRESS PHOTO
            </h3>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-silver-tactical mb-1 uppercase">
                  Log Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-deck-light border border-cyan-hud/30 rounded px-3 py-2 text-xs text-frost-white font-mono focus:outline-none focus:border-cyan-hud"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-silver-tactical mb-1 uppercase">
                  Select Photo File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full bg-deck-light border border-cyan-hud/30 rounded px-3 py-2 text-xs text-silver-tactical font-mono focus:outline-none focus:border-cyan-hud"
                  required
                />
              </div>

              {imageBase64 && (
                <div className="h-40 bg-obsidian rounded overflow-hidden border border-cyan-hud/30">
                  <img src={imageBase64} alt="Preview" className="w-full h-full object-contain" />
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-silver-tactical mb-1 uppercase">
                  Notes / Benchmark Comments
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Day 42 physique check - 14% bodyfat..."
                  className="w-full bg-deck-light border border-cyan-hud/30 rounded px-3 py-2 text-xs text-frost-white font-mono focus:outline-none focus:border-cyan-hud h-20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-cyan-hud/15">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-deck-light text-silver-tactical rounded font-mono text-xs font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={!imageBase64}
                  className="px-4 py-2 bg-cyan-hud hover:bg-cyan-electric disabled:opacity-50 text-obsidian rounded font-mono text-xs font-black shadow-hud-glow"
                >
                  UPLOAD TO LOG
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Side-by-Side Photo Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-obsidian/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-deck hud-border-glow rounded-xl max-w-4xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-4 right-4 text-silver-tactical hover:text-frost-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-mono text-gold-xp uppercase tracking-wider mb-6 flex items-center gap-2">
              <Sliders className="w-5 h-5" />
              SIDE-BY-SIDE TRANSFORMATION COMPARISON
            </h3>

            {/* Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-mono text-cyan-hud mb-1 uppercase font-bold">
                  Photo A (Baseline / Earlier)
                </label>
                <select
                  value={photoAId || ''}
                  onChange={(e) => setPhotoAId(e.target.value)}
                  className="w-full bg-deck-light border border-cyan-hud/30 rounded px-3 py-2 text-xs text-frost-white font-mono focus:outline-none"
                >
                  {photos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.date} {p.notes ? `(${p.notes})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-gold-xp mb-1 uppercase font-bold">
                  Photo B (Latest / Target)
                </label>
                <select
                  value={photoBId || ''}
                  onChange={(e) => setPhotoBId(e.target.value)}
                  className="w-full bg-deck-light border border-gold-xp/30 rounded px-3 py-2 text-xs text-frost-white font-mono focus:outline-none"
                >
                  {photos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.date} {p.notes ? `(${p.notes})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Side-by-Side Images Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-obsidian border border-cyan-hud/30 rounded-lg overflow-hidden p-2 text-center">
                <div className="text-xs font-mono text-cyan-hud mb-2 font-bold uppercase">
                  BEFORE: {photoA ? photoA.date : 'N/A'}
                </div>
                {photoA ? (
                  <img src={photoA.image_data} alt="Before" className="h-80 w-full object-contain rounded" />
                ) : (
                  <div className="h-80 flex items-center justify-center text-xs font-mono text-silver-tactical">
                    SELECT PHOTO A
                  </div>
                )}
              </div>

              <div className="bg-obsidian border border-gold-xp/30 rounded-lg overflow-hidden p-2 text-center">
                <div className="text-xs font-mono text-gold-xp mb-2 font-bold uppercase">
                  AFTER: {photoB ? photoB.date : 'N/A'}
                </div>
                {photoB ? (
                  <img src={photoB.image_data} alt="After" className="h-80 w-full object-contain rounded" />
                ) : (
                  <div className="h-80 flex items-center justify-center text-xs font-mono text-silver-tactical">
                    SELECT PHOTO B
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
