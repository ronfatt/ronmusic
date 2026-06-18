import { redirect } from "next/navigation";
import { getSupabaseServerClient, getSupabaseServiceClient } from "./server";

const defaultAdminEmails = ["ronfatt@gmail.com"];

function getAdminEmails() {
  const configuredEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(new Set([...configuredEmails, ...defaultAdminEmails]));
}

export async function requireAdmin() {
  const authClient = await getSupabaseServerClient();
  if (!authClient) throw new Error("Supabase is not configured.");

  const { data: authData } = await authClient.auth.getUser();
  if (!authData.user) redirect("/admin/login");

  const email = authData.user.email?.toLowerCase();
  const adminEmails = getAdminEmails();
  if (!email || !adminEmails.includes(email)) {
    redirect("/admin/login?error=not-authorized");
  }

  const serviceClient = getSupabaseServiceClient();
  if (!serviceClient) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");

  return { supabase: serviceClient, user: authData.user };
}
