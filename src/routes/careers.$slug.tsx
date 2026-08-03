import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUpRight, Briefcase, MapPin, Users } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { openPositions } from "@/data/careers";
import hero from "@/assets/project_img_2.png";
import aboutImg from "@/assets/tower_img.png";

export const Route = createFileRoute("/careers/$slug")({
  loader: ({ params }) => {
    const job = openPositions.find((p) => p.slug === params.slug);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Unavailable" }, { name: "robots", content: "noindex" }] };
    const { job } = loaderData;
    return {
      meta: [
        { title: `${job.title} — Careers at LARZ Developments` },
        { name: "description", content: job.description },
        { property: "og:title", content: `${job.title} at LARZ Developments` },
        { property: "og:description", content: job.description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: JobDetailsPage,
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center bg-surface text-ink" role="alert">
      {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-surface text-ink">
      <div className="text-center">
        <p className="text-2xl font-light">This position is no longer open.</p>
        <Link to="/careers" className="mt-4 inline-block text-sm text-ink-muted underline">
          Back to Careers
        </Link>
      </div>
    </div>
  ),
});

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-hairline/60 bg-surface-card/50 p-7 backdrop-blur-sm sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
          <span aria-hidden="true" className="text-ink-dim">
            ·
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function MetaRow({
  Icon,
  label,
  value,
  last,
}: {
  Icon: typeof Briefcase;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <li className="flex items-center gap-4 py-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-full border border-hairline/60 bg-[#7C6C65] text-ink">
        <Icon className="size-4" strokeWidth={1.5} />
      </span>
      <div className={`min-w-0 flex-1 ${last ? "" : "border-b border-hairline/40 pb-4"}`}>
        <p className="text-xs text-ink/80">{label}</p>
        <p className="mt-1 truncate text-sm text-ink">{value}</p>
      </div>
    </li>
  );
}

function JobDetailsPage() {
  const { job } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-surface font-sans text-ink">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-surface">
          <div className="relative min-h-[560px] w-full">
            <img
              src={hero}
              alt=""
              aria-hidden="true"
              className="absolute inset-y-0 right-0 h-full w-full object-cover sm:w-[62%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/85 to-surface/10" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-surface" />

            <div className="relative mx-auto max-w-[1440px] px-4 pt-32 pb-20 sm:px-8">
              <nav aria-label="Breadcrumb" className="text-xs text-ink-muted">
                <Link to="/" className="hover:text-ink">
                  Home
                </Link>
                <span className="px-2 text-ink-dim">/</span>
                <Link to="/careers" className="hover:text-ink">
                  Careers
                </Link>
                <span className="px-2 text-ink-dim">/</span>
                <span className="text-ink-dim">{job.title}</span>
              </nav>

              <h1 className="mt-12 max-w-xl text-4xl leading-tight font-light text-ink sm:text-5xl md:text-[3.2rem]">
                {job.title}
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-muted">
                {job.description} Collaborating with multidisciplinary teams to transform innovative
                concepts into exceptional architectural solutions.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-ink-muted">
                <span className="flex items-center gap-2">
                  <MapPin className="size-4" strokeWidth={1.5} />
                  {job.location}
                </span>
                <span aria-hidden="true" className="text-ink-dim">
                  |
                </span>
                <span className="flex items-center gap-2">
                  <Briefcase className="size-4" strokeWidth={1.5} />
                  {job.type}
                </span>
              </div>

              <div className="mt-8 flex items-center gap-2">
                <Link
                  to="/contact"
                  className="rounded-full border border-hairline bg-surface-card/70 px-9 py-2.5 text-sm text-ink transition-colors hover:bg-surface-card"
                >
                  Apply Now
                </Link>
                <Link
                  to="/contact"
                  aria-label={`Apply for ${job.title}`}
                  className="grid size-11 place-items-center rounded-full border border-hairline bg-surface-card/70 text-ink transition-colors hover:bg-surface-card"
                >
                  <ArrowUpRight className="size-4" strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-surface pb-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 50% at 10% 20%, color-mix(in oklab, var(--ink) 7%, transparent), transparent 70%)",
            }}
          />
          <div className="relative mx-auto grid max-w-[1180px] gap-6 px-4 sm:px-8 lg:grid-cols-[1.7fr_1fr]">
            <div className="space-y-6">
              <Card>
                <h2 className="text-2xl font-light text-ink">About The Role</h2>
                <p className="mt-5 text-sm leading-relaxed text-ink-muted">{job.intro}</p>
              </Card>
              <Card>
                <h2 className="text-2xl font-light text-ink">Key Responsibilities</h2>
                <Bullets items={job.responsibilities} />
              </Card>
              <Card>
                <h2 className="text-2xl font-light text-ink">Requirements</h2>
                <Bullets items={job.requirements} />
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="py-3">
                <ul>
                  <MetaRow Icon={Briefcase} label="Job Title" value={job.title} />
                  <MetaRow Icon={Users} label="Department" value={job.department} />
                  <MetaRow Icon={Briefcase} label="Employment type" value={job.type} />
                  <MetaRow Icon={MapPin} label="Location" value={job.location} last />
                </ul>
              </Card>

              <Card>
                <h2 className="text-xl font-light text-ink">About Larz</h2>
                <img
                  src={aboutImg}
                  alt="A LARZ Developments building facade"
                  className="mt-5 h-40 w-full rounded-xl object-cover"
                  loading="lazy"
                />
                <p className="mt-5 text-sm leading-relaxed text-ink-muted">
                  LARZ Developments creates refined residential and commercial spaces across Egypt,
                  led by craftsmanship, innovation, and an enduring sense of place.
                </p>
                <Link
                  to="/about"
                  className="mt-6 inline-flex items-center gap-2 text-sm text-ink underline underline-offset-4"
                >
                  Learn More About Us
                  <ArrowUpRight className="size-4" strokeWidth={1.5} />
                </Link>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-surface py-20 text-center">
          <h2 className="text-2xl font-light text-ink sm:text-3xl">Don't see the right fit ?</h2>
          <div className="mt-8 flex items-center justify-center gap-2">
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
        </section>
      </main>
      <Footer />
    </div>
  );
}
