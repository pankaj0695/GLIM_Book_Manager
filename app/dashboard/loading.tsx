export default function DashboardLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="animate-pulse space-y-5 sm:space-y-6">
        <div className="brut h-11 w-48 bg-paper" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="brut shadow-brut h-20 bg-paper" />
          ))}
        </div>
        <div className="brut shadow-brut h-28 bg-paper" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="brut shadow-brut h-56 bg-paper" />
          ))}
        </div>
      </div>
    </main>
  );
}
