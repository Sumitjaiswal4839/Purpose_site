"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, Pause, ZoomIn, ZoomOut, Scissors, Copy, Trash2, 
  Settings2, Wand2, Image as ImageIcon, Check, ChevronRight, Minimize, Maximize 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export type AnimationPreset = 'none' | 'fadeIn' | 'zoomIn' | 'slideLeft' | 'slideRight' | 'bounce' | 'rotate' | 'flip' | 'scale';
export type TransitionPreset = 'none' | 'fade' | 'wipe' | 'slide' | 'zoom';

export interface TimelineItemData {
  id: string;
  url: string;
  duration: number; // in seconds
  animation: AnimationPreset;
  transitionNext: TransitionPreset;
}

interface TimelineEditorProps {
  initialItems?: TimelineItemData[];
  previewUrls?: string[];
  onChange?: (items: TimelineItemData[]) => void;
  onTimeUpdate?: (time: number, isPlaying: boolean) => void;
}

// ----------------------------------------
// Animations & Transitions Options
// ----------------------------------------
const ANIMATIONS: { id: AnimationPreset; name: string }[] = [
  { id: 'none', name: 'None' },
  { id: 'fadeIn', name: 'Fade In' },
  { id: 'zoomIn', name: 'Zoom In' },
  { id: 'slideLeft', name: 'Slide Left' },
  { id: 'slideRight', name: 'Slide Right' },
  { id: 'bounce', name: 'Bounce' },
  { id: 'rotate', name: 'Rotate' },
  { id: 'flip', name: 'Flip' },
  { id: 'scale', name: 'Scale' },
];

const TRANSITIONS: { id: TransitionPreset; name: string; icon: string }[] = [
  { id: 'none', name: 'None', icon: 'none' },
  { id: 'fade', name: 'Fade', icon: '🌫️' },
  { id: 'wipe', name: 'Wipe', icon: '〰️' },
  { id: 'slide', name: 'Slide', icon: '↔️' },
  { id: 'zoom', name: 'Zoom', icon: '🔍' },
];

const SECONDS_TO_PIXELS = 50; // Base width per second at 100% zoom

// ----------------------------------------
// Sortable Item Wrapper
// ----------------------------------------
interface SortableItemProps {
  item: TimelineItemData;
  index: number;
  totalItems: number;
  zoomLevel: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdateTransition: (transition: TransitionPreset) => void;
}

