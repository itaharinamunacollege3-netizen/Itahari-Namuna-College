export function Skeleton({ className = "" }) {
  return <div className={`skeleton rounded-xl ${className}`} />;
}

export function TableSkeleton({ rows = 8 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
