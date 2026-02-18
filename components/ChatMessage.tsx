interface ChatMessageProps {
  role: 'assistant' | 'user';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  if (role === 'assistant') {
    return (
      <div className="flex gap-3 items-start">
        <div className="w-8 h-8 rounded-full bg-warm-white border border-mist flex items-center justify-center text-[14px] shrink-0 mt-1">
          🧵
        </div>
        <div className="max-w-[80%] rounded-[12px] bg-warm-white border border-mist px-4 py-3 text-[16px] text-bark leading-[1.8]">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-[12px] bg-amber/10 border border-amber/20 px-4 py-3 text-[16px] text-bark leading-[1.8]">
        {content}
      </div>
    </div>
  );
}
