import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight } from "lucide-react";
import heroImage1 from "@/assets/hero-image-1.png";
import { Eyebrow } from "@/components/projects/Eyebrow";
import { projectStats } from "@/data/project";

const slides = [
  {
    eyebrow: "KLOVE \u00a0—\u00a0 New Cairo",
    titleLine1: "Come home",
    titleLine2: "to quiet.",
    description:
      "A low-rise, green community in New Cairo\u2019s Al-Qornofel \u2014 where only a fifth of the land is built on, so your home keeps its light, its air, and its view.",
  },
  {
    eyebrow: "KLOVE \u00a0—\u00a0 New Cairo",
    titleLine1: "Live among",
    titleLine2: "the green.",
    description:
      "Surrounded by lush landscaped courtyards and open walkways designed to bring nature into every corner of your daily life.",
  },
  {
    eyebrow: "KLOVE \u00a0—\u00a0 New Cairo",
    titleLine1: "Light, air,",
    titleLine2: "and view.",
    description:
      "Every home is crafted to maximise natural light, fresh air circulation, and unobstructed green views \u2014 a rare luxury in urban living.",
  },
];

export function ProjectHero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    let timerId: ReturnType<typeof setInterval> | null = null;

    const startAutoplay = () => {
      stopAutoplay();
      timerId = setInterval(() => emblaApi.scrollNext(), 5000);
    };

    const stopAutoplay = () => {
      if (timerId) clearInterval(timerId);
    };

    startAutoplay();
    emblaApi.on("pointerDown", stopAutoplay);
    emblaApi.on("pointerUp", startAutoplay);

    return () => {
      stopAutoplay();
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="relative bg-night">
      <div className="relative min-h-[86vh] overflow-hidden">
        {/* Static background image */}
        <img
          src={heroImage1}
          alt="KLOVE New Cairo — low-rise residential community"
          className="absolute inset-0 size-full object-cover opacity-70"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/85 to-night/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/70" />

        {/* Content slider */}
        <div className="relative mx-auto flex min-h-[86vh] max-w-site flex-col justify-center px-6 pt-40 pb-16 sm:px-10 lg:px-24">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {slides.map((slide, i) => (
                <div key={i} className="w-full shrink-0">
                  <Eyebrow className="text-ink">{slide.eyebrow}</Eyebrow>
                  <h1 className="mt-8 text-5xl leading-[1.08] font-light text-ink sm:text-6xl lg:text-[4.5rem]">
                    {slide.titleLine1}
                    <br />
                    {slide.titleLine2}
                  </h1>
                  <p className="mt-8 max-w-md text-sm leading-relaxed text-ink-muted">
                    {slide.description}
                  </p>

                  <div className="mt-10 flex flex-wrap items-center gap-6">
                    <a
                      href="#brochure"
                      className="inline-flex items-center gap-3 border border-gold px-6 py-4 text-[0.7rem] tracking-[0.18em] text-ink uppercase transition-colors hover:bg-gold/10"
                    >
                      Request pricing &amp; payment plan
                      <ArrowRight className="size-3.5" strokeWidth={1.5} />
                    </a>
                    <a
                      href="#brochure"
                      className="text-[0.7rem] tracking-[0.18em] text-ink-dim uppercase hover:text-ink"
                    >
                      Download brochure
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot indicators */}
          <div
            className="mt-12 flex items-center gap-2"
            role="tablist"
            aria-label="Project hero slides"
          >
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={selectedIndex === index}
                aria-label={`Show slide ${index + 1}`}
                onClick={() => scrollTo(index)}
                className={`h-px transition-all ${
                  selectedIndex === index
                    ? "w-8 bg-gold"
                    : "w-6 bg-hairline hover:bg-ink-dim"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-hairline/40">
        <div className="mx-auto grid max-w-site grid-cols-2 md:grid-cols-4">
          {projectStats.map((stat) => (
            <div
              key={stat.label}
              className="border-r border-b border-hairline/40 px-6 py-8 last:border-r-0 sm:px-10 md:border-b-0"
            >
              <p className="text-3xl font-light text-ink">{stat.value}</p>
              <p className="mt-2 text-[0.65rem] tracking-[0.22em] text-ink-muted uppercase">
                {stat.label}
              </p>
              <p className="mt-1 text-xs text-ink-muted">{stat.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
