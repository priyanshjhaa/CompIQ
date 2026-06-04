"use client";

import { AuthView } from "@neondatabase/auth/react/ui";

export function AuthViewCard({ path }: { path: string }) {
  return (
    <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#090a0d]/90 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <AuthView path={path} />
    </div>
  );
}
