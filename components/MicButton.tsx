'use client';

import { useState, useRef, useCallback } from 'react';

interface MicButtonProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export function MicButton({ onTranscription, disabled }: MicButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    if (disabled || isRecording) return;
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
  }, [disabled, isRecording]);

  const stopRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder || !isRecording) return;

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      mediaRecorder.stream.getTracks().forEach((t) => t.stop());
      if (blob.size === 0) return;
      const formData = new FormData();
      formData.append('audio', blob);
      try {
        const res = await fetch('/api/transcribe', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.text) onTranscription(data.text);
      } catch {
        // transcribe failed
      }
    };

    mediaRecorder.stop();
    setIsRecording(false);
  }, [isRecording, onTranscription]);

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
        onTouchEnd={(e) => { e.preventDefault(); stopRecording(); }}
        disabled={disabled}
        className={`w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all select-none disabled:opacity-40 ${
          isRecording
            ? 'bg-red-600 animate-pulse scale-110'
            : 'bg-bark hover:bg-bark-light active:scale-95'
        }`}
        aria-label={isRecording ? '녹음 중 - 손을 떼면 전송됩니다' : '마이크 버튼 - 꾹 누르고 말씀하세요'}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="9" y="3" width="6" height="10" rx="3" fill="white" />
          <path d="M5 11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="18" x2="12" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="22" x2="16" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <p className="text-[14px] text-stone text-center">
        {isRecording ? '듣고 있습니다...' : '꾹 누르고 말씀하세요'}
      </p>
    </div>
  );
}
