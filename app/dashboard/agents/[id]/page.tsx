import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NavBar } from "@/components/NavBar";
import { AgentManageForm } from "@/components/AgentManageForm";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ManageAgentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch the agent — RLS ensures only the owner can see unapproved agents
  const { data: agent, error } = await supabase
    .from("agents")
    .select("agent_id, agent_name, description, endpoint_url, approved, registered_at, community, capabilities, skills")
    .eq("agent_id", id)
    .eq("owner_id", user.id)
    .single();

  if (error || !agent) notFound();

  return (
    <div className="app-shell">
      <NavBar userEmail={user.email} />
      {created === "1" && (
        <div className="page-wrap pb-0">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            Agent registered successfully. It is now pending admin approval.
          </div>
        </div>
      )}
      <AgentManageForm agent={agent} />
    </div>
  );
}
