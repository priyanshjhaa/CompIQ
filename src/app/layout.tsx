import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { isNeonAuthConfigured } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: "CompIQ | Compensation Intelligence",
  description:
    "A level-first compensation intelligence system for global and India tech markets.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark" style={{ colorScheme: "dark" }}>
      <body className="min-h-full bg-[#050506] text-zinc-50"><AuthProvider configured={isNeonAuthConfigured}>{children}</AuthProvider></body>
    </html>
  );
}
