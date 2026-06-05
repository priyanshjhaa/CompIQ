"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function SignOutRedirect() {
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    async function signOut() {
      try {
        await authClient.signOut({
          fetchOptions: {
            throw: true,
          },
        });
        if (!active) return;
        router.replace("/");
        router.refresh();
      } catch (error) {
        console.error("Unable to sign out", error);
        if (active) setFailed(true);
      }
    }

    signOut();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main className="app-gradient-flow min-h-screen text-zinc-50">
      <section className="grid min-h-screen w-full place-items-center px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
        <div className="rounded-lg border border-white/10 bg-[#090a0d]/80 p-6 text-center shadow-2xl shadow-black/25 backdrop-blur-xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b93ff]">
            Session
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-zinc-50">
            {failed ? "Sign out needs another try." : "Signing you out..."}
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-400">
            {failed
              ? "The session could not be cleared automatically. Try the button below or return to the landing page."
              : "You will be returned to the CompIQ landing page."}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            {failed ? (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-md border border-white/10 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-white"
              >
                Try again
              </button>
            ) : null}
            <Link
              href="/"
              className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-white/[0.08]"
            >
              Landing page
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
