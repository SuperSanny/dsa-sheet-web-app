interface Props {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: Props) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div>
      <div className="flex justify-between text-xs text-[#9ca3af] mb-1.5">
        <span>
          {completed}/{total} solved
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#6366f1] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
