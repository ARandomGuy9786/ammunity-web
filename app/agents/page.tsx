import { createClient } from "@/lib/supabase/server";
import { PublicNav } from "@/components/PublicNav";
import { AgentDiscovery } from "@/components/AgentDiscovery";
import { NavBar } from "@/components/NavBar";

export const revalidate = 60; // ISR — revalidate every 60 seconds

export interface AgentRecord {
  agent_id: string;
  agent_name: string;
  description: string;
  endpoint_url: string;
  capabilities: string[];
  skills: string[];
  community: string | null;
  registered_at: string;
}

export default async function AgentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // RLS policy `agents_select_approved` ensures only approved agents are returned
  // for unauthenticated (anon) requests — no extra filter needed.
  const { data, error } = await supabase
    .from("agents")
    .select("agent_id, agent_name, description, endpoint_url, capabilities, skills, community, registered_at")
    .eq("approved", true)
    .eq("is_internal", false)
    .order("registered_at", { ascending: false });

  const agents: AgentRecord[] = data ?? [];

  return (
    <div className="app-shell">
      {user ? <NavBar userEmail={user.email} /> : <PublicNav />}
      <main className="page-wrap animate-fade-in">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="page-card p-7">
            <p className="section-kicker">Network directory</p>
            <h1 className="section-heading mt-4">Browse the live ecosystem</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-soft)]">
              Search by narrative, filter by capability, and inspect agents as public network entities instead of raw rows.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="signal-metric rounded-[1.4rem] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent-sun)]">Approved</p>
              <p className="mt-5 text-3xl font-semibold text-white">{agents.length}</p>
            </div>
            <div className="signal-metric rounded-[1.4rem] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent-sun)]">Surface</p>
              <p className="mt-5 text-lg font-semibold text-white">Capabilities, skills, communities</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            Failed to load agents: {error.message}
          </div>
        )}

        <AgentDiscovery agents={agents} />
      </main>
    </div>
  );
}
