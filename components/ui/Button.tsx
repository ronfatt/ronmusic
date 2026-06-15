import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const variants = {
  primary: "border-transparent bg-gold text-ink hover:bg-[#f0c468]",
  secondary: "border-white/15 bg-white/10 text-pearl hover:bg-white/15",
  ghost: "border-transparent bg-transparent text-pearl/75 hover:text-pearl hover:bg-white/10"
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-lg border px-5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-electric/60 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
};

export function ButtonLink({ className, variant = "primary", href, ...props }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-lg border px-5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-electric/60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
