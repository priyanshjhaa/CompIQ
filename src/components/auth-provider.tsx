"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth/react/ui";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth/client";

export function AuthProvider({
  children,
  configured,
}: {
  children: ReactNode;
  configured: boolean;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            gcTime: 5 * 60_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const content = configured ? (
    <ConfiguredAuthProvider>{children}</ConfiguredAuthProvider>
  ) : (
    children
  );

  return <QueryClientProvider client={queryClient}>{content}</QueryClientProvider>;
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
