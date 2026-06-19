import { updateInquiry } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { getInquiries } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils/format";

const statuses = ["new", "replied", "booked", "archived"];

export default async function InquiriesPage() {
  const inquiries = await getInquiries();
  const statusCounts = statuses.map((status) => ({
    status,
    count: inquiries.filter((inquiry) => (inquiry.status || "new") === status).length
  }));

  return (
    <div>
      <h1 className="text-3xl font-black">Contact inquiries</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {statusCounts.map((item) => (
          <div key={item.status} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-pearl/45">{item.status}</p>
            <p className="mt-2 text-2xl font-black text-pearl">{item.count}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4">
        {inquiries.map((inquiry) => (
          <article key={inquiry.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-bold">{inquiry.name}</h2>
                <p className="text-sm text-pearl/55">{inquiry.email} · {inquiry.inquiry_type}</p>
              </div>
              <div className="text-right">
                <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-gold">
                  {inquiry.status || "new"}
                </span>
                <time className="mt-2 block text-xs text-pearl/45">{formatDate(inquiry.created_at)}</time>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-pearl/72">{inquiry.message}</p>
            <form action={updateInquiry.bind(null, inquiry.id)} className="mt-5 grid gap-3 border-t border-white/10 pt-5 md:grid-cols-[180px_1fr_auto]">
              <select name="status" defaultValue={inquiry.status || "new"} className="h-11 rounded-lg border border-white/10 bg-ink px-3 text-sm text-pearl">
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
              <input
                name="admin_notes"
                defaultValue={inquiry.admin_notes || ""}
                placeholder="Internal note"
                maxLength={2000}
                className="h-11 rounded-lg border border-white/10 bg-ink px-3 text-sm text-pearl"
              />
              <Button type="submit" variant="secondary">Save</Button>
            </form>
          </article>
        ))}
        {inquiries.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center">
            <h2 className="text-lg font-bold text-pearl">No inquiries yet</h2>
            <p className="mt-2 text-sm text-pearl/60">Booking, licensing, and collaboration messages will appear here.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
