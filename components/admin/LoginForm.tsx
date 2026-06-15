"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) setError(authError.message);
      else router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass w-full max-w-md space-y-5 rounded-lg p-6">
      <div>
        <h1 className="text-3xl font-black text-pearl">Admin login</h1>
        <p className="mt-2 text-sm text-pearl/60">Sign in with the Supabase admin user.</p>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-pearl/75">Email</span>
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="h-12 w-full rounded-lg border border-white/10 bg-ink/70 px-4 outline-none focus:border-electric" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-pearl/75">Password</span>
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required className="h-12 w-full rounded-lg border border-white/10 bg-ink/70 px-4 outline-none focus:border-electric" />
      </label>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <Button type="submit" disabled={loading} className="w-full">{loading ? "Signing in..." : "Sign in"}</Button>
    </form>
  );
}
