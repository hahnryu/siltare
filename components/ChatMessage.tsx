interface ChatMessageProps {
  id?: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp?: string;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const time = d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${month}/${day} ${time}`;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  if (role === 'assistant') {
    return (
      <div className="flex w-full justify-start">
        <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-warm-white border border-mist px-4 py-3 shadow-sm">
          <span className="mb-1.5 block font-serif text-[11px] tracking-wide text-stone">실타래</span>
          <p className="text-[15px] leading-relaxed text-bark">{content}</p>
          {timestamp && (
            <p className="mt-1.5 text-[11px] text-stone/50">{formatDateTime(timestamp)}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-amber/10 px-4 py-3">
        <p className="text-[15px] leading-relaxed text-bark">{content}</p>
        {timestamp && (
          <p className="mt-1.5 text-right text-[11px] text-stone/50">{formatDateTime(timestamp)}</p>
        )}
      </div>
    </div>
  );
}
