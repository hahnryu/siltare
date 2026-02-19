'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChatMessage } from '@/components/ChatMessage';
import { MicButton } from '@/components/MicButton';
import { Interview } from '@/lib/types';

const LABELS = {
  logo: '실타래',
  inputPlaceholder: '메시지를 입력하세요...',
  sendBtn: '전송',
  endBtn: '오늘은 여기까지',
  chatError: '잠시 연결이 불안정합니다. 다시 말씀해 주세요.',
  saveModalTitle: '오늘의 이야기를 저장합니다.',
  saveModalBody: '이야기는 안전하게 보관됩니다. 언제든 이어서 하실 수 있습니다.',
  saveModalConfirm: '저장하고 나가기',
  saveModalConfirmLoading: '저장 중...',
  saveModalCancel: '계속하기',
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

interface Msg {
  role: 'assistant' | 'user';
  content: string;
  timestamp?: string;
}

export default function InterviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Refs for stable access inside async callbacks (avoids stale closures)
  const messagesRef = useRef<Msg[]>([]);
  const interviewMetaRef = useRef<Interview | null>(null);

  // Keep messagesRef in sync with state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Fetch interview metadata on mount; stored in ref for fallback on Vercel
  useEffect(() => {
    if (!id) return;
    fetch(`/api/create-interview?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Interview | null) => {
        if (data) interviewMetaRef.current = data;
      })
      .catch(() => {});
  }, [id]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      setMessages((prev) => [...prev, { role: 'user', content: userText, timestamp: new Date().toISOString() }]);
    }
    setInput('');
    setStreaming(true);

    let assistantContent = '';
    setMessages((prev) => [...prev, { role: 'assistant', content: '', timestamp: new Date().toISOString() }]);

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

  // First message: AI opens the conversation
  useEffect(() => {
    if (!initialized && id) {
      setInitialized(true);
      sendMessage('');
    }
  }, [id, initialized, sendMessage]);

  const handleSend = () => {
    if (!input.trim() || streaming) return;
    sendMessage(input.trim());
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
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} timestamp={msg.timestamp} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input area */}
      <footer className="flex-shrink-0 border-t border-mist/50 bg-cream pb-6">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-3 px-4 pt-5">
          <MicButton
            onTranscription={(text) => sendMessage(text)}
            disabled={streaming}
          />
          <div className="flex gap-2 w-full mt-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={LABELS.inputPlaceholder}
              disabled={streaming}
              className="flex-1 h-[48px] rounded-[6px] border border-mist bg-warm-white px-4 text-[16px] text-bark placeholder:text-stone focus:outline-none focus:border-amber disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || streaming}
              className="h-[48px] px-4 rounded-[6px] bg-bark text-warm-white text-[15px] font-medium disabled:opacity-40 hover:bg-bark-light transition-colors"
            >
              {LABELS.sendBtn}
            </button>
          </div>
          <button
            onClick={() => setShowEndModal(true)}
            className="mt-1 text-[13px] text-stone/60 hover:text-stone transition-colors"
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
