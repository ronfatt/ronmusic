import { getInquiries } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils/format";

export default async function InquiriesPage() {
  const inquiries = await getInquiries();
  return (
    <div>
      <h1 className="text-3xl font-black">Contact inquiries</h1>
      <div className="mt-6 grid gap-4">
        {inquiries.map((inquiry) => (
          <article key={inquiry.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-bold">{inquiry.name}</h2>
                <p className="text-sm text-pearl/55">{inquiry.email} · {inquiry.inquiry_type}</p>
              </div>
              <time className="text-xs text-pearl/45">{formatDate(inquiry.created_at)}</time>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-pearl/72">{inquiry.message}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
