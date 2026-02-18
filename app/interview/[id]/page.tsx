'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChatMessage } from '@/components/ChatMessage';
import { MicButton } from '@/components/MicButton';

const LABELS = {
  logo: '🧵 실타래',
  inputPlaceholder: '메시지를 입력하세요...',
  sendBtn: '전송',
  endBtn: '오늘은 여기까지',
  chatError: '잠시 연결이 불안정합니다. 다시 말씀해 주세요.',
  saveModalTitle: '오늘의 이야기를 저장합니다.',
  saveModalBody: '이야기는 안전하게 보관됩니다. 언제든 이어서 하실 수 있습니다.',
  saveModalConfirm: '저장하고 나가기',
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
}

export default function InterviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const sendMessage = useCallback(async (userText: string) => {
    if (streaming) return;

    if (userText.trim()) {
      setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    }
    setInput('');
    setStreaming(true);

    let assistantContent = '';
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewId: id, message: userText }),
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
                  next[next.length - 1] = { role: 'assistant', content: assistantContent };
                  return next;
                });
              }
            } catch {
              // skip
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

  const handleEnd = () => {
    setShowEndModal(false);
    router.push(`/interview/${id}/complete`);
  };

  return (
    <div className="flex flex-col min-h-dvh bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-cream/90 backdrop-blur border-b border-mist px-4 py-3 flex items-center justify-between">
        <span className="font-serif text-[14px] text-bark">{LABELS.logo}</span>
        <span className="text-[13px] text-stone font-mono">{formatTime(elapsed)}</span>
        <button
          onClick={() => setShowEndModal(true)}
          className="text-[13px] text-stone border border-mist rounded-[6px] px-3 py-1.5 hover:bg-mist-light transition-colors"
        >
          {LABELS.endBtn}
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4 max-w-[520px] mx-auto w-full">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Input area */}
      <div className="sticky bottom-0 bg-cream border-t border-mist px-4 py-4">
        <div className="max-w-[520px] mx-auto flex flex-col items-center gap-4">
          <MicButton
            onTranscription={(text) => sendMessage(text)}
            disabled={streaming}
          />
          <div className="flex gap-2 w-full">
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
        </div>
      </div>

      {/* End modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-bark/40 px-4 pb-8">
          <div className="w-full max-w-[480px] rounded-[12px] bg-warm-white p-6 shadow-xl">
            <h2 className="font-serif text-[20px] font-bold text-bark mb-2">{LABELS.saveModalTitle}</h2>
            <p className="text-[15px] text-stone leading-relaxed mb-6">{LABELS.saveModalBody}</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleEnd}
                className="w-full h-[52px] rounded-[6px] bg-bark text-warm-white text-[16px] font-medium hover:bg-bark-light transition-colors"
              >
                {LABELS.saveModalConfirm}
              </button>
              <button
                onClick={() => setShowEndModal(false)}
                className="w-full h-[44px] rounded-[6px] border border-mist text-bark text-[15px] hover:bg-mist-light transition-colors"
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
