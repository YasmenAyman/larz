import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/tower_img.png";
import { Eyebrow } from "@/components/projects/Eyebrow";
import { projectStats } from "@/data/project";

export function ProjectHero() {
  return (
    <section className="relative bg-night">
      <div className="relative min-h-[86vh] overflow-hidden">
        <img
          src={heroImage}
          alt="KLOVE New Cairo — low-rise residential community exterior"
          className="absolute inset-0 size-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/85 to-night/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/70" />

        <div className="relative mx-auto flex min-h-[86vh] max-w-site flex-col justify-center px-6 pt-40 pb-16 sm:px-10 lg:px-24">
          <Eyebrow className="text-ink">KLOVE &nbsp;—&nbsp; New Cairo</Eyebrow>
          <h1 className="mt-8 text-5xl leading-[1.08] font-light text-ink sm:text-6xl lg:text-[4.5rem]">
            Come home
            <br />
            to quiet.
          </h1>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-ink-muted">
            A low-rise, green community in New Cairo&apos;s Al-Qornofel — where only a fifth of the
            land is built on, so your home keeps its light, its air, and its view.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href="#brochure"
              className="inline-flex items-center gap-3 border border-gold px-6 py-4 text-[0.7rem] tracking-[0.18em] text-ink uppercase transition-colors hover:bg-gold/10"
            >
              Request pricing &amp; payment plan
              <ArrowRight className="size-3.5" strokeWidth={1.5} />
            </a>
            <a
              href="#brochure"
              className="text-[0.7rem] tracking-[0.18em] text-ink-dim uppercase hover:text-ink"
            >
              Download brochure
            </a>
          </div>

          <div className="mt-12 flex items-center gap-2">
            <span className="h-px w-8 bg-gold" />
            <span className="h-px w-6 bg-hairline" />
            <span className="h-px w-6 bg-hairline" />
          </div>

          <p className="mt-14 self-end text-[0.6rem] tracking-[0.24em] text-ink-dim/70 uppercase">
            Hero image — KLOVE at dusk
          </p>
        </div>
      </div>

      <div className="border-t border-hairline/40">
        <div className="mx-auto grid max-w-site grid-cols-2 md:grid-cols-4">
          {projectStats.map((stat) => (
            <div
              key={stat.label}
              className="border-r border-b border-hairline/40 px-6 py-8 last:border-r-0 sm:px-10 md:border-b-0"
            >
              <p className="text-3xl font-light text-ink">{stat.value}</p>
              <p className="mt-2 text-[0.65rem] tracking-[0.22em] text-ink-muted uppercase">
                {stat.label}
              </p>
              <p className="mt-1 text-xs text-ink-dim">{stat.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
