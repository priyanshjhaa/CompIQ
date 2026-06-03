export default function Loading() {
  return (
    <main className="min-h-screen bg-[#050506] text-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-6 w-28 animate-pulse rounded-md bg-white/10" />
        <div className="mt-10 h-14 w-2/3 animate-pulse rounded-md bg-white/10" />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
              <div className="mt-5 grid gap-3">
                {Array.from({ length: 4 }).map((__, row) => (
                  <div key={row} className="h-9 animate-pulse rounded-md bg-white/[0.05]" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
