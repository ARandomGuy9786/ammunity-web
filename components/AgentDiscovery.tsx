"use client";

import { useState, useMemo } from "react";
import type { AgentRecord } from "@/app/agents/page";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function unique(arr: string[]): string[] {
  return Array.from(new Set(arr)).sort();
}

// ─── Agent card ───────────────────────────────────────────────────────────────

function AgentCard({ agent }: { agent: AgentRecord }) {
  const [copied, setCopied] = useState(false);

  function copyEndpoint() {
    navigator.clipboard.writeText(agent.endpoint_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="page-card flex flex-col gap-3 p-5 transition-colors hover:border-white/20">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-zinc-100 truncate">{agent.agent_name}</h3>
          {agent.community && (
            <span className="pill-badge mt-1 border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
              {agent.community}
            </span>
          )}
        </div>
        <span className="pill-badge shrink-0 border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Live
        </span>
      </div>

      <p className="text-sm text-zinc-400 line-clamp-2">{agent.description}</p>

      {agent.capabilities?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {agent.capabilities.map((c) => (
            <span
              key={c}
              className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      {agent.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {agent.skills.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={copyEndpoint}
        title="Click to copy endpoint URL"
        className="group mt-auto flex items-center gap-2 border-t border-white/10 pt-2"
      >
        <span className="text-xs text-zinc-600 font-mono truncate group-hover:text-zinc-400 transition-colors flex-1 text-left">
          {agent.endpoint_url}
        </span>
        <span className="text-xs text-zinc-600 transition-colors group-hover:text-cyan-200 shrink-0">
          {copied ? "Copied!" : "Copy"}
        </span>
      </button>
    </div>
  );
}

// ─── Filter pill ──────────────────────────────────────────────────────────────

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1 text-xs transition-colors",
        active
          ? "border-cyan-300/30 bg-cyan-300 text-[#04111d]"
          : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/25 hover:text-zinc-200",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AgentDiscovery({ agents }: { agents: AgentRecord[] }) {
  const [search, setSearch] = useState("");
  const [activeCapability, setActiveCapability] = useState<string | null>(null);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [activeCommunity, setActiveCommunity] = useState<string | null>(null);

  // Derive unique filter values from all agents
  const allCapabilities = useMemo(
    () => unique(agents.flatMap((a) => a.capabilities ?? [])),
    [agents]
  );
  const allSkills = useMemo(
    () => unique(agents.flatMap((a) => a.skills ?? [])),
    [agents]
  );
  const allCommunities = useMemo(
    () => unique(agents.map((a) => a.community).filter(Boolean) as string[]),
    [agents]
  );

  // Apply filters
  const filtered = useMemo(() => {
    return agents.filter((a) => {
      if (search) {
        const q = search.toLowerCase();
        const nameMatch = a.agent_name.toLowerCase().includes(q);
        const descMatch = a.description?.toLowerCase().includes(q);
        if (!nameMatch && !descMatch) return false;
      }
      if (activeCapability && !(a.capabilities ?? []).includes(activeCapability)) return false;
      if (activeSkill && !(a.skills ?? []).includes(activeSkill)) return false;
      if (activeCommunity && a.community !== activeCommunity) return false;
      return true;
    });
  }, [agents, search, activeCapability, activeSkill, activeCommunity]);

  const hasFilters = search || activeCapability || activeSkill || activeCommunity;

  function clearFilters() {
    setSearch("");
    setActiveCapability(null);
    setActiveSkill(null);
    setActiveCommunity(null);
  }

  if (agents.length === 0) {
    return (
      <div className="page-card p-12 text-center">
        <p className="text-sm text-zinc-500">No agents are live on the network yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="page-card space-y-4 p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search agents by name or description..."
          className="input-surface"
        />

        {allCommunities.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-600 shrink-0">Community</span>
            {allCommunities.map((c) => (
              <FilterPill
                key={c}
                label={c}
                active={activeCommunity === c}
                onClick={() => setActiveCommunity(activeCommunity === c ? null : c)}
              />
            ))}
          </div>
        )}

        {allCapabilities.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-600 shrink-0">Capability</span>
            {allCapabilities.map((c) => (
              <FilterPill
                key={c}
                label={c}
                active={activeCapability === c}
                onClick={() => setActiveCapability(activeCapability === c ? null : c)}
              />
            ))}
          </div>
        )}

        {allSkills.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-600 shrink-0">Skill</span>
            {allSkills.map((s) => (
              <FilterPill
                key={s}
                label={s}
                active={activeSkill === s}
                onClick={() => setActiveSkill(activeSkill === s ? null : s)}
              />
            ))}
          </div>
        )}

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      <p className="text-xs text-zinc-600">
        Showing {filtered.length} of {agents.length} agent{agents.length !== 1 ? "s" : ""}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((agent) => (
            <AgentCard key={agent.agent_id} agent={agent} />
          ))}
        </div>
      ) : (
        <div className="page-card p-10 text-center">
          <p className="text-sm text-zinc-500">No agents match your filters.</p>
          <button
            onClick={clearFilters}
            className="mt-2 text-sm text-cyan-200 transition-colors hover:text-white"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
