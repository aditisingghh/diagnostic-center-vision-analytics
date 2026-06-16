'use client';

import { useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface VideoPlayerProps {
  title?: string;
  videoUrl?: string;
}

export function VideoPlayer({ title = 'Live Stream', videoUrl }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full bg-black dark:bg-slate-950 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 shadow-lg">
      <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-black flex items-center justify-center group">
        {/* Live Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-white text-xs font-bold bg-red-500 px-2 py-1 rounded">LIVE</span>
        </div>

        {/* Timestamp */}
        <div className="absolute top-4 right-4 z-10 text-white text-xs bg-black/50 px-3 py-1 rounded">
          {new Date().toLocaleTimeString()}
        </div>

        {/* Play Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="relative z-20 flex items-center justify-center w-20 h-20 bg-blue-600 hover:bg-blue-700 rounded-full transition-all transform group-hover:scale-110 shadow-xl"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white ml-1" />
          ) : (
            <Play className="w-8 h-8 text-white ml-1" />
          )}
        </button>

        {/* Video Content or Status */}
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            <p className="text-white text-sm font-medium mb-2">Ready to connect</p>
            <p className="text-slate-300 text-xs">Click play to start streaming</p>
          </div>
        )}

        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white text-sm">Connecting...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-slate-900 dark:bg-slate-800 p-4 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-slate-400 text-xs mt-1">AI-Powered Camera Feed</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <Volume2 className="w-5 h-5 text-slate-300" />
            </button>
            <div className="w-32 h-1 bg-slate-700 rounded-full">
              <div className="w-1/3 h-full bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
