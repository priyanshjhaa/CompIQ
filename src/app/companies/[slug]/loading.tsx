export default function CompanyLoading() {
  return (
    <main className="min-h-screen bg-[#050506] text-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-5 w-32 animate-pulse rounded-md bg-white/10" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <div className="h-12 w-48 animate-pulse rounded-md bg-white/10" />
            <div className="mt-5 h-20 w-full max-w-2xl animate-pulse rounded-md bg-white/[0.06]" />
          </div>
          <div className="grid gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-lg border border-white/10 bg-white/[0.035]" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
