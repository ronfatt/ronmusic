"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitInquiry } from "@/app/actions";
import { Button } from "@/components/ui/Button";

const initialState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Sending..." : "Submit inquiry"}</Button>;
}

export function ContactForm() {
  const [state, action] = useFormState(submitInquiry, initialState);

  return (
    <form action={action} className="glass space-y-5 rounded-lg p-5 sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-semibold text-pearl/80">Name</span>
          <input name="name" required className="h-12 w-full rounded-lg border border-white/10 bg-ink/70 px-4 text-pearl outline-none focus:border-electric" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-pearl/80">Email</span>
          <input name="email" type="email" required className="h-12 w-full rounded-lg border border-white/10 bg-ink/70 px-4 text-pearl outline-none focus:border-electric" />
        </label>
      </div>
      <label>
        <span className="mb-2 block text-sm font-semibold text-pearl/80">Inquiry type</span>
        <select name="inquiry_type" className="h-12 w-full rounded-lg border border-white/10 bg-ink/70 px-4 text-pearl outline-none focus:border-electric">
          <option>Booking inquiry</option>
          <option>Licensing inquiry</option>
          <option>Collaboration inquiry</option>
        </select>
      </label>
      <label>
        <span className="mb-2 block text-sm font-semibold text-pearl/80">Message</span>
        <textarea name="message" required rows={6} maxLength={3000} className="w-full rounded-lg border border-white/10 bg-ink/70 px-4 py-3 text-pearl outline-none focus:border-electric" />
      </label>
      <label className="hidden" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      {state.message ? (
        <p className={state.ok ? "text-sm text-electric" : "text-sm text-red-300"}>{state.message}</p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
