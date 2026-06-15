import Link from "next/link";
import { Music2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

const links = [
  { href: "/music", label: "Music" },
  { href: "/albums", label: "Albums" },
  { href: "/artist", label: "Artist" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-ink/72 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-lg bg-electric text-ink shadow-glow">
            <Music2 size={22} />
          </span>
          <span>
            <span className="block text-sm font-black tracking-[0.28em] text-pearl">R.ON</span>
            <span className="block text-xs text-pearl/55">Music Universe</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-pearl/70 transition hover:text-pearl">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink href="/admin/login" variant="ghost" className="hidden sm:inline-flex">
            Admin
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Booking
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
