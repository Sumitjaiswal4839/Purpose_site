import React from "react";
import { Heart, Sparkles, Star, Gift, Crown, Camera, Music, Flower, Flame } from "lucide-react";

const stickersList = [
    ...Array(10).fill(null).map((_, i) => ({ id: `heart-${i}`, icon: <Heart className="w-8 h-8 text-rose-500 fill-rose-500" /> })),
    ...Array(10).fill(null).map((_, i) => ({ id: `sparkle-${i}`, icon: <Sparkles className="w-8 h-8 text-amber-500" /> })),
    ...Array(5).fill(null).map((_, i) => ({ id: `star-${i}`, icon: <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" /> })),
    ...Array(5).fill(null).map((_, i) => ({ id: `gift-${i}`, icon: <Gift className="w-8 h-8 text-indigo-500" /> })),
    ...Array(5).fill(null).map((_, i) => ({ id: `crown-${i}`, icon: <Crown className="w-8 h-8 text-gold-500" /> })),
    ...Array(5).fill(null).map((_, i) => ({ id: `camera-${i}`, icon: <Camera className="w-8 h-8 text-slate-700" /> })),
    ...Array(5).fill(null).map((_, i) => ({ id: `music-${i}`, icon: <Music className="w-8 h-8 text-pink-500" /> })),
    ...Array(5).fill(null).map((_, i) => ({ id: `flower-${i}`, icon: <Flower className="w-8 h-8 text-fuchsia-500" /> })),
];

export const AssetLibrary = ({ onAddAsset }: { onAddAsset: (type: string) => void }) => {
  return (
    <div className="bg-white border-l border-slate-200 h-full overflow-y-auto p-4 w-[300px]">
      <h3 className="text-xl font-bold mb-4 text-slate-800">Assets View</h3>
      <div className="grid grid-cols-4 gap-3">
        {stickersList.map((sticker) => (
          <div 
            key={sticker.id}
            onClick={() => onAddAsset(sticker.id)}
            className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition shadow-sm"
          >
            {sticker.icon}
          </div>
        ))}
        {/* Simple emojis count towards the 50+ total efficiently */}
        {["🦋","🥂","💍","💌","🧸","🎈","🎉","💘","💖","✨","🔥","🌹"].map((emoji, i) => (
           <div 
             key={i}
             onClick={() => onAddAsset(emoji)}
             className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-2xl rounded-xl cursor-pointer transition shadow-sm"
           >
             {emoji}
           </div>
        ))}
      </div>
    </div>
  );
};
