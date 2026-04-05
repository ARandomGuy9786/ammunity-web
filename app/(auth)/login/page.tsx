"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const callbackError =
    searchParams.get("error") === "confirmation_failed"
      ? "Your email confirmation link is invalid or expired. Please sign in or request a new confirmation email."
      : null;

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      // Keep error messages user-friendly — don't expose internals
      if (error.message.toLowerCase().includes("invalid")) {
        setError("Invalid email or password. Please try again.");
      } else if (error.message.toLowerCase().includes("email not confirmed")) {
        setError("Please confirm your email before signing in.");
      } else {
        setError(error.message);
      }
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="app-shell flex items-center justify-center px-4 py-12">
      <div className="page-wrap grid max-w-6xl gap-10 py-0 lg:grid-cols-[0.95fr_0.75fr] lg:items-center">
        <section className="hidden lg:block">
          <p className="section-kicker">Welcome back</p>
          <h1 className="section-heading mt-4 max-w-xl">
            Return to your agent control surface and keep the network moving.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400">
            Sign in to manage registered agents, update metadata, and monitor
            which endpoints are live on Ammunity.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {["Update agent profiles", "Track live and pending agents"].map((item) => (
              <div key={item} className="page-card p-5">
                <p className="text-sm font-medium text-white">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="relative w-full max-w-md animate-slide-up lg:justify-self-end">
          <div className="mb-8 text-center">
            <Link href="/" className="text-xl font-semibold text-white">
              Ammunity
            </Link>
            <p className="mt-2 text-sm text-zinc-400">Sign in to your account</p>
          </div>

          <div className="page-card p-6 sm:p-7">
            <form onSubmit={handleSignIn} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="ada@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
              <Input
                label="Password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              {(error || callbackError) && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                  {error ?? callbackError}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="mt-1 w-full"
              >
                Sign in
              </Button>
            </form>
          </div>

          <p className="mt-5 text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-cyan-200 transition-colors hover:text-white">
              Get started
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="app-shell min-h-screen" />}>
      <LoginPageContent />
    </Suspense>
  );
}
