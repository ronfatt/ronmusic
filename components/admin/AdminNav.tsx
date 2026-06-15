import Link from "next/link";
import { signOutAdmin } from "@/app/actions";

const links = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/songs", label: "Songs" },
  { href: "/admin/albums", label: "Albums" },
  { href: "/admin/inquiries", label: "Inquiries" }
];

export function AdminNav() {
  return (
    <aside className="border-r border-white/10 bg-ink/80 p-5">
      <Link href="/admin/dashboard" className="text-xl font-black tracking-[0.18em] text-pearl">R.ON ADMIN</Link>
      <nav className="mt-8 grid gap-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm font-semibold text-pearl/65 transition hover:bg-white/10 hover:text-pearl">
            {link.label}
          </Link>
        ))}
      </nav>
      <form action={signOutAdmin} className="mt-8">
        <button className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-pearl/65 hover:text-pearl">
          Sign out
        </button>
      </form>
    </aside>
  );
}
