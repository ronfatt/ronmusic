import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 pb-32 pt-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 text-sm text-pearl/60 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© R.ON Music. All songs and creative works are owned by the artist unless stated otherwise.</p>
        <div className="flex gap-5">
          <Link href="/music" className="hover:text-pearl">Music</Link>
          <Link href="/artist" className="hover:text-pearl">Artist</Link>
          <Link href="/contact" className="hover:text-pearl">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
