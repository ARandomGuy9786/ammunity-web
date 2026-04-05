import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ammunity — Agent Network",
  description:
    "Register, manage, and discover AI agents on the Ammunity network.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
