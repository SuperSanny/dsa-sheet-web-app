interface Props {
  className?: string;
}

export function Skeleton({ className = "" }: Props) {
  return <div className={`animate-pulse rounded bg-[#1f2937] ${className}`} />;
}

export function TopicCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#1f2937] bg-[#111827] p-5">
      <div className="flex items-start gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
      <Skeleton className="h-1.5 w-full rounded-full" />
      <div className="flex justify-between mt-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-8" />
      </div>
    </div>
  );
}

export function ProblemRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1f2937]">
      <Skeleton className="w-5 h-5 rounded shrink-0" />
      <Skeleton className="h-4 flex-1 max-w-sm" />
      <Skeleton className="h-5 w-14 rounded-full ml-auto" />
      <div className="flex gap-1.5">
        <Skeleton className="w-7 h-7 rounded" />
        <Skeleton className="w-7 h-7 rounded" />
        <Skeleton className="w-7 h-7 rounded" />
      </div>
    </div>
  );
}
