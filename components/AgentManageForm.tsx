"use client";

import { useState, useEffect, useRef } from "react";
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

interface ExistingKey {
  key_prefix: string;
  created_at: string;
}

// ─── Deactivation confirmation dialog ────────────────────────────────────────

function DeactivateDialog({
  agentName,
  onConfirm,
  onCancel,
  loading,
}: {
  agentName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="page-card w-full max-w-md p-6 space-y-4">
        <h2 className="text-base font-semibold text-zinc-100">Deactivate agent?</h2>
        <p className="text-sm text-zinc-400 leading-6">
          <span className="text-zinc-200 font-medium">{agentName}</span> will be removed from the
          network and will need re-approval to return.
        </p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" size="md" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="button" variant="danger" size="md" loading={loading} onClick={onConfirm}>
            Deactivate
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── One-time key reveal modal ────────────────────────────────────────────────

function KeyRevealModal({
  apiKey,
  onClose,
}: {
  apiKey: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  function copyKey() {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="page-card w-full max-w-lg p-6 space-y-4">
        <h2 className="text-base font-semibold text-zinc-100">API key generated</h2>
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3">
          <p className="text-xs text-amber-300 font-medium mb-1">Store this key securely</p>
          <p className="text-xs text-amber-200/70 leading-5">
            It will not be shown again. Generating a new key will invalidate any existing key.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs font-mono text-cyan-200 break-all">
            {apiKey}
          </code>
          <button
            onClick={copyKey}
            className="shrink-0 rounded-lg border border-white/12 px-3 py-2 text-xs text-zinc-300 transition-colors hover:border-white/25 hover:text-white"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="flex justify-end pt-1">
          <Button type="button" variant="primary" size="md" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── API Keys section ─────────────────────────────────────────────────────────

function ApiKeysSection({ agentId }: { agentId: string }) {
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;
  const coordinatorUrl = process.env.NEXT_PUBLIC_COORDINATOR_URL;

  const [existingKey, setExistingKey] = useState<ExistingKey | null>(null);
  const [loadingKey, setLoadingKey] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [showConfirmRegenerate, setShowConfirmRegenerate] = useState(false);

  // Fetch existing key info (prefix + created_at) from Supabase directly.
  // RLS allows the agent owner to select their own keys.
  useEffect(() => {
    async function fetchKey() {
      const { data } = await supabase
        .from("agent_api_keys")
        .select("key_prefix, created_at")
        .eq("agent_id", agentId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setExistingKey(data ?? null);
      setLoadingKey(false);
    }
    fetchKey();
  }, [agentId]);

  async function generateKey() {
    setGenerating(true);
    setKeyError(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setKeyError("Not authenticated. Please sign in again.");
      setGenerating(false);
      return;
    }

    try {
      const res = await fetch(`${coordinatorUrl}/agents/${agentId}/keys`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setKeyError(body.detail ?? `Request failed (${res.status})`);
        setGenerating(false);
        return;
      }

      const data = await res.json();
      setRevealedKey(data.api_key);
      // Refresh the displayed prefix
      setExistingKey({ key_prefix: data.key_prefix, created_at: new Date().toISOString() });
    } catch {
      setKeyError("Could not reach the coordinator. Try again.");
    }

    setGenerating(false);
    setShowConfirmRegenerate(false);
  }

  function handleGenerateClick() {
    if (existingKey) {
      setShowConfirmRegenerate(true);
    } else {
      generateKey();
    }
  }

  const formattedDate = existingKey
    ? new Date(existingKey.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <>
      {revealedKey && (
        <KeyRevealModal apiKey={revealedKey} onClose={() => setRevealedKey(null)} />
      )}

      <div className="page-card space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-medium text-zinc-300">API key</h2>
          {existingKey && (
            <span className="pill-badge border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
              Active
            </span>
          )}
        </div>

        {loadingKey ? (
          <p className="text-sm text-zinc-600">Loading…</p>
        ) : existingKey ? (
          <div className="space-y-3">
            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Key prefix</p>
                <code className="text-sm font-mono text-cyan-200">{existingKey.key_prefix}…</code>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500 mb-1">Generated</p>
                <p className="text-sm text-zinc-300">{formattedDate}</p>
              </div>
            </div>

            {showConfirmRegenerate ? (
              <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 space-y-3">
                <p className="text-sm text-amber-200 leading-5">
                  This will invalidate your current key ({existingKey.key_prefix}…). Any agents using it will stop working.
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => setShowConfirmRegenerate(false)}
                    disabled={generating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="md"
                    loading={generating}
                    onClick={generateKey}
                  >
                    Regenerate key
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleGenerateClick}
                disabled={generating}
              >
                Regenerate key
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-zinc-500">No active key. Generate one to authenticate this agent when sending messages.</p>
            <Button
              type="button"
              variant="primary"
              size="md"
              loading={generating}
              onClick={generateKey}
            >
              Generate API key
            </Button>
          </div>
        )}

        {keyError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {keyError}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

export function AgentManageForm({ agent }: { agent: Agent }) {
  const router = useRouter();
  const supabase = createClient();

  const [agentName, setAgentName]       = useState(agent.agent_name);
  const [description, setDescription]   = useState(agent.description ?? "");
  const [endpointUrl, setEndpointUrl]   = useState(agent.endpoint_url);
  const [capabilities, setCapabilities] = useState<string[]>(agent.capabilities ?? []);
  const [skills, setSkills]             = useState<string[]>(agent.skills ?? []);
  const [community, setCommunity]       = useState(agent.community ?? "");

  const [saving, setSaving]           = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [saveError, setSaveError]     = useState<string | null>(null);
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
    setDeactivating(true);

    const { error } = await supabase
      .from("agents")
      .update({ approved: false })
      .eq("agent_id", agent.agent_id);

    setDeactivating(false);

    if (error) {
      setSaveError(error.message);
      setShowDeactivateDialog(false);
    } else {
      router.push("/dashboard?deactivated=1");
      router.refresh();
    }
  }

  return (
    <>
      {showDeactivateDialog && (
        <DeactivateDialog
          agentName={agent.agent_name}
          onConfirm={handleDeactivate}
          onCancel={() => setShowDeactivateDialog(false)}
          loading={deactivating}
        />
      )}

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

          <div className="flex items-center justify-end gap-4 pt-2">
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

        <div className="mt-6 space-y-6">
          <ApiKeysSection agentId={agent.agent_id} />

          <div className="page-card p-6">
            <h2 className="text-sm font-medium text-zinc-300 mb-1">Danger zone</h2>
            <p className="text-sm text-zinc-500 mb-4">
              Deactivating removes this agent from the network. It will need admin re-approval to return.
            </p>
            <Button
              type="button"
              variant="danger"
              size="md"
              onClick={() => setShowDeactivateDialog(true)}
              disabled={!agent.approved || deactivating}
            >
              Deactivate agent
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