function SortableTimelineItem({ item, index, totalItems, zoomLevel, isSelected, onSelect, onUpdateTransition }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    width: `${item.duration * SECONDS_TO_PIXELS * (zoomLevel / 100)}px`,
    minWidth: '40px',
  };

  const isLast = index === totalItems - 1;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="relative flex items-center h-20 shrink-0 group"
    >
      <div 
        className={`w-full h-full rounded-lg overflow-hidden border-2 cursor-grab active:cursor-grabbing relative ${isSelected ? 'border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'border-gray-700 hover:border-gray-500'}`}
        onClick={onSelect}
        {...attributes} 
        {...listeners}
      >
        <img src={item.url} alt="Timeline Clip" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-1 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[10px] text-white font-mono pointer-events-none">
          {item.duration.toFixed(1)}s
        </div>
        {item.animation !== 'none' && (
           <div className="absolute top-1 left-2 bg-pink-500/80 px-1.5 py-0.5 rounded text-[8px] text-white font-black uppercase tracking-widest pointer-events-none">
             {item.animation}
           </div>
        )}
      </div>

      {!isLast && (
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10">
          <button 
            className={`w-6 h-6 rounded-md flex items-center justify-center text-xs shadow-xl border ${item.transitionNext !== 'none' ? 'bg-pink-600 border-pink-400 text-white z-20' : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'}`}
            onClick={(e) => {
              e.stopPropagation();
              const nextIdx = TRANSITIONS.findIndex(t => t.id === item.transitionNext);
              const nextTrans = TRANSITIONS[(nextIdx + 1) % TRANSITIONS.length].id;
              onUpdateTransition(nextTrans);
            }}
            title={`Transition: ${item.transitionNext}`}
          >
            {item.transitionNext === 'none' ? <ChevronRight className="w-3 h-3" /> : TRANSITIONS.find(t => t.id === item.transitionNext)?.icon}
          </button>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------
// Main Component
// ----------------------------------------
function TimelineEditor({ initialItems, previewUrls = [], onChange, onTimeUpdate }: TimelineEditorProps) {
  // Map preview URLs to items if no initial items provided
  const [items, setItems] = useState<TimelineItemData[]>(() => {
    if (initialItems && initialItems.length > 0) return initialItems;
    return previewUrls.map((url, i) => ({
      id: `clip-${i}-${Date.now()}`,
      url,
      duration: 3.0, // default 3 seconds
      animation: 'none',
      transitionNext: 'none'
    }));
  });

  // Keep in sync if previewUrls changes externally (optional, depending on parent logic)
  useEffect(() => {
    if (previewUrls.length > 0 && items.length === 0) {
      setItems(previewUrls.map((url, i) => ({
        id: `clip-${i}-${Date.now()}`,
        url,
        duration: 3.0,
        animation: 'none',
        transitionNext: 'none'
      })));
    }
  }, [previewUrls]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const totalDuration = items.reduce((acc, item) => acc + item.duration, 0);

  // Sync upwards
  useEffect(() => {
    if (onChange) onChange(items);
  }, [items, onChange]);

  // Playback Engine
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      const loop = (time: number) => {
        const delta = (time - lastTimeRef.current) / 1000;
        lastTimeRef.current = time;
        
        setCurrentTime(prev => {
          let next = prev + delta;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return next;
        });
        animationRef.current = requestAnimationFrame(loop);
      };
      animationRef.current = requestAnimationFrame(loop);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, totalDuration]);

  // Sync time to parent
  useEffect(() => {
    if (onTimeUpdate) onTimeUpdate(currentTime, isPlaying);
    
    // Auto-scroll timeline to follow playhead if it goes out of view
    if (isPlaying && timelineRef.current && playheadRef.current) {
       const playheadX = playheadRef.current.offsetLeft;
       const scrollLeft = timelineRef.current.scrollLeft;
       const width = timelineRef.current.clientWidth;
       
       if (playheadX > scrollLeft + width - 100) {
          timelineRef.current.scrollLeft = playheadX - 100;
       }
    }
  }, [currentTime, isPlaying, onTimeUpdate]);

  // DND Handlers
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateSelectedItem = (updates: Partial<TimelineItemData>) => {
    if (!selectedId) return;
    setItems(items.map(item => item.id === selectedId ? { ...item, ...updates } : item));
  };

  const applyAnimationToAll = (animation: AnimationPreset) => {
    setItems(items.map(item => ({ ...item, animation })));
  };

  const selectedItem = items.find(i => i.id === selectedId);

  return (
    <div className="w-full bg-gray-950 border border-gray-800 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl h-full font-sans">
      {/* ---------------------------------------- */}
      {/* TOP BAR: Controls & Info */}
      {/* ---------------------------------------- */}
      <div className="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-4">
           <button 
             onClick={() => {
                if (currentTime >= totalDuration) setCurrentTime(0);
                setIsPlaying(!isPlaying);
             }}
             className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-rose-500/20 text-rose-500' : 'bg-white text-black hover:scale-105'}`}
           >
             {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
           </button>
           <div className="flex flex-col">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Time</span>
              <span className="text-white font-mono text-xl">{currentTime.toFixed(2)} / {totalDuration.toFixed(2)}s</span>
           </div>
        </div>

        <div className="flex items-center gap-6">
           {/* Zoom Controls */}
           <div className="flex items-center gap-3 bg-gray-800 p-1.5 rounded-full">
             <button onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))} className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition">
               <ZoomOut className="w-4 h-4" />
             </button>
             <span className="text-xs font-bold text-gray-300 w-12 text-center">{zoomLevel}%</span>
             <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))} className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition">
               <ZoomIn className="w-4 h-4" />
             </button>
           </div>
           
           <button className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-white transition">
              <Settings2 className="w-4 h-4" /> Config
           </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ---------------------------------------- */}
        {/* LEFT SIDEBAR: Item Properties */}
        {/* ---------------------------------------- */}
        <div className="w-72 bg-gray-900/50 border-r border-gray-800 flex flex-col p-6 overflow-y-auto custom-scrollbar">
           <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Clip Inspector</h3>
           
           {selectedItem ? (
             <AnimatePresence mode="popLayout">
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                 
                 {/* Thumbnail preview */}
                 <div className="w-full aspect-video rounded-xl overflow-hidden border border-gray-700 relative bg-black flex items-center justify-center group">
                    <img src={selectedItem.url} className="max-w-full max-h-full object-contain" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold bg-pink-600 px-3 py-1 rounded-full">{selectedItem.animation} Hover</span>
                    </div>
                 </div>

                 {/* Duration */}
                 <div className="space-y-3">
                   <div className="flex justify-between items-center">
                     <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">Duration</label>
                     <span className="text-xs font-mono text-pink-400 bg-pink-400/10 px-2 py-0.5 rounded">{selectedItem.duration.toFixed(1)}s</span>
                   </div>
                   <input 
                     type="range" min="1" max="10" step="0.1"
                     value={selectedItem.duration}
                     onChange={(e) => updateSelectedItem({ duration: parseFloat(e.target.value) })}
                     className="w-full accent-pink-500 h-1 bg-gray-700 rounded-lg appearance-none"
                   />
                 </div>

                 {/* Animations */}
                 <div className="space-y-3">
                   <label className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center justify-between">
                     Animation
                     <button 
                       onClick={() => applyAnimationToAll(selectedItem.animation)}
                       className="text-[9px] bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded-md transition"
                     >Apply to All</button>
                   </label>
                   <div className="grid grid-cols-2 gap-2">
                     {ANIMATIONS.map(anim => (
                       <button
                         key={anim.id}
                         onClick={() => updateSelectedItem({ animation: anim.id })}
                         className={`text-[10px] font-bold py-2 rounded-lg border transition-all ${selectedItem.animation === anim.id ? 'bg-pink-600/20 border-pink-500 text-pink-300' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}
                       >
                         {anim.name}
                       </button>
                     ))}
                   </div>
                 </div>
                 
               </motion.div>
             </AnimatePresence>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
               <ImageIcon className="w-12 h-12 mb-4 text-gray-500" />
               <p className="text-xs font-bold uppercase tracking-widest">Select a clip<br/>to edit properties</p>
             </div>
           )}
        </div>

        {/* ---------------------------------------- */}
        {/* RIGHT SIDE: Timeline Track */}
        {/* ---------------------------------------- */}
        <div className="flex-1 flex flex-col relative bg-gray-950" ref={timelineRef} style={{ overflowX: 'auto', overflowY: 'hidden' }}>
           
           {/* Timeline Ruler */}
           <div className="h-8 border-b border-gray-800 flex relative" style={{ width: `${Math.max(100, totalDuration * SECONDS_TO_PIXELS * (zoomLevel / 100))}px` }}>
              {Array.from({ length: Math.ceil(totalDuration) + 5 }).map((_, i) => (
                <div key={i} className="absolute h-full flex flex-col items-center" style={{ left: `${i * SECONDS_TO_PIXELS * (zoomLevel / 100)}px` }}>
                   <span className="text-[9px] text-gray-500 mt-1">{i}s</span>
                   <div className="w-px h-2 bg-gray-700 absolute bottom-0"></div>
                </div>
              ))}
           </div>

           {/* Track Container */}
           <div className="flex-1 relative pt-8 pb-4 pl-4" style={{ width: `${totalDuration * SECONDS_TO_PIXELS * (zoomLevel / 100) + 100}px` }}>
              
              {/* Playhead Line */}
              <div 
                ref={playheadRef}
                className="absolute top-0 bottom-0 w-px bg-rose-500 z-50 pointer-events-none transition-transform"
                style={{ 
                  transform: `translateX(${currentTime * SECONDS_TO_PIXELS * (zoomLevel / 100)}px)`,
                  left: '16px' // match padding
                }}
              >
                <div className="absolute -top-3 -translate-x-1/2 cursor-grab active:cursor-grabbing w-3 h-4 bg-rose-500 pointer-events-auto rounded-sm"
                     onMouseDown={(e) => {
                       const track = timelineRef.current;
                       if (!track) return;
                       
                       const handleMouseMove = (moveEvent: MouseEvent) => {
                         const rect = track.getBoundingClientRect();
                         const scrollLeft = track.scrollLeft;
                         const x = moveEvent.clientX - rect.left + scrollLeft - 16;
                         let newTime = x / (SECONDS_TO_PIXELS * (zoomLevel / 100));
                         newTime = Math.max(0, Math.min(totalDuration, newTime));
                         setCurrentTime(newTime);
                       };
                       
                       const handleMouseUp = () => {
                         document.removeEventListener('mousemove', handleMouseMove);
                         document.removeEventListener('mouseup', handleMouseUp);
                       };
                       
                       document.addEventListener('mousemove', handleMouseMove);
                       document.addEventListener('mouseup', handleMouseUp);
                     }}
                >
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-rose-500" />
                </div>
              </div>

              {/* DND Track */}
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map(i => i.id)} strategy={horizontalListSortingStrategy}>
                  <div className="flex gap-1 h-20 relative">
                    {items.map((item, idx) => (
                      <SortableTimelineItem
                        key={item.id}
                        item={item}
                        index={idx}
                        totalItems={items.length}
                        zoomLevel={zoomLevel}
                        isSelected={selectedId === item.id}
                        onSelect={() => setSelectedId(item.id)}
                        onUpdateTransition={(trans) => {
                           setItems(items.map(i => i.id === item.id ? { ...i, transitionNext: trans } : i));
                        }}
                      />
                    ))}
                    {items.length === 0 && (
                      <div className="w-full flex items-center justify-center opacity-30">
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Add media to timeline</span>
                      </div>
                    )}
                  </div>
                </SortableContext>
                <DragOverlay>
                   {/* Fallback for dragging visually */}
                </DragOverlay>
              </DndContext>

           </div>
        </div>
      </div>
    </div>
  );
}

export default TimelineEditor;
