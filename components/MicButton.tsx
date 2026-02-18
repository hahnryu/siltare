'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

const LABELS = {
  recording: '듣고 있습니다...',
  processing: '생각하고 있습니다',
  hint: '꾹 누르고 말씀하세요',
};

interface MicButtonProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function ProcessingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      <span className="animate-dot-1 inline-block h-[5px] w-[5px] rounded-full bg-amber" />
      <span className="animate-dot-2 inline-block h-[5px] w-[5px] rounded-full bg-amber" />
      <span className="animate-dot-3 inline-block h-[5px] w-[5px] rounded-full bg-amber" />
    </span>
  );
}

export function MicButton({ onTranscription, disabled }: MicButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRecording) {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    if (disabled || isRecording || isProcessing) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      // mic not available
    }
  }, [disabled, isRecording, isProcessing]);

  const stopRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder || !isRecording) return;

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      mediaRecorder.stream.getTracks().forEach((t) => t.stop());
      if (blob.size === 0) {
        setIsProcessing(false);
        return;
      }
      const formData = new FormData();
      formData.append('audio', blob);
      try {
        const res = await fetch('/api/transcribe', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.text) onTranscription(data.text);
      } catch {
        // transcribe failed
      } finally {
        setIsProcessing(false);
      }
    };

    mediaRecorder.stop();
    setIsRecording(false);
    setIsProcessing(true);
    setElapsed(0);
  }, [isRecording, onTranscription]);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Timer above button */}
      <div className="flex items-center gap-2">
        {isRecording && (
          <span
            className="h-1.5 w-1.5 rounded-full bg-amber animate-pulse"
            aria-label="녹음 중"
          />
        )}
        <time
          className={`tabular-nums transition-all duration-300 ${
            isRecording
              ? 'text-2xl font-bold text-amber'
              : 'font-sans text-sm text-stone'
          }`}
          aria-label={`경과 시간 ${formatTime(elapsed)}`}
        >
          {formatTime(elapsed)}
        </time>
      </div>

      {/* Status text */}
      <div className="h-5 text-center">
        {isRecording && (
          <p className="font-sans text-sm text-amber">{LABELS.recording}</p>
        )}
        {isProcessing && (
          <p className="flex items-center gap-2 font-sans text-sm text-stone">
            <span>{LABELS.processing}</span>
            <ProcessingDots />
          </p>
        )}
      </div>

      {/* Mic button */}
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
        onTouchEnd={(e) => { e.preventDefault(); stopRecording(); }}
        disabled={disabled || isProcessing}
        className={`relative flex h-[72px] w-[72px] items-center justify-center rounded-full transition-all duration-300 select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber ${
          isRecording
            ? 'bg-amber animate-pulse-glow'
            : isProcessing
            ? 'bg-stone opacity-60 cursor-not-allowed'
            : 'bg-bark hover:bg-bark/90 active:scale-95 disabled:opacity-40'
        }`}
        aria-label={
          isRecording
            ? '녹음 중지 - 손을 떼면 전송됩니다'
            : isProcessing
            ? '처리 중'
            : '마이크 버튼 - 꾹 누르고 말씀하세요'
        }
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="9" y="3" width="6" height="10" rx="3" fill="white" />
          <path d="M5 11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="12" y1="18" x2="12" y2="22" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="8" y1="22" x2="16" y2="22" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {/* Helper text */}
      <p className="max-w-[260px] text-center font-sans text-xs leading-relaxed text-stone">
        {LABELS.hint}
      </p>
    </div>
  );
}
