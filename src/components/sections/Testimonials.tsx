import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { testimonials } from "@/data/site";

export function Testimonials() {
  const [start, setStart] = useState(0);
  const visible = [testimonials[start % testimonials.length], testimonials[(start + 1) % testimonials.length]];

  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title={
            <>
              Built on Trust. Proven
              <br className="hidden sm:block" /> by Experience.
            </>
          }
          description={
            <>
              Our clients' satisfaction reflects our commitment to delivering thoughtfully designed
              developments and exceptional service.
            </>
          }
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {visible.map((item, i) => (
            <figure
              key={`${item.name}-${i}`}
              className="flex gap-6 rounded-2xl bg-surface-card p-6"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-56 w-40 shrink-0 object-cover grayscale"
              />
              <div className="flex min-w-0 flex-col justify-between">
                <blockquote className="text-sm leading-relaxed text-ink-muted">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-6">
                  <p className="text-sm text-ink">{item.name}</p>
                  <p className="text-xs text-ink-dim">{item.role}</p>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => setStart((v) => (v - 1 + testimonials.length) % testimonials.length)}
            className="grid size-10 place-items-center rounded-full border border-hairline text-ink"
          >
            <ChevronLeft className="size-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => setStart((v) => (v + 1) % testimonials.length)}
            className="grid size-10 place-items-center rounded-full border border-hairline text-ink"
          >
            <ChevronRight className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
