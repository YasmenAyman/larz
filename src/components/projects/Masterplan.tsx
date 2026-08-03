import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/projects/Eyebrow";
import { masterplanImage } from "@/data/project";

export function Masterplan() {
  return (
    <section id="brochure" className="bg-night py-24 sm:py-28">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 sm:px-10 md:grid-cols-[1fr_320px]">
        <div>
          <Eyebrow>Masterplan &amp; brochure</Eyebrow>
          <h2 className="mt-6 text-3xl leading-[1.2] font-light text-ink sm:text-[2.25rem]">
            See exactly where your home sits.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-muted">
            How the green, the water and the walkways wrap around it. Then take the full picture
            with you.
          </p>

          <figure className="relative mt-8">
            <img
              src={masterplanImage}
              alt="KLOVE masterplan render"
              className="h-[220px] w-full object-cover opacity-80 sm:h-[260px]"
            />
          </figure>
        </div>

        <div className="bg-surface-card/70 p-7">
          <h3 className="text-lg font-light text-ink">Get the brochure</h3>
          <p className="mt-1 text-xs text-ink-dim">Two details, and it&apos;s yours.</p>

          <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="brochure-name"
                className="text-[0.6rem] tracking-[0.24em] text-ink-dim uppercase"
              >
                Name
              </label>
              <input
                id="brochure-name"
                type="text"
                placeholder="Your name"
                className="mt-2 w-full border border-hairline/60 bg-night px-4 py-3 text-sm text-ink placeholder:text-ink-dim focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="brochure-phone"
                className="text-[0.6rem] tracking-[0.24em] text-ink-dim uppercase"
              >
                Phone
              </label>
              <input
                id="brochure-phone"
                type="tel"
                placeholder="Your number"
                className="mt-2 w-full border border-hairline/60 bg-night px-4 py-3 text-sm text-ink placeholder:text-ink-dim focus:border-gold focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 border border-gold px-6 py-3.5 text-[0.7rem] tracking-[0.18em] text-ink uppercase transition-colors hover:bg-gold/10"
            >
              Download brochure
              <ArrowRight className="size-3.5" strokeWidth={1.5} />
            </button>
            <p className="text-center text-[0.65rem] text-ink-dim">
              We&apos;ll only use this to send the brochure and follow up.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
