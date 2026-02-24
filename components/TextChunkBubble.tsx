'use client';

import { useState, useRef, useEffect } from 'react';

interface TextChunkBubbleProps {
  id: string;
  text: string;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}

export function TextChunkBubble({ id, text, onEdit, onDelete }: TextChunkBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== text) {
      onEdit(id, trimmed);
    } else {
      setEditValue(text);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(text);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex w-full justify-end">
        <div className="flex max-w-[85%] flex-col gap-2">
          <div className="rounded-2xl rounded-tr-md bg-amber/10 border border-amber p-3">
            <textarea
              ref={textareaRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                } else if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
              className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-bark outline-none"
              rows={3}
            />
            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                onClick={handleCancel}
                className="h-8 px-3 rounded-md text-[13px] text-stone transition-colors hover:bg-stone/10 active:scale-95"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="h-8 px-3 rounded-md bg-amber text-warm-white text-[13px] font-medium transition-colors hover:bg-amber/90 active:scale-95"
              >
                완료
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-end">
      <div className="flex max-w-[85%] flex-col">
        <div
          className="group relative rounded-2xl rounded-tr-md bg-amber/10 px-4 py-3 cursor-pointer transition-colors hover:bg-amber/15"
          onClick={() => setIsEditing(true)}
        >
          <p className="text-[15px] leading-relaxed text-bark pr-8">{text}</p>

          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-stone/40 opacity-0 transition-all group-hover:opacity-100 hover:bg-stone/10 hover:text-stone active:scale-95"
            aria-label="삭제"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4L12 12M12 4L4 12" />
            </svg>
          </button>
        </div>

        <p className="mt-1 px-2 text-[10px] text-stone/50">탭하여 수정</p>
      </div>
    </div>
  );
}
