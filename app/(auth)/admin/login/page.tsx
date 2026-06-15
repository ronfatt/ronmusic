import { LoginForm } from "@/components/admin/LoginForm";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4 text-pearl">
      {error === "not-authorized" ? (
        <div className="fixed top-6 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          This account is signed in but is not on the R.ON Music admin whitelist.
        </div>
      ) : null}
      <LoginForm />
    </main>
  );
}
