const RELATIONSHIPS = ['부모님', '스승', '친구'];

interface RelationshipSelectorProps {
  selected: string;
  onChange: (relationship: string) => void;
}

export function RelationshipSelector({ selected, onChange }: RelationshipSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      {RELATIONSHIPS.map((rel) => (
        <button
          key={rel}
          onClick={() => onChange(rel)}
          className={`w-full h-[60px] rounded-[12px] border text-[18px] font-medium transition-all ${
            selected === rel
              ? 'border-amber bg-amber/10 text-bark'
              : 'border-mist bg-warm-white text-bark hover:border-amber/50'
          }`}
        >
          {rel}
        </button>
      ))}
    </div>
  );
}
