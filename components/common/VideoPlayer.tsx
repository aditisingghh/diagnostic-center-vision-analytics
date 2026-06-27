'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, PlayCircle, VideoOff, Volume2 } from 'lucide-react';

interface VideoPlayerProps {
  title?: string;
  videoUrl?: string;
  driveUrl?: string;
  dropFileName?: string;
  durationSeconds?: number;
  onTimeUpdate?: (seconds: number) => void;
  onPlayingChange?: (isPlaying: boolean) => void;
}

const formatSeconds = (seconds = 0) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `00:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export function VideoPlayer({
  title = 'Video Feed',
  videoUrl,
  driveUrl,
  dropFileName,
  durationSeconds = 0,
  onTimeUpdate,
  onPlayingChange,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSecond, setCurrentSecond] = useState(0);

  useEffect(() => {
    setHasError(false);
    setCurrentSecond(0);
  }, [videoUrl]);

  const updatePlaying = (playing: boolean) => {
    setIsPlaying(playing);
    onPlayingChange?.(playing);
  };

  const handleTimeUpdate = (seconds: number) => {
    setCurrentSecond(seconds);
    onTimeUpdate?.(seconds);
  };

  return (
    <div className="w-full bg-black dark:bg-slate-950 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 shadow-lg">
      <div className="relative aspect-video bg-black flex items-center justify-center group">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
          <span className="text-white text-xs font-bold bg-black/70 px-2 py-1 rounded">
            {isPlaying ? 'PLAYING' : 'READY'}
          </span>
        </div>

        <div className="absolute top-4 right-4 z-10 text-white text-xs bg-black/70 px-3 py-1 rounded">
          {formatSeconds(currentSecond)} / {formatSeconds(durationSeconds)}
        </div>

        {videoUrl && !hasError ? (
          <video
            className="absolute inset-0 h-full w-full bg-black object-contain"
            src={videoUrl}
            controls
            preload="metadata"
            onPlay={() => updatePlaying(true)}
            onPause={() => updatePlaying(false)}
            onEnded={() => {
              handleTimeUpdate(durationSeconds);
              updatePlaying(false);
            }}
            onTimeUpdate={(event) => handleTimeUpdate(event.currentTarget.currentTime)}
            onSeeked={(event) => handleTimeUpdate(event.currentTarget.currentTime)}
            onError={() => {
              setHasError(true);
              updatePlaying(false);
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 px-6 text-center">
            {hasError ? (
              <VideoOff className="mb-4 h-12 w-12 text-slate-500" />
            ) : (
              <PlayCircle className="mb-4 h-12 w-12 text-slate-500" />
            )}
            <p className="text-sm font-semibold text-white">
              {hasError ? 'Video cannot be played by this browser' : 'Video source is ready for local upload'}
            </p>
            {dropFileName && (
              <p className="mt-2 max-w-md text-xs text-slate-400">
                Confirm {dropFileName} exists in public/videos and is H.264 encoded.
              </p>
            )}
            {driveUrl && (
              <a
                href={driveUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
                Drive Source
              </a>
            )}
          </div>
        )}
      </div>

      <div className="bg-slate-900 dark:bg-slate-800 p-4 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-slate-400 text-xs mt-1">
              {videoUrl ? videoUrl : 'Waiting for local video asset'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" aria-label="Audio status">
              <Volume2 className="w-5 h-5 text-slate-300" />
            </button>
            <div className="h-1 w-32 rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${durationSeconds > 0 ? Math.min(100, (currentSecond / durationSeconds) * 100) : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
