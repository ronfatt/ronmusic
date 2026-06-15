import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "./server";

export async function requireAdmin() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) redirect("/admin/login");

  const { data, error } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) redirect("/admin/login?error=not-authorized");

  return { supabase, user: authData.user };
}
