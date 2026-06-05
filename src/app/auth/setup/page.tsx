import Link from "next/link";

export default function AuthSetupPage() {
  return (
    <main className="app-gradient-flow min-h-screen text-zinc-50">
      <section className="grid min-h-screen w-full place-items-center px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
        <div className="rounded-lg border border-white/10 bg-[#090a0d]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b93ff]">
            Neon Auth setup
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-zinc-50">
            Add Neon Auth env vars to enable protected access.
          </h1>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            CompIQ is wired for Neon Auth. Add the auth base URL from Neon and a secure cookie secret, then restart the dev server.
          </p>
          <div className="mt-5 rounded-md border border-white/10 bg-black/30 p-4 font-mono text-xs leading-6 text-zinc-300">
            <p>NEON_AUTH_BASE_URL=https://your-neon-auth-url</p>
            <p>NEON_AUTH_COOKIE_SECRET=32-plus-character-secret</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="rounded-md border border-white/10 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-white">
              Back to landing
            </Link>
            <Link href="/dashboard" className="rounded-md border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-white/[0.08]">
              Retry dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
