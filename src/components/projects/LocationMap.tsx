import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/projects/Eyebrow";
import { drives, mapImage } from "@/data/project";

export function LocationMap() {
  return (
    <>
      <section className="bg-paper py-24">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 sm:px-10 md:grid-cols-2 md:items-start">
          <div>
            <Eyebrow tone="light">Location &amp; map</Eyebrow>
            <h2 className="mt-6 text-3xl leading-[1.2] font-light text-paper-ink sm:text-[2.1rem]">
              Quiet doesn&apos;t mean far.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-paper-muted">
              Klove sits in Al-Qornofel, opposite Golden Square — minutes from the roads, schools and
              places you already use, with two gates so getting home is never a wait.
            </p>

            <ul className="mt-8">
              {drives.map((drive) => (
                <li
                  key={drive.place}
                  className="flex items-baseline justify-between border-b border-paper-muted/25 py-4"
                >
                  <span className="text-sm text-paper-ink">{drive.place}</span>
                  <span className="text-lg font-light text-paper-muted">{drive.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-paper-muted">
              Two access gates — each placed for an easier way in and out
            </p>
            <p className="mt-2 text-[0.7rem] text-paper-muted/70">Drive times are indicative.</p>
          </div>

          <figure className="relative">
            <img
              src={mapImage}
              alt="Interactive map of KLOVE in Al-Qornofel, New Cairo"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      <section className="bg-gradient-to-b from-surface-deep to-night py-24 text-center" style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, #2a2210 0%, #16130a 50%, #0a0905 100%)",
        }}>
        <div className="mx-auto max-w-3xl px-6">
          <Eyebrow className="justify-center">KLOVE &nbsp;—&nbsp; New Cairo</Eyebrow>
          <h2 className="mt-6 text-3xl leading-[1.2] font-light text-ink sm:text-[2.4rem]">
            A better life begins in the right place.
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
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
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
