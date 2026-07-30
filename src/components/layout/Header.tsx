import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { navLinks } from "@/data/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50 px-4 pt-5 sm:px-8">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-6 rounded-full border border-hairline/60 bg-surface-card/80 px-6 py-3 backdrop-blur-sm lg:max-w-[640px]">
          <Logo />
          <nav className="hidden flex-1 items-center justify-between lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                className="text-sm text-ink-muted transition-colors hover:text-ink [&.active]:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/contact"
            className="rounded-full border border-hairline/60 bg-surface-card/80 px-6 py-3 text-sm text-ink backdrop-blur-sm transition-colors hover:bg-surface-card"
          >
            Book a Consultation
          </Link>
          <Link
            to="/contact"
            aria-label="Book a Consultation"
            className="grid size-12 place-items-center rounded-full border border-hairline/60 bg-surface-card/80 text-ink backdrop-blur-sm transition-colors hover:bg-surface-card"
          >
            <ArrowUpRight className="size-4" strokeWidth={1.5} />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid size-12 shrink-0 place-items-center rounded-full border border-hairline/60 bg-surface-card/80 text-ink lg:hidden"
        >
          {open ? <X className="size-5" strokeWidth={1.5} /> : <Menu className="size-5" strokeWidth={1.5} />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-3 max-w-[1440px] rounded-3xl border border-hairline/60 bg-surface-card/95 p-6 backdrop-blur lg:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className="text-base text-ink-muted [&.active]:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-hairline px-6 py-3 text-sm text-ink"
            >
              Book a Consultation
              <ArrowUpRight className="size-4" strokeWidth={1.5} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
