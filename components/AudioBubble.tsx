'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioBubbleProps {
  id: string;
  blobUrl: string;
  duration: number;
  transcribeStatus: 'recorded' | 'transcribing' | 'transcribed' | 'error';
  transcribedText?: string;
  onTranscribe: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  if (m > 0) return `${m}:${s.toString().padStart(2, '0')}`;
  return `${s}초`;
}

export function AudioBubble({
  id,
  blobUrl,
  duration,
  transcribeStatus,
  transcribedText,
  onTranscribe,
  onDelete,
}: AudioBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex w-full justify-end">
      <div className="flex max-w-[85%] flex-col gap-2">
        {/* Audio player bubble */}
        <div className="rounded-2xl rounded-tr-md bg-amber/10 px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Play/Pause button */}
            <button
              onClick={togglePlay}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber/20 transition-colors hover:bg-amber/30 active:scale-95"
              aria-label={isPlaying ? '일시정지' : '재생'}
            >
              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-bark">
                  <rect x="4" y="3" width="2.5" height="10" rx="1" />
                  <rect x="9.5" y="3" width="2.5" height="10" rx="1" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-bark">
                  <path d="M5 3.5C5 3.22386 5.22386 3 5.5 3C5.61374 3 5.72301 3.04448 5.80533 3.12427L12.3053 9.12427C12.4786 9.28799 12.4786 9.55534 12.3053 9.71906L5.80533 15.7191C5.63206 15.8828 5.36471 15.8828 5.19144 15.7191C5.11165 15.6367 5.06717 15.5275 5.06717 15.4137V3.5Z" />
                </svg>
              )}
            </button>

            {/* Waveform placeholder + duration */}
            <div className="flex-1 min-w-0">
              <div className="relative h-1 bg-stone/20 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-amber transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-1 text-[11px] text-stone/70">
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </div>
            </div>

            {/* Delete button */}
            <button
              onClick={() => onDelete(id)}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-stone/60 transition-colors hover:bg-stone/10 hover:text-stone active:scale-95"
              aria-label="삭제"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4L12 12M12 4L4 12" />
              </svg>
            </button>
          </div>

          {/* Transcribe button or status */}
          <div className="mt-2 flex items-center justify-end gap-2">
            {transcribeStatus === 'recorded' && (
              <button
                onClick={() => onTranscribe(id)}
                className="flex h-8 items-center gap-1.5 rounded-md border border-stone/30 bg-warm-white px-3 text-[13px] text-stone transition-colors hover:border-amber hover:text-amber active:scale-95"
              >
                <span>→A</span>
                <span>텍스트로 변환</span>
              </button>
            )}
            {transcribeStatus === 'transcribing' && (
              <div className="flex items-center gap-2 text-[12px] text-stone/70">
                <span className="inline-block h-1 w-1 animate-pulse rounded-full bg-amber" />
                <span>변환 중...</span>
              </div>
            )}
            {transcribeStatus === 'error' && (
              <button
                onClick={() => onTranscribe(id)}
                className="text-[12px] text-stone/70 underline hover:text-stone"
              >
                다시 시도
              </button>
            )}
          </div>
        </div>

        {/* Transcribed text (if available) */}
        {transcribeStatus === 'transcribed' && transcribedText && (
          <div className="rounded-2xl rounded-tr-md bg-amber/5 border border-amber/20 px-4 py-2.5">
            <div className="mb-1 text-[10px] uppercase tracking-wider text-stone/50">변환됨</div>
            <p className="text-[14px] leading-relaxed text-bark">{transcribedText}</p>
          </div>
        )}

        <audio ref={audioRef} src={blobUrl} preload="metadata" />
      </div>
    </div>
  );
}
