import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

export default function ArtistPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-electric">Artist biography</p>
          <h1 className="mt-4 text-5xl font-black text-pearl md:text-6xl">About R.ON</h1>
          <Image src="https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?auto=format&fit=crop&w=900&q=80" alt="Artist performance atmosphere" width={720} height={900} className="mt-8 aspect-[4/5] w-full rounded-lg object-cover shadow-glow" />
        </div>
        <div className="space-y-8 text-lg leading-8 text-pearl/72">
          <p>R.ON is an independent composer, songwriter, and music producer shaping a personal catalog of emotional ballads, cinematic rock, worship music, world-inspired soundscapes, and instrumental works.</p>
          <p>The platform is designed as the official archive for R.ON&apos;s original songs: lyrics, stories, music video links, album collections, and booking contact all live in one artist-owned destination.</p>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black text-pearl">AI-assisted music production</h2>
            <p className="mt-4">R.ON explores AI-assisted workflows as part of a modern production toolkit while keeping the creative direction, writing, arrangement taste, and final artistic identity under the artist&apos;s control.</p>
          </div>
          <div className="rounded-lg border border-gold/20 bg-gold/10 p-6">
            <h2 className="text-2xl font-black text-pearl">Worship, cinematic, and world music direction</h2>
            <p className="mt-4">The sound aims to carry emotional storytelling, spiritual depth, cinematic movement, and cross-cultural textures suitable for songs, instrumental works, and visual media.</p>
          </div>
          <ButtonLink href="/contact">Contact for booking or collaboration</ButtonLink>
        </div>
      </div>
    </section>
  );
}
