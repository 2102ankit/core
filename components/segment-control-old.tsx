function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { id: T | undefined; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5"
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.label}
            onClick={() => opt.id !== undefined && onChange(opt.id as T)}
            aria-pressed={active}
            className={`px-3.5 py-1.5 text-caption font-medium rounded-md transition-fast ${
              active
                ? "bg-background text-foreground shadow-elevation-1"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}




export default SegmentedControl;
