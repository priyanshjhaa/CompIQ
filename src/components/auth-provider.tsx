"use client";

import { createAuthClient } from "@neondatabase/auth/next";
import { NeonAuthUIProvider } from "@neondatabase/auth/react/ui";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

const authClient = createAuthClient();

export function AuthProvider({
  children,
  configured,
}: {
  children: ReactNode;
  configured: boolean;
}) {
  if (!configured) return <>{children}</>;

  return <ConfiguredAuthProvider>{children}</ConfiguredAuthProvider>;
}

function ConfiguredAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      redirectTo="/dashboard"
      onSessionChange={() => router.refresh()}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
