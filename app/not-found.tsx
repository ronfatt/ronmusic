import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4 text-center text-pearl">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-electric">404</p>
        <h1 className="mt-4 text-4xl font-black">Page not found</h1>
        <Link href="/" className="mt-8 inline-flex rounded-lg bg-gold px-5 py-3 text-sm font-bold text-ink">
          Back to R.ON Music
        </Link>
      </div>
    </main>
  );
}
