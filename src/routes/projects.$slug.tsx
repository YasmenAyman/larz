import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Eyebrow } from "@/components/projects/Eyebrow";
import { projects } from "@/data/site";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Project unavailable | LARZ Developments" }, { name: "robots", content: "noindex" }],
      };
    }
    const { project } = loaderData;
    const title = `${project.title} | LARZ Developments`;
    return {
      meta: [
        { title },
        { name: "description", content: project.intro },
        { property: "og:title", content: title },
        { property: "og:description", content: project.intro },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ProjectNotFound,
  component: ProjectDetailPage,
});

function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-night font-sans text-ink">
      <Header />
      <main className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col justify-center px-6 pt-44 pb-24 sm:px-10">
        <h1 className="text-4xl font-light text-ink sm:text-5xl">Project not found</h1>
        <Link to="/projects" className="mt-6 text-sm text-ink-muted hover:text-ink">
          Back to projects
        </Link>
      </main>
      <Footer />
    </div>
  );
}

function ProjectDetailPage() {
  const { project } = Route.useLoaderData();
  const others = projects.filter((p) => p.slug !== project.slug);

  return (
    <div className="min-h-screen bg-night font-sans text-ink">
      <Header />
      <main>
        <section className="relative">
          <div className="relative min-h-[80vh] overflow-hidden">
            <img
              src={project.image}
              alt={`${project.title} exterior`}
              className="absolute inset-0 size-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-night via-night/85 to-night/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/70" />

            <div className="relative mx-auto flex min-h-[80vh] max-w-[1440px] flex-col justify-center px-6 pt-40 pb-16 sm:px-10 lg:px-24">
              <Eyebrow className="text-ink">{project.status}</Eyebrow>
              <h1 className="mt-8 max-w-3xl text-5xl leading-[1.08] font-light text-ink sm:text-6xl lg:text-[4.25rem]">
                {project.title}
              </h1>
              <p className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
                <MapPin className="size-4" strokeWidth={1.5} />
                {project.location}
              </p>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-ink-muted">
                {project.tagline}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 border border-gold px-6 py-4 text-[0.7rem] tracking-[0.18em] text-ink uppercase transition-colors hover:bg-gold/10"
                >
                  Request pricing &amp; payment plan
                  <ArrowRight className="size-3.5" strokeWidth={1.5} />
                </Link>
                <Link
                  to="/projects"
                  className="text-[0.7rem] tracking-[0.18em] text-ink-dim uppercase hover:text-ink"
                >
                  All projects
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-hairline/40">
            <div className="mx-auto grid max-w-[1440px] grid-cols-2 md:grid-cols-4">
              {project.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="border-r border-b border-hairline/40 px-6 py-8 last:border-r-0 sm:px-10 md:border-b-0"
                >
                  <p className="text-3xl font-light text-ink">{fact.value}</p>
                  <p className="mt-2 text-[0.65rem] tracking-[0.22em] text-ink-muted uppercase">
                    {fact.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-paper py-24 sm:py-28">
          <div className="mx-auto grid max-w-5xl gap-14 px-6 sm:px-10 md:grid-cols-2 md:items-start">
            <div>
              <Eyebrow tone="light">Overview</Eyebrow>
              <h2 className="mt-6 text-3xl leading-[1.2] font-light text-paper-ink sm:text-[2.25rem]">
                {project.tagline}
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-paper-muted">{project.intro}</p>
              <ul className="mt-8">
                {project.highlights.map((item) => (
                  <li
                    key={item}
                    className="border-b border-paper-muted/25 py-4 text-sm text-paper-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <figure className="relative">
              <img
                src={project.gallery[0]}
                alt={`${project.title} lifestyle view`}
                className="h-[420px] w-full object-cover"
                loading="lazy"
              />
              <figcaption className="absolute bottom-3 left-4 text-[0.6rem] tracking-[0.24em] text-paper uppercase">
                Project render
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="bg-night py-24">
          <div className="mx-auto max-w-5xl px-6 sm:px-10">
            <Eyebrow>Gallery</Eyebrow>
            <h2 className="mt-6 text-3xl leading-[1.2] font-light text-ink sm:text-[2.25rem]">
              A closer look.
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {project.gallery.map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt={`${project.title} gallery image ${i + 1}`}
                  className="h-[220px] w-full object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-hairline/30 bg-surface-deep py-24">
          <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
            <Eyebrow>More developments</Eyebrow>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {others.map((other) => (
                <Link
                  key={other.slug}
                  to="/projects/$slug"
                  params={{ slug: other.slug }}
                  className="group relative block h-[300px] overflow-hidden"
                >
                  <img
                    src={other.image}
                    alt={other.title}
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/90 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                    <div>
                      <h3 className="text-base text-ink">{other.title}</h3>
                      <p className="mt-1 text-xs text-ink-muted">{other.location}</p>
                    </div>
                    <span className="grid size-9 place-items-center rounded-full bg-surface-card text-ink">
                      <ArrowUpRight className="size-4" strokeWidth={1.5} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-surface-deep to-night py-24 text-center">
          <div className="mx-auto max-w-3xl px-6">
            <Eyebrow className="justify-center text-gold">{project.title}</Eyebrow>
            <h2 className="mt-6 text-3xl leading-[1.2] font-light text-ink sm:text-[2.4rem]">
              A better life begins in the right place.
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 border border-gold px-6 py-4 text-[0.7rem] tracking-[0.18em] text-ink uppercase transition-colors hover:bg-gold/10"
              >
                Book a consultation
                <ArrowRight className="size-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
