export function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-[1240px] space-y-6">
      <div className="h-64 animate-pulse rounded-[24px] bg-background-secondary" />
      <div className="h-48 animate-pulse rounded-[24px] bg-background-secondary" />
      <div className="h-64 animate-pulse rounded-[24px] bg-background-secondary" />
      <div className="h-12 animate-pulse rounded-pill bg-background-secondary" />
      <div className="h-72 animate-pulse rounded-[24px] bg-background-secondary" />
      <div className="h-96 animate-pulse rounded-[24px] bg-background-secondary" />
    </div>
  );
}
