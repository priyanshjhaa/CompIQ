import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CompIQ | Compensation Intelligence",
  description:
    "A level-first compensation intelligence system for global and India tech markets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#050506] text-zinc-50">{children}</body>
    </html>
  );
}
