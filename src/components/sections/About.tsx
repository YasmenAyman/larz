import { Award, Building2, Globe, Users } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { aboutPolaroids, stats } from "@/data/site";

const icons = { award: Award, building: Building2, users: Users, globe: Globe };

export function About() {
  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <SectionHeading
          eyebrow="About Us"
          title={
            <>
              Building more than buildings, we
              <br className="hidden sm:block" /> build lasting value.
            </>
          }
        />
        <div className="mx-auto mt-8 max-w-2xl space-y-3 text-center text-sm leading-relaxed text-ink-muted">
          <p>
            Founded with a vision to redefine real estate in Egypt, Larz Developments has been
            delivering innovative residential and commercial spaces that blend modern architecture,
            superior quality, and thoughtful design.
          </p>
          <p>
            Our commitment to excellence and customer satisfaction has earned the trust of thousands
            and shaped communities that stand the test of time.
          </p>
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-6 md:flex-row md:gap-0">
          {aboutPolaroids.map((item, i) => (
            <figure
              key={i}
              className="w-56 bg-ink p-3 pb-6 shadow-2xl sm:w-64"
              style={{
                transform: `rotate(${(i - 1) * 4}deg) translateY(${i === 1 ? "-1.5rem" : "0"})`,
                marginLeft: i === 0 ? 0 : "-1rem",
                zIndex: i === 1 ? 2 : 1,
              }}
            >
              <img
                src={item.src}
                alt={item.caption || "LARZ development"}
                className="aspect-[3/4] w-full object-cover"
              />
              {item.caption && (
                <figcaption className="mt-3 text-center text-xs text-surface-deep">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>

        <dl className="mt-20 grid grid-cols-2 gap-x-10 gap-y-12 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = icons[stat.icon];
            return (
              <div key={stat.label} className={i % 2 === 1 ? "lg:mt-10" : ""}>
                <Icon className="size-7 text-ink" strokeWidth={1} />
                <div className="mt-4 border-t border-hairline pt-4">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl text-ink sm:text-4xl">{stat.value}</span>
                    <span className="text-sm text-ink-muted">{stat.label}</span>
                  </dd>
                </div>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
