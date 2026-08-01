import { Eyebrow } from "@/components/projects/Eyebrow";
import { constructionUpdates } from "@/data/project";

export function ConstructionUpdates() {
  return (
    <section className="bg-paper py-24">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <Eyebrow tone="light">Construction updates</Eyebrow>
        <h2 className="mt-6 text-3xl leading-[1.2] font-light text-paper-ink sm:text-[2.1rem]">
          Watch your home take shape.
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-paper-muted">
          Dated updates from site, so you&apos;re never left wondering where things stand.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {constructionUpdates.map((item) => (
            <article key={item.title}>
              <figure className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-[170px] w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="absolute bottom-2 left-3 text-[0.55rem] tracking-[0.24em] text-paper uppercase">
                  Site photo
                </figcaption>
              </figure>
              <p className="mt-4 text-[0.6rem] tracking-[0.22em] text-paper-muted uppercase">
                {item.tag}
              </p>
              <h3 className="mt-2 text-sm text-paper-ink">{item.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
