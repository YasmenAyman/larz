import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { PillButton } from "@/components/shared/PillButton";
import { contact, footerMenu, ph } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden rounded-t-[2.5rem] bg-surface-deep">
      <img
        src={ph(1600, 900, "Architecture")}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover opacity-25"
      />
      <div className="relative mx-auto max-w-[1440px] px-4 py-20 sm:px-8">
        <h2 className="text-center text-3xl leading-[1.3] font-light text-ink sm:text-4xl md:text-[2.6rem]">
          Let's Build
          <br />
          The Future Together
        </h2>
        <div className="mt-8 flex justify-center">
          <PillButton label="Get In Touch" to="/contact" />
        </div>

        <div className="mt-14 grid gap-10 rounded-3xl border border-hairline/50 bg-surface/60 p-8 backdrop-blur-sm md:grid-cols-3 md:p-12">
          <div className="flex items-center md:justify-center">
            <Logo size="lg" withTagline />
          </div>

          <nav aria-label="Footer">
            <h3 className="text-lg text-ink">Menu</h3>
            <ul className="mt-6 space-y-4">
              {footerMenu.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-ink-muted hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-lg text-ink">Get in Touch</h3>
            <ul className="mt-6 space-y-5 text-sm text-ink-muted">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
                <span className="leading-relaxed">{contact.address}</span>
              </li>
              <li className="flex gap-3">
                <Mail className="size-4 shrink-0" strokeWidth={1.5} />
                <a href={`mailto:${contact.email}`} className="hover:text-ink">
                  {contact.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="size-4 shrink-0" strokeWidth={1.5} />
                <a href={`tel:${contact.phone}`} className="hover:text-ink">
                  {contact.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-ink-dim">
            Developed by <span className="font-semibold text-ink">TQNIA</span> All Rights reserved
          </p>
          <ul className="flex items-center gap-3">
            {[
              { Icon: Facebook, label: "Facebook" },
              { Icon: Instagram, label: "Instagram" },
              { Icon: Linkedin, label: "LinkedIn" },
            ].map(({ Icon, label }) => (
              <li key={label}>
                <a
                  href="#"
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-full border border-hairline text-ink"
                >
                  <Icon className="size-4" strokeWidth={1.5} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
