/**
 * Skeleton loading placeholder components.
 * Usage:
 *   <Skeleton className="h-4 w-32" />
 *   <SkeletonCard />
 *   <SkeletonList rows={5} />
 */

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-gray-200 rounded-lg animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

/** A full card placeholder matching the bg-white card style */
export function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-[var(--radius-card)] p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-xl" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

/** A list of skeleton rows, useful for transaction/stock lists */
export function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-0.5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3 px-2">
          <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

/** Dashboard AssetOverview placeholder */
export function SkeletonAssetCard() {
  return (
    <div className="bg-primary-200/40 rounded-[var(--radius-card)] p-6 animate-pulse">
      <div className="flex justify-between mb-4">
        <Skeleton className="h-4 w-16 bg-primary-300/50" />
        <Skeleton className="h-6 w-12 rounded-full bg-primary-300/50" />
      </div>
      <Skeleton className="h-9 w-48 mb-3 bg-primary-300/50" />
      <Skeleton className="h-2 w-full rounded-full mb-4 bg-primary-300/50" />
      <div className="grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-xl bg-primary-300/40" />
        ))}
      </div>
    </div>
  );
}
