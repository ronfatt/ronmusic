export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center">
      <h3 className="text-lg font-semibold text-pearl">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-pearl/65">{message}</p>
    </div>
  );
}
