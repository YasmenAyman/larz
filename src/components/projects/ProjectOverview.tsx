import { Eyebrow } from "@/components/projects/Eyebrow";
import { overviewImage } from "@/data/project";

export function ProjectOverview() {
  return (
    <section className="bg-paper py-24 sm:py-28">
      <div className="mx-auto grid max-w-5xl gap-14 px-6 sm:px-10 md:grid-cols-2 md:items-start">
        <div>
          <Eyebrow tone="light">Overview</Eyebrow>
          <h2 className="mt-6 text-3xl leading-[1.2] font-light text-paper-ink sm:text-[2.25rem]">
            The city doesn&apos;t slow down. Your home should.
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-paper-muted">
            At Klove, you wake up to green instead of traffic, and to space that was planned around
            the way you actually want to live.
          </p>
          <p className="mt-5 text-sm leading-relaxed text-paper-muted">
            Across 24 feddans, only a fifth carries buildings — the rest is garden, water and open
            air. Nothing rises above five floors, so your mornings stay calm, your evenings stay
            private, and the view from your window stays yours.
          </p>
        </div>

        <figure className="relative">
          <img
            src={overviewImage}
            alt="Courtyard and greenery at KLOVE"
            className="h-[320px] w-full object-cover"
          />
        </figure>
      </div>
    </section>
  );
}
