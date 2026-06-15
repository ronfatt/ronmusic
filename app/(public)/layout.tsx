import type { ReactNode } from "react";
import { PublicShell } from "@/components/layout/PublicShell";

export const dynamic = "force-dynamic";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}
