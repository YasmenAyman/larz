import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PillButton } from "@/components/shared/PillButton";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { projects } from "@/data/site";

export function FeaturedProjects() {
  return (
    <section className="relative overflow-hidden bg-surface-deep pt-20 lg:pt-28">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-40 left-1/2 -translate-x-1/2 text-[20vw] leading-none font-light tracking-[0.12em] text-ink/[0.05] select-none"
      >
        LARZ
      </span>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Our Signature Developments"
          description={
            <>
              Discover a curated selection of our most prestigious projects,
              <br className="hidden sm:block" /> designed to elevate the standard of modern living
            </>
          }
        />
        <div className="mt-8 flex justify-center">
          <PillButton label="Explore All" to="/projects" />
        </div>
      </div>

      <div className="relative mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        {projects.map((project, i) => (
          <article key={i} className="group relative h-[420px] overflow-hidden lg:h-[480px]">
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-deep/80 to-transparent" />
            {i === 0 ? (
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-lg text-ink">{project.title}</h3>
                <p className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
                  <MapPin className="size-4" strokeWidth={1.5} />
                  {project.location}
                </p>
                <div className="mt-8 flex items-center justify-between">
                  <Link to="/projects" className="text-sm text-ink">
                    Explore Project
                  </Link>
                  <Link
                    to="/projects"
                    aria-label={`Explore ${project.title}`}
                    className="grid size-9 place-items-center rounded-full bg-surface-card text-ink"
                  >
                    <ArrowUpRight className="size-4" strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            ) : (
              <h3 className="absolute bottom-6 left-1/2 -translate-x-1/2 text-lg whitespace-nowrap text-ink [writing-mode:vertical-rl] sm:bottom-8">
                {project.title}
              </h3>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
