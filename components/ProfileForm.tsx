"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ProfileFormProps {
  profile: {
    id: string;
    full_name: string;
    organisation: string | null;
    website: string | null;
  };
  email: string;
}

export function ProfileForm({ profile, email }: ProfileFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState(profile.full_name);
  const [organisation, setOrganisation] = useState(profile.organisation ?? "");
  const [website, setWebsite] = useState(profile.website ?? "");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const normalizedName = fullName.trim();
    const normalizedOrganisation = organisation.trim();
    const normalizedWebsite = website.trim();

    if (!normalizedName) {
      setError("Full name is required.");
      return;
    }

    if (
      normalizedWebsite &&
      !normalizedWebsite.startsWith("http://") &&
      !normalizedWebsite.startsWith("https://")
    ) {
      setError("Website must start with http:// or https://.");
      return;
    }

    setSaving(true);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: normalizedName,
        organisation: normalizedOrganisation || null,
        website: normalizedWebsite || null,
      })
      .eq("id", profile.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess("Profile updated successfully.");
    router.refresh();
  }

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <main className="page-wrap max-w-3xl animate-fade-in">
      <p className="section-kicker">Account</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-zinc-100 sm:text-4xl">
        Your profile
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Update how you appear across Ammunity and manage your session here.
      </p>

      <div className="mt-8 space-y-6">
        <div className="page-card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-lg font-semibold text-cyan-100">
              {fullName.trim().charAt(0).toUpperCase() || email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-medium text-zinc-100">{fullName || "Developer profile"}</h2>
              <p className="mt-1 text-sm text-zinc-500">{email}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="page-card space-y-4 p-6">
            <h2 className="text-sm font-medium text-zinc-300">Profile details</h2>

            <Input
              label="Full name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
            />

            <Input
              label="Email"
              type="email"
              value={email}
              disabled
              hint="Email cannot be changed here."
            />

            <Input
              label="Organisation"
              type="text"
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              placeholder="Optional"
              autoComplete="organization"
            />

            <Input
              label="Website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://your-site.com"
              hint="Optional. Used for your public developer profile."
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              {success}
            </div>
          )}

          <div className="page-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-medium text-zinc-200">Session</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Sign out from this browser when you are done managing your agents.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" variant="primary" size="md" loading={saving}>
                Save profile
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="md"
                loading={signingOut}
                onClick={handleSignOut}
              >
                Sign out
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
