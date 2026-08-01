import {
  Baby,
  Bike,
  BookOpen,
  Dog,
  Droplet,
  Dumbbell,
  Flame,
  Leaf,
  Moon,
  User,
  Users,
  Waves,
} from "lucide-react";
import { Eyebrow } from "@/components/projects/Eyebrow";
import { amenityGroups } from "@/data/project";

const icons = {
  user: User,
  book: BookOpen,
  bike: Bike,
  dumbbell: Dumbbell,
  waves: Waves,
  moon: Moon,
  droplet: Droplet,
  users: Users,
  baby: Baby,
  dog: Dog,
  leaf: Leaf,
  flame: Flame,
} as const;

export function Amenities() {
  return (
    <section className="bg-night py-24">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <Eyebrow>Amenities &amp; services</Eyebrow>
        <h2 className="mt-6 max-w-lg text-3xl leading-[1.2] font-light text-ink sm:text-[2.1rem]">
          The best parts of your day won&apos;t happen indoors.
        </h2>

        <div className="mt-12 space-y-10">
          {amenityGroups.map((group) => (
            <div key={group.group}>
              <p className="border-b border-hairline/40 pb-4 text-[0.6rem] tracking-[0.24em] text-ink-muted uppercase">
                {group.group}
              </p>
              <div className="mt-7 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {group.items.map((item) => {
                  const Icon = icons[item.icon];
                  return (
                    <div key={item.title}>
                      <span className="grid size-8 place-items-center rounded-full border border-gold/60 text-gold">
                        <Icon className="size-3.5" strokeWidth={1.5} />
                      </span>
                      <h3 className="mt-4 text-sm text-ink">{item.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-ink-dim">{item.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
