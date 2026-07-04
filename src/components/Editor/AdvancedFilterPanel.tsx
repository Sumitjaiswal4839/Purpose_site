"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Star, Clock, SlidersHorizontal, Layers, X, Settings2 } from 'lucide-react';

export type FilterState = {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  sepia: number;
};

const DEFAULT_FILTER: FilterState = { brightness: 100, contrast: 100, saturation: 100, hue: 0, blur: 0, sepia: 0 };

const PRESET_FILTERS = [
  { id: 'normal', name: 'Original', state: DEFAULT_FILTER, tags: ['normal', 'original', 'none'] },
  { id: 'vintage', name: 'Vintage', state: { ...DEFAULT_FILTER, sepia: 50, contrast: 120, brightness: 90 }, tags: ['vintage', 'retro', 'old', 'warm'] },
  { id: 'cinematic', name: 'Cinematic', state: { ...DEFAULT_FILTER, contrast: 130, brightness: 90, saturation: 120, hue: 15 }, tags: ['cinematic', 'movie', 'dramatic'] },
  { id: 'warm', name: 'Warm', state: { ...DEFAULT_FILTER, sepia: 30, saturation: 140, brightness: 105 }, tags: ['warm', 'sun', 'summer'] },
  { id: 'cool', name: 'Cool', state: { ...DEFAULT_FILTER, hue: -15, saturation: 120, brightness: 105 }, tags: ['cool', 'blue', 'winter', 'ice'] },
  { id: 'dramatic', name: 'Dramatic', state: { ...DEFAULT_FILTER, contrast: 160, brightness: 80, saturation: 130 }, tags: ['dramatic', 'dark', 'intense'] },
  { id: 'soft', name: 'Soft', state: { ...DEFAULT_FILTER, blur: 1, brightness: 110, saturation: 80 }, tags: ['soft', 'gentle', 'light'] },
  { id: 'neon', name: 'Neon', state: { ...DEFAULT_FILTER, saturation: 200, contrast: 140, hue: 45, brightness: 110 }, tags: ['neon', 'bright', 'party', 'cyberpunk'] },
  { id: 'monochrome', name: 'Monochrome', state: { ...DEFAULT_FILTER, saturation: 0, contrast: 120 }, tags: ['monochrome', 'black and white', 'bw', 'classic'] },
  { id: 'sepia', name: 'Sepia', state: { ...DEFAULT_FILTER, sepia: 100, contrast: 110 }, tags: ['sepia', 'brown', 'retro'] },
  { id: 'fade', name: 'Fade', state: { ...DEFAULT_FILTER, brightness: 110, contrast: 80 }, tags: ['fade', 'washed', 'pale'] },
  { id: 'vivid', name: 'Vivid', state: { ...DEFAULT_FILTER, saturation: 180, contrast: 120 }, tags: ['vivid', 'colorful', 'bright'] },
  { id: 'polaroid', name: 'Polaroid', state: { ...DEFAULT_FILTER, sepia: 20, contrast: 120, saturation: 130, hue: -10 }, tags: ['polaroid', 'retro', 'instant'] },
  { id: 'cyber', name: 'Cyber', state: { ...DEFAULT_FILTER, saturation: 180, hue: 90, contrast: 140 }, tags: ['cyber', 'future', 'neon', 'blue'] },
  { id: 'dreamy', name: 'Dreamy', state: { ...DEFAULT_FILTER, blur: 2, brightness: 120, saturation: 130 }, tags: ['dreamy', 'soft', 'fantasy'] },
  { id: 'gothic', name: 'Gothic', state: { ...DEFAULT_FILTER, saturation: 20, contrast: 150, brightness: 80 }, tags: ['gothic', 'dark', 'emo'] },
  { id: 'golden', name: 'Golden Hour', state: { ...DEFAULT_FILTER, sepia: 40, saturation: 140, brightness: 110, hue: -5 }, tags: ['golden', 'sunset', 'warm'] },
  { id: 'matrix', name: 'Matrix', state: { ...DEFAULT_FILTER, hue: 120, saturation: 160, contrast: 140 }, tags: ['matrix', 'green', 'hacker'] },
  { id: 'noir', name: 'Noir', state: { ...DEFAULT_FILTER, saturation: 0, contrast: 180, brightness: 90 }, tags: ['noir', 'dark', 'movie', 'bw'] },
  { id: 'pastel', name: 'Pastel', state: { ...DEFAULT_FILTER, saturation: 60, brightness: 115, contrast: 90 }, tags: ['pastel', 'soft', 'light'] },
  { id: 'forest', name: 'Forest', state: { ...DEFAULT_FILTER, saturation: 140, contrast: 110, hue: 45 }, tags: ['forest', 'green', 'nature'] }
];

