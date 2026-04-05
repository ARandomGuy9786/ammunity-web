"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TagInput } from "@/components/ui/TagInput";
import { normalizeAgentForm, validateAgentForm } from "@/lib/agentValidation";

interface Agent {
  agent_id: string;
  agent_name: string;
  description: string | null;
  endpoint_url: string;
  approved: boolean;
  registered_at: string;
  community: string | null;
  capabilities: string[];
  skills: string[];
}

export function AgentManageForm({ agent }: { agent: Agent }) {
  const router = useRouter();
  const supabase = createClient();

  const [agentName, setAgentName]       = useState(agent.agent_name);
  const [description, setDescription]   = useState(agent.description ?? "");
  const [endpointUrl, setEndpointUrl]   = useState(agent.endpoint_url);
  const [capabilities, setCapabilities] = useState<string[]>(agent.capabilities ?? []);
  const [skills, setSkills]             = useState<string[]>(agent.skills ?? []);
  const [community, setCommunity]       = useState(agent.community ?? "");

  const [saving, setSaving]         = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [saveError, setSaveError]   = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);

    const validationError = validateAgentForm({
      agentName,
      description,
      endpointUrl,
      capabilities,
      skills,
      community,
    });

    if (validationError) {
      setSaveError(validationError);
      return;
    }

    setSaving(true);

    const payload = normalizeAgentForm({
      agentName,
      description,
      endpointUrl,
      capabilities,
      skills,
      community,
    });

    const { error } = await supabase
      .from("agents")
      .update({
        agent_name: payload.agent_name,
        description: payload.description,
        endpoint_url: payload.endpoint_url,
        capabilities: payload.capabilities,
        skills: payload.skills,
        community: payload.community || null,
      })
      .eq("agent_id", agent.agent_id);

    setSaving(false);

    if (error) {
      setSaveError(error.message);
    } else {
      setSaveSuccess(true);
      router.refresh();
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  }

  async function handleDeactivate() {
    if (!confirm("Deactivate this agent? It will be removed from the network until reactivated by an admin.")) return;

    setDeactivating(true);

    const { error } = await supabase
      .from("agents")
      .update({ approved: false })
      .eq("agent_id", agent.agent_id);

    setDeactivating(false);

    if (error) {
      setSaveError(error.message);
    } else {
      router.push("/dashboard?deactivated=1");
      router.refresh();
    }
  }

  return (
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

      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <p className="section-kicker">Manage agent</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-zinc-100">
            {agent.agent_name}
          </h1>
          <p className="mt-2 font-mono text-xs text-zinc-600">{agent.agent_id}</p>
        </div>

        {agent.approved ? (
          <span className="pill-badge shrink-0 border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Live
          </span>
        ) : (
          <span className="pill-badge shrink-0 border-amber-400/20 bg-amber-400/10 text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Pending approval
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="page-card space-y-4 p-6">
          <h2 className="text-sm font-medium text-zinc-300">Agent details</h2>

          <Input
            label="Agent name"
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            required
            minLength={3}
            maxLength={50}
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
              className="textarea-surface"
            />
            <p className="text-xs text-zinc-500">{description.length}/500</p>
          </div>

          <Input
            label="Endpoint URL"
            type="url"
            value={endpointUrl}
            onChange={(e) => setEndpointUrl(e.target.value)}
            required
          />
        </div>

        <div className="page-card space-y-4 p-6">
          <h2 className="text-sm font-medium text-zinc-300">Capabilities &amp; skills</h2>
          <TagInput label="Capabilities" tags={capabilities} onChange={setCapabilities} max={20} />
          <TagInput label="Skills" tags={skills} onChange={setSkills} max={20} />
        </div>

        <div className="page-card p-6">
          <h2 className="text-sm font-medium text-zinc-300 mb-4">
            Community
            <span className="text-zinc-600 font-normal ml-1">optional</span>
          </h2>
          <Input
            label="Community name"
            type="text"
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
            maxLength={100}
            hint="Changing community requires re-approval from the new community's admins."
          />
        </div>

        {saveError && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {saveError}
          </div>
        )}
        {saveSuccess && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            Changes saved successfully.
          </div>
        )}

        <div className="flex items-center justify-between gap-4 pt-2">
          <Button
            type="button"
            variant="danger"
            size="md"
            loading={deactivating}
            onClick={handleDeactivate}
            disabled={!agent.approved}
          >
            Deactivate agent
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={saving}
          >
            Save changes
          </Button>
        </div>
      </form>
    </main>
  );
}
