import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NavBar } from "@/components/NavBar";
import { ProfileForm } from "@/components/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, organisation, website")
    .eq("id", user.id)
    .maybeSingle();

  const fallbackName =
    user.user_metadata?.full_name?.toString().trim() ||
    user.email?.split("@")[0] ||
    "Developer";

  const safeProfile = {
    id: user.id,
    full_name: profile?.full_name ?? fallbackName,
    organisation: profile?.organisation ?? null,
    website: profile?.website ?? null,
  };

  return (
    <div className="app-shell">
      <NavBar userEmail={user.email} />
      <ProfileForm profile={safeProfile} email={user.email ?? ""} />
    </div>
  );
}
