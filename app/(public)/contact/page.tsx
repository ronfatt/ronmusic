import { ContactForm } from "@/components/forms/ContactForm";

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.26em] text-gold">Contact</p>
        <h1 className="mt-4 text-5xl font-black text-pearl">Booking, licensing, and collaboration</h1>
        <p className="mt-5 text-lg leading-8 text-pearl/68">Send a focused inquiry for live worship sets, original music licensing, co-writing, production, or creative collaboration.</p>
      </div>
      <ContactForm />
    </section>
  );
}
