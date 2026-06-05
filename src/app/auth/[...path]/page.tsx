import Link from "next/link";
import { AuthViewCard } from "@/components/auth-view-card";
import { isNeonAuthConfigured } from "@/lib/auth/server";

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path = ["sign-in"] } = await params;
  const authPath = path.join("/") || "sign-in";

  if (!isNeonAuthConfigured) {
    return (
      <main className="app-gradient-flow min-h-screen text-zinc-50">
        <section className="grid min-h-screen w-full place-items-center px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
          <div className="rounded-lg border border-white/10 bg-[#090a0d]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b93ff]">Neon Auth</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-zinc-50">Auth is wired, env vars are next.</h1>
            <p className="mt-4 text-sm leading-6 text-zinc-400">Add NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET to use sign in and sign up.</p>
            <Link href="/auth/setup" className="mt-6 inline-flex rounded-md border border-white/10 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-white">
              View setup details
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-gradient-flow min-h-screen text-zinc-50">
      <section className="grid min-h-screen w-full gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 xl:px-10">
        <div className="flex flex-col justify-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md border border-white/10 bg-white/[0.06] text-xs font-semibold text-[#e4f222]">C</span>
            <span className="text-sm font-semibold text-zinc-100">CompIQ</span>
          </Link>
          <p className="mt-10 inline-flex w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-400">
            Neon Auth protected workspace
          </p>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.04] tracking-[-0.02em] text-zinc-50 sm:text-5xl">
            Sign in to compare compensation with database-backed intelligence.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">
            Your workspace opens the salary explorer, company bands, comparison workflow, and salary submission tools.
          </p>
        </div>
        <div className="flex items-center justify-center lg:justify-end">
          <AuthViewCard path={authPath} />
        </div>
      </section>
    </main>
  );
}
