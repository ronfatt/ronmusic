import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="grid min-h-screen grid-cols-[260px_1fr] bg-ink text-pearl">
      <AdminNav />
      <main className="min-w-0 p-6 pb-32">{children}</main>
    </div>
  );
}
