'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChatMessage } from '@/components/ChatMessage';
import { MicButton } from '@/components/MicButton';
import { AudioBubble } from '@/components/AudioBubble';
import { TextChunkBubble } from '@/components/TextChunkBubble';
import { Interview } from '@/lib/types';

const LABELS = {
  logo: '실타래',
  inputPlaceholder: '메시지를 입력하세요...',
  addBtn: '추가',
  sendBtn: '전송',
  endBtn: '오늘은 여기까지',
  chatError: '잠시 연결이 불안정합니다. 다시 말씀해 주세요.',
  saveModalTitle: '오늘의 이야기를 저장합니다.',
  saveModalBody: '이야기는 안전하게 보관됩니다. 언제든 이어서 하실 수 있습니다.',
  saveModalConfirm: '저장하고 나가기',
  saveModalConfirmLoading: '저장 중...',
  saveModalCancel: '계속하기',
  untranscribedWarning: '변환되지 않은 녹음 N개는 전송되지 않았습니다',
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

interface Msg {
  id?: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp?: string;
}

interface PendingChunk {
  id: string;
  type: 'audio' | 'text';
  // audio 전용
  blob?: Blob;
  blobUrl?: string;
  duration?: number;
  mimeType?: string;
  transcribeStatus?: 'recorded' | 'transcribing' | 'transcribed' | 'error';
  transcribedText?: string;
  whisperLanguage?: string;
  whisperDuration?: number;
  whisperSegments?: { start: number; end: number; text: string }[];
  // text 전용
  text?: string;
  // 공통
  createdAt: number;
}

export default function InterviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [pendingChunks, setPendingChunks] = useState<PendingChunk[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [untranscribedWarning, setUntranscribedWarning] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Refs for stable access inside async callbacks (avoids stale closures)
  const messagesRef = useRef<Msg[]>([]);
  const interviewMetaRef = useRef<Interview | null>(null);

  // Keep messagesRef in sync with state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingChunks]);

  // Timer — starts only after first message arrives (not on page load)
  const hasMessages = messages.length > 0;
  useEffect(() => {
    if (!hasMessages) return;
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, [hasMessages]);

  const sendMessage = useCallback(async (userText: string) => {
    if (streaming) return;

    // Capture messages before state update — these become clientMessages fallback
    const prevMessages = messagesRef.current;

    if (userText.trim()) {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', content: userText, timestamp: new Date().toISOString() }]);
    }
    setInput('');
    setStreaming(true);

    let assistantContent = '';
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: '', timestamp: new Date().toISOString() }]);

    // Build client-side history: previous messages + current user message (if any)
    const clientMessages: Msg[] = userText.trim()
      ? [...prevMessages, { role: 'user', content: userText }]
      : [...prevMessages];

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewId: id,
          message: userText,
          interviewMeta: interviewMetaRef.current ?? undefined,
          clientMessages,
        }),
      });

      if (!res.ok || !res.body) throw new Error('chat failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const parsed = JSON.parse(line.slice(6));
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                assistantContent += delta;
                setMessages((prev) => {
                  const next = [...prev];
                  next[next.length - 1] = { ...next[next.length - 1], content: assistantContent };
                  return next;
                });
              }
            } catch {
              // skip malformed SSE chunks
            }
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: 'assistant', content: LABELS.chatError };
        return next;
      });
    } finally {
      setStreaming(false);
    }
  }, [id, streaming]);

  // Fetch interview metadata, then fire first AI message.
  // Merged into one effect to guarantee interviewMetaRef is populated before sendMessage('').
  useEffect(() => {
    if (!id || initialized) return;
    setInitialized(true);
    fetch(`/api/create-interview?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Interview | null) => {
        if (data) interviewMetaRef.current = data;
      })
      .catch(() => {})
      .finally(() => {
        sendMessage('');
      });
  }, [id, initialized, sendMessage]);

  // Recording complete handler (MicButton)
  const handleRecordingComplete = (blob: Blob, duration: number, mimeType: string) => {
    const blobUrl = URL.createObjectURL(blob);
    const chunk: PendingChunk = {
      id: crypto.randomUUID(),
      type: 'audio',
      blob,
      blobUrl,
      duration,
      mimeType,
      transcribeStatus: 'recorded',
      createdAt: Date.now(),
    };
    setPendingChunks((prev) => [...prev, chunk]);
  };

  // Transcribe audio chunk
  const handleTranscribe = async (chunkId: string) => {
    setPendingChunks((prev) =>
      prev.map((c) => (c.id === chunkId ? { ...c, transcribeStatus: 'transcribing' as const } : c))
    );

    const chunk = pendingChunks.find((c) => c.id === chunkId);
    if (!chunk || !chunk.blob) return;

    const formData = new FormData();
    formData.append('audio', chunk.blob);

    try {
      const res = await fetch('/api/transcribe', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.text) {
        setPendingChunks((prev) =>
          prev.map((c) =>
            c.id === chunkId
              ? {
                  ...c,
                  transcribeStatus: 'transcribed' as const,
                  transcribedText: data.text,
                  whisperLanguage: data.language,
                  whisperDuration: data.duration,
                  whisperSegments: data.segments,
                }
              : c
          )
        );
      } else {
        throw new Error('no text');
      }
    } catch {
      setPendingChunks((prev) =>
        prev.map((c) => (c.id === chunkId ? { ...c, transcribeStatus: 'error' as const } : c))
      );
    }
  };

  // Delete chunk
  const handleDeleteChunk = (chunkId: string) => {
    setPendingChunks((prev) => {
      const updated = prev.filter((c) => c.id !== chunkId);
      // Revoke blob URL if audio
      const chunk = prev.find((c) => c.id === chunkId);
      if (chunk?.blobUrl) URL.revokeObjectURL(chunk.blobUrl);
      return updated;
    });
  };

  // Edit text chunk
  const handleEditTextChunk = (chunkId: string, newText: string) => {
    setPendingChunks((prev) =>
      prev.map((c) => (c.id === chunkId && c.type === 'text' ? { ...c, text: newText } : c))
    );
  };

  // Add text chunk
  const handleAddTextChunk = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const chunk: PendingChunk = {
      id: crypto.randomUUID(),
      type: 'text',
      text: trimmed,
      createdAt: Date.now(),
    };
    setPendingChunks((prev) => [...prev, chunk]);
    setInput('');
  };

  // Send all pending chunks
  const handleSendChunks = async () => {
    // Auto-add input if exists
    const finalInput = input.trim();
    let chunksToSend = [...pendingChunks];
    if (finalInput) {
      const textChunk: PendingChunk = {
        id: crypto.randomUUID(),
        type: 'text',
        text: finalInput,
        createdAt: Date.now(),
      };
      chunksToSend = [...chunksToSend, textChunk];
      setPendingChunks((prev) => [...prev, textChunk]);
      setInput('');
    }

    // Collect sendable chunks
    const sendableChunks = chunksToSend.filter(
      (c) => c.type === 'text' || (c.type === 'audio' && c.transcribeStatus === 'transcribed')
    );

    if (sendableChunks.length === 0) return;

    // Extract text
    const texts: string[] = sendableChunks.map((c) =>
      c.type === 'text' ? c.text! : c.transcribedText!
    );

    const combined = texts.join('\n');

    // Check for untranscribed audio
    const untranscribedCount = chunksToSend.filter(
      (c) => c.type === 'audio' && c.transcribeStatus !== 'transcribed'
    ).length;

    if (untranscribedCount > 0) {
      setUntranscribedWarning(LABELS.untranscribedWarning.replace('N', String(untranscribedCount)));
      setTimeout(() => setUntranscribedWarning(''), 3000);
    }

    // Upload audio chunks (best-effort, parallel)
    const audioChunksToUpload = sendableChunks.filter((c) => c.type === 'audio') as PendingChunk[];
    if (audioChunksToUpload.length > 0) {
      uploadAndSaveAudioChunks(audioChunksToUpload).catch((err) => {
        console.error('Audio upload failed (best-effort):', err);
      });
    }

    // Remove sent chunks
    const sentIds = new Set(sendableChunks.map((c) => c.id));
    setPendingChunks((prev) => {
      const remaining = prev.filter((c) => !sentIds.has(c.id));
      // Revoke blob URLs for removed audio chunks
      prev.forEach((c) => {
        if (sentIds.has(c.id) && c.blobUrl) URL.revokeObjectURL(c.blobUrl);
      });
      return remaining;
    });

    sendMessage(combined);
  };

  // Upload audio chunks to Supabase Storage + save metadata to DB
  const uploadAndSaveAudioChunks = async (chunks: PendingChunk[]) => {
    const currentMessageIndex = messagesRef.current.length;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (!chunk.blob || !chunk.mimeType) continue;

      try {
        // 1. Upload to Supabase Storage
        const uploadFormData = new FormData();
        uploadFormData.append('audio', chunk.blob);
        uploadFormData.append('interviewId', id);
        uploadFormData.append('chunkId', chunk.id);
        uploadFormData.append('mimeType', chunk.mimeType);

        const uploadRes = await fetch('/api/upload-audio', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          throw new Error('Upload failed');
        }

        const { storagePath } = await uploadRes.json();

        // 2. Save metadata to audio_chunks table
        const audioChunkData = {
          id: chunk.id,
          interviewId: id,
          chunkIndex: currentMessageIndex + i,
          storagePath,
          mimeType: chunk.mimeType,
          sampleRate: 48000,
          channels: 1,
          bitrate: 32000,
          durationSec: chunk.duration,
          fileSize: chunk.blob.size,
          transcript: chunk.transcribedText,
          language: chunk.whisperLanguage,
          segments: chunk.whisperSegments,
          whisperModel: 'whisper-1',
          messageIndex: currentMessageIndex,
          speakerLabel: 'interviewee',
          isVerified: false,
          createdAt: new Date().toISOString(),
        };

        await fetch('/api/save-audio-chunk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(audioChunkData),
        });
      } catch (err) {
        console.error(`Failed to upload/save chunk ${chunk.id}:`, err);
        // Continue with other chunks (best-effort)
      }
    }
  };

  const handleEnd = async () => {
    if (completing) return;
    setCompleting(true);
    try {
      await fetch('/api/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewId: id }),
      });
    } catch {
      // best-effort: proceed to archive even if summary generation fails
    }
    router.push(`/archive/${id}`);
  };

  // Progress: loosely tied to message count (max 20 exchanges = 100%)
  const progress = Math.min(100, messages.length * 5);

  // Can send if there are sendable chunks or input text
  const canSend =
    !streaming &&
    (input.trim() ||
      pendingChunks.some(
        (c) => c.type === 'text' || (c.type === 'audio' && c.transcribeStatus === 'transcribed')
      ));

  return (
    <div className="flex h-dvh flex-col bg-cream">
      {/* Top bar */}
      <header className="flex-shrink-0 bg-cream/90 backdrop-blur">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex flex-col items-start">
            <span className="text-[9px] uppercase tracking-widest text-stone/60">경과</span>
            <span className="font-mono text-sm tabular-nums text-stone">{formatTime(elapsed)}</span>
          </div>
          <span className="font-serif text-[17px] tracking-tight text-bark">{LABELS.logo}</span>
          <div className="w-[72px]" aria-hidden="true" />
        </div>
        {/* Amber progress bar */}
        <div
          className="h-[2px] bg-mist"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="대화 진행률"
        >
          <div
            className="h-full bg-amber transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-lg flex-col gap-4">
          {/* Confirmed messages */}
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id || crypto.randomUUID()}
              id={msg.id}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}

          {/* Pending chunks (visual separation) */}
          {pendingChunks.length > 0 && (
            <>
              <div className="my-2 flex items-center gap-3">
                <div className="h-px flex-1 bg-mist" />
                <span className="text-[11px] text-stone/50">전송 전</span>
                <div className="h-px flex-1 bg-mist" />
              </div>

              {pendingChunks.map((chunk) =>
                chunk.type === 'audio' ? (
                  <AudioBubble
                    key={chunk.id}
                    id={chunk.id}
                    blobUrl={chunk.blobUrl!}
                    duration={chunk.duration!}
                    transcribeStatus={chunk.transcribeStatus!}
                    transcribedText={chunk.transcribedText}
                    onTranscribe={handleTranscribe}
                    onDelete={handleDeleteChunk}
                  />
                ) : (
                  <TextChunkBubble
                    key={chunk.id}
                    id={chunk.id}
                    text={chunk.text!}
                    onEdit={handleEditTextChunk}
                    onDelete={handleDeleteChunk}
                  />
                )
              )}
            </>
          )}

          {/* Untranscribed warning */}
          {untranscribedWarning && (
            <div className="mx-auto rounded-lg bg-amber/10 px-4 py-2 text-center text-[13px] text-stone">
              {untranscribedWarning}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input area */}
      <footer className="flex-shrink-0 border-t border-mist/50 bg-cream pb-6">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-3 px-4 pt-5">
          <MicButton onRecordingComplete={handleRecordingComplete} disabled={streaming} />

          <div className="flex gap-2 w-full mt-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddTextChunk();
                }
              }}
              placeholder={LABELS.inputPlaceholder}
              disabled={streaming}
              className="flex-1 h-[48px] rounded-[6px] border border-mist bg-warm-white px-4 text-[16px] text-bark placeholder:text-stone focus:outline-none focus:border-amber disabled:opacity-50"
            />
            <button
              onClick={handleAddTextChunk}
              disabled={!input.trim() || streaming}
              className="h-[48px] px-4 rounded-[6px] border border-mist text-bark text-[15px] font-medium disabled:opacity-40 hover:border-amber hover:text-amber transition-colors"
            >
              {LABELS.addBtn}
            </button>
            <button
              onClick={handleSendChunks}
              disabled={!canSend}
              className="h-[48px] px-4 rounded-[6px] bg-bark text-warm-white text-[15px] font-medium disabled:opacity-40 hover:bg-bark/90 transition-colors"
            >
              {LABELS.sendBtn}
            </button>
          </div>

          <button
            onClick={() => setShowEndModal(true)}
            className="mt-3 w-full h-[48px] rounded-[6px] border border-mist bg-warm-white text-[15px] font-medium text-stone hover:border-amber hover:text-bark transition-colors"
          >
            {LABELS.endBtn}
          </button>
        </div>
      </footer>

      {/* End modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-bark/40 px-4 pb-8">
          <div className="w-full max-w-[480px] rounded-[12px] bg-warm-white p-6 shadow-xl">
            <h2 className="font-serif text-[20px] font-bold text-bark mb-2">{LABELS.saveModalTitle}</h2>
            <p className="text-[15px] text-stone leading-relaxed mb-6">{LABELS.saveModalBody}</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleEnd}
                disabled={completing}
                className="w-full h-[52px] rounded-[6px] bg-bark text-warm-white text-[16px] font-medium hover:bg-bark-light transition-colors disabled:opacity-60"
              >
                {completing ? LABELS.saveModalConfirmLoading : LABELS.saveModalConfirm}
              </button>
              <button
                onClick={() => setShowEndModal(false)}
                disabled={completing}
                className="w-full h-[44px] rounded-[6px] border border-mist text-bark text-[15px] hover:bg-mist-light transition-colors disabled:opacity-40"
              >
                {LABELS.saveModalCancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
