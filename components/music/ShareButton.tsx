"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-5 text-sm font-semibold text-pearl transition hover:bg-white/15"
    >
      <Share2 size={16} />
      {copied ? "Copied" : "Share"}
    </button>
  );
}
