import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PillButton } from "@/components/shared/PillButton";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { gallery } from "@/data/site";

export function Gallery() {
  const [offset, setOffset] = useState(0);
  const items = gallery.map((_, i) => gallery[(i + offset) % gallery.length]);

  return (
    <section className="overflow-hidden bg-surface-deep py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <SectionHeading
          eyebrow="Our Gallery"
          title="Spaces That Inspire"
          description={
            <>
              A glimpse into the details, designs, and destinations that
              <br className="hidden sm:block" /> define the larz experience
            </>
          }
        />
        <div className="mt-8 flex justify-center">
          <PillButton label="Explore All" to="/projects" />
        </div>
      </div>

      <div className="mt-16 flex items-center justify-center gap-4 px-4">
        {items.map((src, i) => {
          const distance = Math.abs(i - 2);
          return (
            <img
              key={`${src}-${i}`}
              src={src}
              alt="LARZ gallery"
              className={
                distance === 0
                  ? "h-64 w-40 shrink-0 object-cover sm:h-72 sm:w-52"
                  : distance === 1
                    ? "hidden h-56 w-36 shrink-0 object-cover sm:block sm:h-64 sm:w-48"
                    : "hidden h-48 w-32 shrink-0 object-cover lg:block lg:h-56 lg:w-44"
              }
              style={{ transform: `translateY(${distance * 12}px)` }}
            />
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => setOffset((v) => (v - 1 + gallery.length) % gallery.length)}
          className="grid size-10 place-items-center rounded-full border border-hairline text-ink"
        >
          <ChevronLeft className="size-4" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => setOffset((v) => (v + 1) % gallery.length)}
          className="grid size-10 place-items-center rounded-full border border-hairline text-ink"
        >
          <ChevronRight className="size-4" strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}
