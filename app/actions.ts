"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  email: z.string().trim().email("A valid email is required").max(180),
  inquiry_type: z.string().min(2),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(3000),
  website: z.string().optional()
});

export async function submitInquiry(_: unknown, formData: FormData) {
  const payload = inquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    inquiry_type: formData.get("inquiry_type"),
    message: formData.get("message"),
    website: formData.get("website")
  });

  if (!payload.success) {
    return { ok: false, message: payload.error.errors[0]?.message || "Please check the form." };
  }

  if (payload.data.website) {
    return { ok: true, message: "Thank you. Your inquiry has been received." };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Supabase is not configured yet." };

  const { website: _website, ...inquiry } = payload.data;
  const { error } = await supabase.from("inquiries").insert({ ...inquiry, source: "website" });
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/inquiries");
  return { ok: true, message: "Thank you. Your inquiry has been received." };
}

export async function signOutAdmin() {
  const supabase = await getSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
