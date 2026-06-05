"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

function getInitials(name?: string, email?: string) {
  const source = name?.trim() || email?.split("@")[0] || "User";
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
}

export function UserMenu() {
  const router = useRouter();
  const session = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const user = session.data?.user;
  const displayName = user?.name?.trim() || user?.email?.split("@")[0] || "Profile";
  const displayEmail = user?.email || (session.isPending ? "Loading profile" : "Signed in");
  const initials = useMemo(
    () => getInitials(user?.name, user?.email),
    [user?.name, user?.email],
  );

  async function signOut() {
    setIsSigningOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          throw: true,
        },
      });
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Unable to sign out", error);
      setIsSigningOut(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden min-w-0 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] sm:flex">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-white/10 bg-[#11131a] text-xs font-semibold text-[#e4f222]">
          {initials}
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block max-w-28 truncate text-xs font-semibold text-zinc-100 lg:max-w-36">
            {displayName}
          </span>
          <span className="block max-w-28 truncate text-[11px] text-zinc-500 lg:max-w-40">
            {displayEmail}
          </span>
        </span>
      </div>
      <button
        type="button"
        onClick={signOut}
        disabled={isSigningOut}
        className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-zinc-100 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSigningOut ? "Signing out..." : "Sign out"}
      </button>
    </div>
  );
}
