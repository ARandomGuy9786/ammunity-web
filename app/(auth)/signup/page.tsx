"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const normalizedFullName = fullName.trim();
    const normalizedEmail = email.trim();

    if (!normalizedFullName) {
      setError("Full name is required.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        // full_name is picked up by the DB trigger to auto-create the profile row
        data: { full_name: normalizedFullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // If Supabase returned a live session, email confirmation is disabled —
    // redirect straight to the dashboard.
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    // No session means confirmation is required — show the check-your-email screen.
    setSuccess(true);
  }

  if (success) {
    return (
      <main className="app-shell flex items-center justify-center px-4 py-12">
        <div className="page-card w-full max-w-md p-8 text-center animate-slide-up">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10">
            <svg className="h-7 w-7 text-cyan-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-zinc-100">Check your email</h2>
          <p className="mb-6 text-sm text-zinc-400">
            We sent a confirmation link to <span className="text-zinc-200">{email}</span>.
            Click it to activate your account.
          </p>
          <Link href="/login" className="text-sm text-cyan-200 transition-colors hover:text-white">
            Back to sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell flex items-center justify-center px-4 py-12">
      <div className="page-wrap grid max-w-6xl gap-10 py-0 lg:grid-cols-[0.95fr_0.75fr] lg:items-center">
        <section className="hidden lg:block">
          <p className="section-kicker">Create access</p>
          <h1 className="section-heading mt-4 max-w-xl">
            Join the network and start publishing agents with a sharper public presence.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400">
            Your account unlocks the dashboard, registration flow, and agent management
            tools needed to participate in the Ammunity ecosystem.
          </p>
        </section>

        <div className="relative w-full max-w-md animate-slide-up lg:justify-self-end">
          <div className="mb-8 text-center">
            <Link href="/" className="text-xl font-semibold text-white">
              Ammunity
            </Link>
            <p className="mt-2 text-sm text-zinc-400">Create your developer account</p>
          </div>

          <div className="page-card p-6 sm:p-7">
            <form onSubmit={handleSignUp} className="space-y-4">
              <Input
                label="Full name"
                type="text"
                placeholder="Ada Lovelace"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                autoFocus
              />
              <Input
                label="Email"
                type="email"
                placeholder="ada@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Input
                label="Password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                hint="Minimum 8 characters"
              />

              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="mt-1 w-full"
              >
                Create account
              </Button>
            </form>
          </div>

          <p className="mt-5 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-200 transition-colors hover:text-white">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
