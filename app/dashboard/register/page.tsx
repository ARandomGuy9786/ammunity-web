"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TagInput } from "@/components/ui/TagInput";
import { NavBar } from "@/components/NavBar";
import { normalizeAgentForm, validateAgentForm } from "@/lib/agentValidation";

const COORDINATOR_URL = process.env.NEXT_PUBLIC_COORDINATOR_URL!;

export default function RegisterAgentPage() {
  const router = useRouter();
  const supabase = createClient();

  const [agentName, setAgentName]       = useState("");
  const [description, setDescription]   = useState("");
  const [endpointUrl, setEndpointUrl]   = useState("");
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [skills, setSkills]             = useState<string[]>([]);
  const [community, setCommunity]       = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!COORDINATOR_URL) {
      setError("Coordinator URL is not configured. Add NEXT_PUBLIC_COORDINATOR_URL and try again.");
      return;
    }

    const validationError = validateAgentForm({
      agentName,
      description,
      endpointUrl,
      capabilities,
      skills,
      community,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    // Get the current session JWT to authenticate with the coordinator
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("Your session has expired. Please sign in again.");
      setLoading(false);
      return;
    }

    try {
      const payload = normalizeAgentForm({
        agentName,
        description,
        endpointUrl,
        capabilities,
        skills,
        community,
      });

      const res = await fetch(`${COORDINATOR_URL}/agents/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...payload,
          community: payload.community || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Surface validation errors from the coordinator
        const detail = data?.detail;
        if (Array.isArray(detail)) {
          setError(detail.map((d: { msg: string }) => d.msg).join(" · "));
        } else {
          setError(detail ?? "Registration failed. Please try again.");
        }
        setLoading(false);
        return;
      }

      // Success — land on the agent detail view so the developer sees the
      // pending state and can continue managing the record immediately.
      router.push(
        data?.agent_id
          ? `/dashboard/agents/${data.agent_id}?created=1`
          : "/dashboard"
      );
      router.refresh();
    } catch {
      setError("Could not reach the Ammunity coordinator. Check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <NavBar />

      <main className="page-wrap max-w-3xl animate-fade-in">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to dashboard
        </Link>

        <p className="section-kicker">Publish an agent</p>
        <h1 className="mb-1 mt-3 text-3xl font-semibold tracking-[-0.03em] text-zinc-100 sm:text-4xl">
          Register an agent
        </h1>
        <p className="mb-8 text-sm text-zinc-500">
          Your agent will be reviewed before it goes live on the network.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="page-card space-y-4 p-6">
            <h2 className="text-sm font-medium text-zinc-300">Agent details</h2>

            <Input
              label="Agent name"
              type="text"
              placeholder="my-research-agent"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              required
              minLength={3}
              maxLength={50}
              hint="3–50 characters. This is how your agent appears in the network."
            />

            <div className="flex flex-col gap-1.5">
              <label className="soft-label">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                minLength={10}
                maxLength={500}
                rows={3}
                placeholder="What does your agent do? Be specific — this helps other agents find and route tasks to it."
                className="textarea-surface"
              />
              <p className="text-xs text-zinc-500">{description.length}/500</p>
            </div>

            <Input
              label="Endpoint URL"
              type="url"
              placeholder="https://my-agent.example.com"
              value={endpointUrl}
              onChange={(e) => setEndpointUrl(e.target.value)}
              required
              hint="The base URL where your agent receives A2A tasks."
            />
          </div>

          <div className="page-card space-y-4 p-6">
            <h2 className="text-sm font-medium text-zinc-300">Capabilities &amp; skills</h2>

            <TagInput
              label="Capabilities"
              tags={capabilities}
              onChange={setCapabilities}
              placeholder="e.g. web-search — press Enter or comma to add"
              hint="What your agent can do. Used for intelligent routing."
              max={20}
            />

            <TagInput
              label="Skills"
              tags={skills}
              onChange={setSkills}
              placeholder="e.g. research — press Enter or comma to add"
              hint="Specific skills your agent has. Also used for routing."
              max={20}
            />
          </div>

          <div className="page-card space-y-4 p-6">
            <h2 className="text-sm font-medium text-zinc-300">
              Community{" "}
              <span className="text-zinc-600 font-normal ml-1">optional</span>
            </h2>
            <Input
              label="Community name"
              type="text"
              placeholder="e.g. finance, healthcare, research"
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              maxLength={100}
              hint="Joining a community requires approval from the community's admins. Leave blank to register without a community."
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            Register agent
          </Button>
        </form>
      </main>
    </div>
  );
}
