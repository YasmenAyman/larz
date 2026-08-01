import { Award, Building2, Globe, Users } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { aboutPolaroids, stats } from "@/data/site";

const icons = { award: Award, building: Building2, users: Users, globe: Globe };

export function About() {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
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
