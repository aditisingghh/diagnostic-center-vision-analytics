'use client';

import { useEffect, useRef, useState } from 'react';
import { BadgeCheck, Camera, RotateCcw } from 'lucide-react';

const scanDurationSeconds = 2;
const videoUrl = '/videos/facial_yolo_person_ids_h264.mp4';
const facePhotoUrl = '/images/facial-match-face.jpg';
const fallbackMatchedFrameUrl = '/images/facial-match-photo.jpg';
const matchedId = 'Person ID 1';

export default function FacialAnalyticsPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scanKey, setScanKey] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [matchedFrameUrl, setMatchedFrameUrl] = useState<string | null>(null);

  const isMatched = elapsed >= scanDurationSeconds;
  const progress = Math.min(elapsed / scanDurationSeconds, 1);

  useEffect(() => {
    setElapsed(0);

    const startedAt = performance.now();
    const timer = window.setInterval(() => {
      setElapsed((performance.now() - startedAt) / 1000);
    }, 160);

    return () => window.clearInterval(timer);
  }, [scanKey]);

  useEffect(() => {
    if (!isMatched || matchedFrameUrl) {
      return;
    }

    const capturedFrame = captureCurrentFrame();
    setMatchedFrameUrl(capturedFrame ?? fallbackMatchedFrameUrl);
  }, [isMatched, matchedFrameUrl]);

  const captureCurrentFrame = () => {
    const video = videoRef.current;

    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      return null;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const restartScan = () => {
    setMatchedFrameUrl(null);
    setScanKey((currentKey) => currentKey + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Facial Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400">
            YOLO person ID video with image matching.
          </p>
        </div>
        <button
          onClick={restartScan}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <RotateCcw className="h-4 w-4" />
          Re-run
        </button>
      </div>

      <div className={`grid grid-cols-1 gap-6 ${isMatched ? 'xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.75fr)]' : ''}`}>
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">YOLO ID Tracking Video</h2>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${isMatched ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'}`}>
              {isMatched ? 'Image matched' : 'Generating'}
            </span>
          </div>

          <div className="relative bg-black">
            <video
              key={scanKey}
              ref={videoRef}
              className="aspect-video h-full w-full bg-black object-contain"
              src={videoUrl}
              controls
              muted
              autoPlay
              loop
              playsInline
            />

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-black/70 px-4 py-3">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-white">
                <span>{isMatched ? `${matchedId} matched` : 'Generating embeddings for each person ...'}</span>
                <span>{Math.round(progress * 100)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/20">
                <div
                  className={`h-full rounded-full transition-all duration-200 ${isMatched ? 'bg-emerald-400' : 'bg-blue-400'}`}
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {isMatched && (
          <aside>
            <section className="rounded-lg border border-emerald-200 bg-white p-5 opacity-100 shadow-sm transition-opacity duration-500 dark:border-emerald-900 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Employee Found</h2>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  Verified
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                    <img
                      src={facePhotoUrl}
                      alt="Reference image used for matching"
                      className="h-44 w-full object-cover object-[36%_78%]"
                    />
                    <p className="border-t border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300">
                      Image
                    </p>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20">
                    <img
                      src={matchedFrameUrl ?? fallbackMatchedFrameUrl}
                      alt="Verified person from the tracked video"
                      className="h-44 w-full object-cover object-[35%_67%]"
                    />
                    <p className="border-t border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:text-emerald-300">
                      Found
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Image matched with {matchedId}.
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Employee found.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        )}
      </div>
    </div>
  );
}
