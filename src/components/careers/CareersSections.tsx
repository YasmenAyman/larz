import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { careerValues, openPositions } from "@/data/careers";
import gallery_2 from "@/assets/Gallery_2.png";
import project_img_4 from "@/assets/project_img_4.png";

function ValueIcon({ name }: { name: (typeof careerValues)[number]["icon"] }) {
  const common = {
    className: "size-12 text-ink",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 48 48",
  };
  if (name === "growth")
    return (
      <svg {...common} aria-hidden="true">
        <circle cx="17" cy="11" r="3.5" />
        <path d="M14 18h6l4 7" />
        <path d="M14 18l-3 8h7l-2 12" />
        <path d="M20 38l6-6" />
        <path d="M28 30l14-14M42 16h-8M42 16v8" />
        <path d="M6 42h36" />
      </svg>
    );
  if (name === "innovation")
    return (
      <svg {...common} aria-hidden="true">
        <path d="M24 8a11 11 0 0 0-6 20.2V33h12v-4.8A11 11 0 0 0 24 8Z" />
        <path d="M19 37h10M21 41h6" />
        <path d="M24 4v-2M38 12l2-2M10 12l-2-2M42 24h3M3 24h3" />
        <path d="M21 24a3 3 0 1 1 6 0" />
      </svg>
    );
  return (
    <svg {...common} aria-hidden="true">
      <path d="M4 20l8-6 8 4 8-4 8 6" />
      <path d="M12 14l8 10 5-3" />
      <path d="M25 21l7 7-3 3-6-6" />
      <path d="M36 18l6 6-6 8-8-6" />
      <path d="M6 22l6 10 6-4" />
    </svg>
  );
}

export function CareersHero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="relative h-[560px] w-full sm:h-[640px]">
        <img
          src={gallery_2}
          alt="LARZ team collaborating in the studio"
          className="absolute inset-0 size-full object-cover opacity-60 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/40 to-surface" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 text-[24vw] leading-none font-light tracking-[0.12em] text-ink/[0.07] select-none"
        >
          LARZ
        </span>

        <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl leading-tight font-light text-ink sm:text-5xl md:text-[3.2rem]">
            Shape the Future With Us.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-muted">
            Every remarkable project begins with remarkable people. Discover career opportunities
            where your ideas, talent, and ambition can thrive.
          </p>
          <div className="mt-8 flex items-center gap-2">
            <a
              href="#open-positions"
              className="rounded-full border border-hairline bg-surface-card/70 px-8 py-2.5 text-sm text-ink transition-colors hover:bg-surface-card"
            >
              View Open Roles
            </a>
            <a
              href="#open-positions"
              aria-label="View open roles"
              className="grid size-11 place-items-center rounded-full border border-hairline bg-surface-card/70 text-ink transition-colors hover:bg-surface-card"
            >
              <ArrowUpRight className="size-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhyJoinLarz() {
  return (
    <section className="relative overflow-hidden bg-surface py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 80% at 80% 90%, color-mix(in oklab, var(--ink) 8%, transparent), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8">
        <p className="text-[0.7rem] tracking-[0.32em] text-ink-dim uppercase">Why Join LARZ</p>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <h2 className="text-3xl leading-[1.25] font-light text-ink sm:text-4xl md:text-[2.6rem]">
            A Career That Builds More
            <br />
            Than Spaces
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-ink-muted lg:mt-3">
            Join a team where innovation, collaboration, and craftsmanship come together to create
            exceptional developments while supporting your professional growth.
          </p>
        </div>

        <div className="mt-24 grid gap-14 text-center md:grid-cols-3">
          {careerValues.map((value) => (
            <div key={value.title} className="flex flex-col items-center">
              <ValueIcon name={value.icon} />
              <h3 className="mt-6 text-lg font-light text-ink">{value.title}</h3>
              <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-ink-muted">
                {value.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OpenPositions() {
  return (
    <section id="open-positions" className="relative overflow-hidden bg-surface py-24">
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8">
        <p className="text-[0.7rem] tracking-[0.32em] text-ink-dim uppercase">Open Positions</p>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <h2 className="text-3xl leading-[1.25] font-light text-ink sm:text-4xl md:text-[2.6rem]">
            Find Your
            <br />
            Next Opportunity
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-ink-muted lg:mt-3">
            Explore current openings across architecture, engineering, design, and corporate teams,
            and discover where your skills can make a lasting impact.
          </p>
        </div>
      </div>

      <div className="relative mt-16">
        <img
          src={project_img_4}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover opacity-40 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/70 to-surface" />

        <div className="relative mx-auto max-w-[1180px] px-4 py-16 sm:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {openPositions.map((role, i) => (
              <article
                key={i}
                className="rounded-2xl border border-hairline/50 bg-surface-card/70 p-6 backdrop-blur-md transition-colors hover:bg-surface-card/90"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-light text-ink">{role.title}</h3>
                    <p className="mt-1 text-sm text-ink-muted">{role.type}</p>
                  </div>
                  <Link
                    to="/contact"
                    aria-label={`Apply for ${role.title}`}
                    className="grid size-10 shrink-0 place-items-center rounded-full border border-hairline/70 bg-surface/60 text-ink transition-colors hover:bg-surface-card"
                  >
                    <ArrowUpRight className="size-4" strokeWidth={1.5} />
                  </Link>
                </div>
                <p className="mt-5 max-w-[22rem] text-sm leading-relaxed text-ink-muted">
                  {role.description}
                </p>
                <p className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
                  <MapPin className="size-4" strokeWidth={1.5} />
                  {role.location}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <p className="text-sm text-ink-muted">Don't see the right fit ?</p>
            <Link
              to="/contact"
              className="rounded-full border border-hairline bg-surface-card/70 px-7 py-2.5 text-sm text-ink transition-colors hover:bg-surface-card"
            >
              Submit Your CV
            </Link>
            <Link
              to="/contact"
              aria-label="Submit your CV"
              className="grid size-11 place-items-center rounded-full border border-hairline bg-surface-card/70 text-ink transition-colors hover:bg-surface-card"
            >
              <ArrowUpRight className="size-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
