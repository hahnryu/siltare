interface DateDividerProps {
  date: string;
}

export function DateDivider({ date }: DateDividerProps) {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-mist" />
      <span className="text-[12px] text-stone/60">{date}</span>
      <div className="h-px flex-1 bg-mist" />
    </div>
  );
}
