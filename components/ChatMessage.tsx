interface ChatMessageProps {
  role: 'assistant' | 'user';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  if (role === 'assistant') {
    return (
      <div className="flex w-full justify-start">
        <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-warm-white border border-mist px-4 py-3 shadow-sm">
          <span className="mb-1.5 block font-serif text-[11px] tracking-wide text-stone">실타래</span>
          <p className="text-[15px] leading-relaxed text-bark">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-amber/10 px-4 py-3">
        <p className="text-[15px] leading-relaxed text-bark">{content}</p>
      </div>
    </div>
  );
}
