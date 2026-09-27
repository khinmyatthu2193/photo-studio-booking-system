export default function AdminDashboardLoading() {
  return (
    <div aria-label="Loading dashboard" aria-live="polite">
      <div className="h-4 w-32 animate-pulse bg-peach" />
      <div className="mt-4 h-11 w-64 animate-pulse bg-peach" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[1, 2, 3, 4, 5].map((item) => (
          <div className="h-36 animate-pulse border border-line bg-surface" key={item} />
        ))}
      </div>
    </div>
  );
}