interface AdvancedFilterPanelProps {
  previewImage: string | null;
  onFilterChange: (filterStyle: string, filterName: string, filterId: string) => void;
}

export function AdvancedFilterPanel({ previewImage, onFilterChange }: AdvancedFilterPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  
  const [selectedPresetId, setSelectedPresetId] = useState('normal');
  const [intensity, setIntensity] = useState(100);
  
  const [customState, setCustomState] = useState<FilterState>(DEFAULT_FILTER);
  
  const [recentFilters, setRecentFilters] = useState<string[]>([]);
  const [favoriteFilters, setFavoriteFilters] = useState<string[]>([]);
  const [showAllFilters, setShowAllFilters] = useState(false);

  useEffect(() => {
    const savedFavs = localStorage.getItem('favoriteFilters');
    if (savedFavs) {
      try { setFavoriteFilters(JSON.parse(savedFavs)); } catch (e) {}
    }
    const savedRecents = localStorage.getItem('recentFilters');
    if (savedRecents) {
      try { setRecentFilters(JSON.parse(savedRecents)); } catch (e) {}
    }
  }, []);

  const saveFavorites = (favs: string[]) => {
    setFavoriteFilters(favs);
    localStorage.setItem('favoriteFilters', JSON.stringify(favs));
  };
  
  const saveRecents = (recents: string[]) => {
    setRecentFilters(recents);
    localStorage.setItem('recentFilters', JSON.stringify(recents));
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (favoriteFilters.includes(id)) {
      saveFavorites(favoriteFilters.filter(f => f !== id));
    } else {
      saveFavorites([...favoriteFilters, id]);
    }
  };

  const applyPreset = (id: string) => {
    setSelectedPresetId(id);
    setActiveTab('presets');
    
    if (id !== 'normal') {
      const newRecents = [id, ...recentFilters.filter(f => f !== id)].slice(0, 5);
      saveRecents(newRecents);
    }
  };

  const generateFilterStyle = (state: FilterState, int: number = 100) => {
    const i = int / 100;
    const b = 100 + (state.brightness - 100) * i;
    const c = 100 + (state.contrast - 100) * i;
    const s = 100 + (state.saturation - 100) * i;
    const h = state.hue * i;
    const bl = state.blur * i;
    const sep = state.sepia * i;

    let filterStr = "";
    if (b !== 100) filterStr += `brightness(${b}%) `;
    if (c !== 100) filterStr += `contrast(${c}%) `;
    if (s !== 100) filterStr += `saturate(${s}%) `;
    if (h !== 0) filterStr += `hue-rotate(${h}deg) `;
    if (bl !== 0) filterStr += `blur(${bl}px) `;
    if (sep !== 0) filterStr += `sepia(${sep}%)`;

    return filterStr.trim();
  };

  useEffect(() => {
    if (activeTab === 'presets') {
      const preset = PRESET_FILTERS.find(f => f.id === selectedPresetId) || PRESET_FILTERS[0];
      const style = generateFilterStyle(preset.state, intensity);
      onFilterChange(style, preset.name, preset.id);
    } else {
      const style = generateFilterStyle(customState, 100);
      onFilterChange(style, 'Custom', 'custom');
    }
  }, [activeTab, selectedPresetId, intensity, customState]);

  const filteredPresets = useMemo(() => {
    if (!searchQuery) return PRESET_FILTERS;
    const lower = searchQuery.toLowerCase();
    return PRESET_FILTERS.filter(f => f.name.toLowerCase().includes(lower) || f.tags.some(t => t.includes(lower)));
  }, [searchQuery]);

  const renderPreset = (preset: typeof PRESET_FILTERS[0]) => {
    const isSelected = selectedPresetId === preset.id && activeTab === 'presets';
    const isFav = favoriteFilters.includes(preset.id);
    
    return (
      <button 
        key={preset.id} 
        onClick={() => applyPreset(preset.id)} 
        className={`w-full text-left p-3 rounded-2xl transition-all flex items-center gap-4 group ${isSelected ? 'bg-white shadow-xl ring-2 ring-pink-400' : 'hover:bg-white/80 text-gray-600 bg-white/40'}`}
      >
        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-200">
          {previewImage ? (
             <img 
               src={previewImage} 
               className="w-full h-full object-cover" 
               style={{ filter: generateFilterStyle(preset.state, 100) }}
               alt={preset.name}
             />
          ) : (
             <div className="w-full h-full flex items-center justify-center bg-gray-100"><Layers className="w-5 h-5 text-gray-400" /></div>
          )}
        </div>
        <div className="flex-1 flex flex-col">
          <span className="font-bold text-sm text-gray-800">{preset.name}</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">{preset.tags[0]}</span>
        </div>
        <div 
          onClick={(e) => toggleFavorite(e, preset.id)}
          className={`p-2 rounded-full transition-all ${isFav ? 'text-yellow-500' : 'text-gray-300 opacity-0 group-hover:opacity-100 hover:text-yellow-500 hover:bg-yellow-50'}`}
        >
          <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </div>
      </button>
    );
  };

  return (
    <div className="w-full lg:w-80 bg-gray-50/80 backdrop-blur-xl rounded-[2rem] p-5 border border-gray-100 flex flex-col h-full shadow-lg">
      <div className="flex justify-between items-center mb-6 px-1">
        <h3 className="font-black text-gray-800 text-sm uppercase tracking-widest flex items-center gap-2">
           <Settings2 className="w-4 h-4 text-pink-500" /> Color Grading
        </h3>
      </div>

      <div className="flex gap-2 mb-6 bg-gray-200/50 p-1 rounded-2xl">
        <button 
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${activeTab === 'presets' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Presets
        </button>
        <button 
          onClick={() => setActiveTab('custom')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${activeTab === 'custom' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Custom
        </button>
      </div>

      {activeTab === 'presets' ? (
        <>
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search filters..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-none rounded-2xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-pink-100 outline-none text-gray-700 shadow-sm transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex flex-wrap gap-2 mb-6">
              {(showAllFilters ? filteredPresets : filteredPresets.slice(0, 8)).map(preset => {
                const isSelected = selectedPresetId === preset.id && activeTab === 'presets';
                return (
                  <button 
                    key={preset.id} 
                    onClick={() => applyPreset(preset.id)} 
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${isSelected ? 'bg-pink-500 text-white border-pink-400 shadow-md scale-105' : 'bg-white border-gray-100 text-gray-600 hover:border-pink-200 hover:bg-pink-50'}`}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
            
            {filteredPresets.length > 8 && (
              <div className="flex justify-center mb-8">
                <button 
                  onClick={() => setShowAllFilters(!showAllFilters)}
                  className="bg-pink-100 text-pink-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-pink-200 transition-all shadow-sm"
                >
                  {showAllFilters ? "Show Less" : "More Filters"}
                </button>
              </div>
            )}

            {searchQuery === "" && favoriteFilters.length > 0 && (
              <div className="space-y-3 mt-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-pink-500 flex items-center gap-2 px-2"><Star className="w-3 h-3 fill-current" /> Favorites</h4>
                <div className="grid grid-cols-1 gap-3">
                  {favoriteFilters.map(id => {
                    const preset = PRESET_FILTERS.find(f => f.id === id);
                    return preset ? renderPreset(preset) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          {selectedPresetId !== 'normal' && (
            <div className="mt-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Intensity</span>
                <span className="text-xs font-black text-pink-500">{intensity}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={intensity} 
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-5">
           {[
             { key: 'brightness', label: 'Brightness', min: 0, max: 200, unit: '%' },
             { key: 'contrast', label: 'Contrast', min: 0, max: 200, unit: '%' },
             { key: 'saturation', label: 'Saturation', min: 0, max: 200, unit: '%' },
             { key: 'hue', label: 'Hue', min: -180, max: 180, unit: '°' },
             { key: 'blur', label: 'Blur', min: 0, max: 20, unit: 'px' },
             { key: 'sepia', label: 'Sepia', min: 0, max: 100, unit: '%' }
           ].map(control => (
             <div key={control.key} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between mb-3">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                     <SlidersHorizontal className="w-3 h-3 text-pink-400" /> {control.label}
                  </span>
                  <span className="text-xs font-black text-pink-500">
                     {customState[control.key as keyof FilterState]}{control.unit}
                  </span>
                </div>
                <input 
                  type="range" 
                  min={control.min} max={control.max} 
                  value={customState[control.key as keyof FilterState]} 
                  onChange={(e) => setCustomState({ ...customState, [control.key]: Number(e.target.value) })}
                  className="w-full accent-pink-500 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
             </div>
           ))}
           <div className="pt-4">
             <button 
               onClick={() => setCustomState(DEFAULT_FILTER)}
               className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
             >
               Reset Adjustments
             </button>
           </div>
        </div>
      )}
    </div>
  );
}
