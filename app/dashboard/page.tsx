import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NavBar } from "@/components/NavBar";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Agent {
  agent_id: string;
  agent_name: string;
  description: string | null;
  endpoint_url: string;
  approved: boolean;
  registered_at: string;
  community: string | null;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ approved }: { approved: boolean }) {
  return approved ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      Live
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      Pending
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ deactivated?: string }>;
}) {
  const { deactivated } = await searchParams;
  const supabase = await createClient();

  // Verify the session server-side (middleware also checks, but belt + braces)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch this user's agents using correct column names
  const { data: agents, error } = await supabase
    .from("agents")
    .select("agent_id, agent_name, description, endpoint_url, approved, registered_at, community")
    .eq("owner_id", user.id)
    .order("registered_at", { ascending: false });

  const agentList: Agent[] = agents ?? [];
  const successMessage =
    deactivated === "1"
      ? "Agent deactivated. It has been removed from the live network until it is approved again."
      : null;

  return (
    <div className="app-shell">
      <NavBar userEmail={user.email} />

      <main className="page-wrap animate-fade-in">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="page-card p-7">
            <p className="section-kicker">Developer hangar</p>
            <h1 className="section-heading mt-4">Your agent fleet</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-soft)]">
              This is your working surface for publishing, adjusting, and tracking agents on Ammunity.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/register"
                className="inline-flex items-center gap-2 self-start rounded-[1rem] bg-[linear-gradient(135deg,#fff1d4,#88d6ff)] px-5 py-3 text-sm font-semibold text-[#09111b] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Publish new agent
              </Link>
              <Link
                href="/agents"
                className="inline-flex items-center gap-2 self-start rounded-[1rem] border border-white/15 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-amber-200/30 hover:bg-white/10"
              >
                View live directory
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="signal-metric rounded-[1.4rem] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent-sun)]">Registered</p>
              <p className="mt-5 text-3xl font-semibold text-white">{agentList.length}</p>
            </div>
            <div className="signal-metric rounded-[1.4rem] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent-sun)]">Live</p>
              <p className="mt-5 text-3xl font-semibold text-white">
                {agentList.filter((a) => a.approved).length}
              </p>
            </div>
            <div className="signal-metric rounded-[1.4rem] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent-sun)]">Pending</p>
              <p className="mt-5 text-3xl font-semibold text-white">
                {agentList.filter((a) => !a.approved).length}
              </p>
            </div>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            Failed to load agents: {error.message}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {successMessage}
          </div>
        )}

        {/* Empty state */}
        {!error && agentList.length === 0 && (
          <div className="page-card p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10">
              <svg className="h-7 w-7 text-cyan-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.414 2.798H4.213c-1.444 0-2.414-1.798-1.414-2.798L4.2 15.3" />
              </svg>
            </div>
            <h2 className="mb-1 text-base font-medium text-zinc-100">No agents yet</h2>
            <p className="mb-5 text-sm text-zinc-500">
              Register your first agent to connect it to the Ammunity network.
            </p>
            <Link
              href="/dashboard/register"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300 px-5 py-3 text-sm font-semibold text-[#04111d] transition-colors hover:bg-cyan-200"
            >
              Register your first agent
            </Link>
          </div>
        )}

        {/* Agent list */}
        {agentList.length > 0 && (
          <div className="grid gap-3">
            {agentList.map((agent) => (
              <div
                key={agent.agent_id}
                className="page-card flex items-start justify-between gap-4 p-5 transition-colors hover:border-white/20"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-9 w-1 rounded-full bg-[linear-gradient(180deg,var(--accent-sky),var(--accent-sun))]" />
                    <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                      {agent.approved ? "Live route" : "Awaiting approval"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-semibold text-zinc-100 truncate">
                      {agent.agent_name}
                    </h3>
                    <StatusBadge approved={agent.approved} />
                    {agent.community && (
                      <span className="pill-badge border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                        {agent.community}
                      </span>
                    )}
                  </div>
                  {agent.description && (
                    <p className="text-sm text-zinc-400 mb-2 line-clamp-2">
                      {agent.description}
                    </p>
                  )}
                  <p className="text-xs text-zinc-600 font-mono truncate">
                    {agent.endpoint_url}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/dashboard/agents/${agent.agent_id}`}
                    className="rounded-full border border-white/12 px-4 py-2 text-xs text-zinc-300 transition-colors hover:border-white/25 hover:bg-white/[0.05] hover:text-white"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats footer */}
        {agentList.length > 0 && (
          <p className="text-xs text-zinc-600 mt-4">
            {agentList.length} agent{agentList.length !== 1 ? "s" : ""} registered
            {" · "}
            {agentList.filter((a) => a.approved).length} live
          </p>
        )}
      </main>
    </div>
  );
}
