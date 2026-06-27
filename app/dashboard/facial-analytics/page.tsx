'use client';

import { useEffect, useRef, useState } from 'react';
import { BadgeCheck, Camera, LoaderCircle, RotateCcw, ScanFace, ShieldCheck } from 'lucide-react';

const scanDurationSeconds = 5;
const videoUrl = '/videos/QueueLine2.mp4';
const facePhotoUrl = '/images/facial-match-face.jpg';
const chairPhotoUrl = '/images/facial-match-photo.jpg';

export default function FacialAnalyticsPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isFound, setIsFound] = useState(false);
  const [scanKey, setScanKey] = useState(0);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);

  useEffect(() => {
    setIsFound(false);
    const resultTimer = window.setTimeout(() => setIsFound(true), scanDurationSeconds * 1000);

    return () => window.clearTimeout(resultTimer);
  }, [scanKey]);

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
    const currentSnapshot = captureCurrentFrame();
    if (currentSnapshot) {
      setSnapshotUrl(currentSnapshot);
    }

    setScanKey((currentKey) => currentKey + 1);
  };

  const resultImageUrl = snapshotUrl ?? chairPhotoUrl;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Facial Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Live camera matching for seated visitor detection
          </p>
        </div>
        <button
          onClick={restartScan}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <RotateCcw className="h-4 w-4" />
          Restart Scan
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.75fr)]">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Camera Feed</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              QueueLine2.mp4
            </span>
          </div>

          <div className="relative bg-black">
            <video
              ref={videoRef}
              className="aspect-video h-full w-full bg-black object-contain"
              src={videoUrl}
              controls
              muted
              autoPlay
              loop
              playsInline
            />
            <div className="pointer-events-none absolute bottom-[11%] left-[27%] h-[33%] w-[21%] rounded-lg border-2 border-blue-400 shadow-[0_0_0_999px_rgba(15,23,42,0.22)]">
              <div className="absolute -top-8 left-0 rounded bg-blue-600 px-2 py-1 text-xs font-bold text-white">
                {isFound ? 'PERSON FOUND' : 'SCANNING'}
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${isFound ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'}`}>
                  {isFound ? <BadgeCheck className="h-6 w-6" /> : <LoaderCircle className="h-6 w-6 animate-spin" />}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {isFound ? 'Person Found' : 'Checking people in the video'}
                  </h2>
                  {isFound && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Face match completed
                    </p>
                  )}
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${isFound ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'}`}>
                {isFound ? 'Matched' : 'Checking'}
              </span>
            </div>
          </section>

          <section className={`rounded-lg border p-6 shadow-sm transition-opacity duration-500 ${isFound ? 'border-green-200 bg-white opacity-100 dark:border-green-900 dark:bg-slate-900' : 'border-slate-200 bg-white opacity-60 dark:border-slate-800 dark:bg-slate-900'}`}>
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Detection Result</h2>
            </div>

            {isFound ? (
              <div className="space-y-5">
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                  <img
                    src={facePhotoUrl}
                    alt="Matched facial analytics photo"
                    className="h-56 w-full object-cover object-[36%_78%]"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Matched Photo</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Person detected seated on the chair in the camera feed.
                  </p>
                </div>

                <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                  <img
                    src={resultImageUrl}
                    alt="Person found seated on chair"
                    className="h-48 w-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 text-center dark:border-slate-700 dark:bg-slate-950">
                <ScanFace className="mb-4 h-12 w-12 animate-pulse text-blue-500" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Checking people in the video</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Match result will appear when the video check completes.
                </p>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
