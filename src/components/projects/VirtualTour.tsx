import { ArrowRight, Play } from "lucide-react";
import { Eyebrow } from "@/components/projects/Eyebrow";
import { homeTypes } from "@/data/project";

export function VirtualTour() {
  return (
    <>
      <section className="border-b border-hairline/30 bg-gradient-to-b from-surface-deep via-night to-night py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-full border border-gold text-gold">
            <Play className="size-4" strokeWidth={1.5} />
          </span>
          <Eyebrow className="mt-6 justify-center">Virtual tour</Eyebrow>
          <h2 className="mt-5 text-3xl leading-[1.2] font-light text-ink sm:text-[2.1rem]">
            Take a walk through <span className="text-ink">Klove</span> tonight.
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
            From your sofa — the streets, the landscape and the spaces, before you ever visit.
          </p>
          <a
            href="#brochure"
            className="mt-8 inline-flex items-center gap-3 border border-gold px-7 py-3.5 text-[0.7rem] tracking-[0.18em] text-ink uppercase transition-colors hover:bg-gold/10"
          >
            Start the virtual tour
            <ArrowRight className="size-3.5" strokeWidth={1.5} />
          </a>
        </div>
      </section>

      <section className="bg-night py-24">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <Eyebrow>The homes · in 3D</Eyebrow>
          <h2 className="mt-6 text-3xl leading-[1.2] font-light text-ink sm:text-[2.25rem]">
            A home that fits where you are in life.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-muted">
            Eight ways to live at Klove — explore each one in three dimensions, room by room.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {homeTypes.map((home) => (
              <Link
                key={home.tag}
                to="/projects/$slug"
                params={{ slug: home.slug }}
                className="block border border-hairline/40 bg-surface-card/40 p-5 transition-colors hover:border-gold/50"
              >
                <p className="text-[0.6rem] tracking-[0.22em] text-ink-dim uppercase">{home.tag}</p>
                <h3 className="mt-3 text-base font-light text-ink">{home.name}</h3>
                <p className="mt-3 text-2xl font-light text-ink">
                  {home.size}
                  <span className="ml-1 align-super text-[0.6rem] text-ink-dim">m²</span>
                </p>
                <p className="mt-5 flex items-center gap-2 text-[0.6rem] tracking-[0.22em] text-ink-muted uppercase">
                  View in 3D <ArrowRight className="size-3" strokeWidth={1.5} />
                </p>
              </Link>
            ))}
          </div>

          <p className="mt-10 flex items-center gap-3 text-xs text-ink-dim">
            <span className="inline-block h-px w-6 bg-hairline" />
            Every home opens onto its own private terrace.
          </p>
        </div>
      </section>
    </>
  );
}
