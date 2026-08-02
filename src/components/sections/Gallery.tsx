import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PillButton } from "@/components/shared/PillButton";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { gallery } from "@/data/site";
import newMask from "@/assets/new_mask.png";

// Repeat gallery items for continuous infinite looping
const repeatedGallery = [...gallery, ...gallery, ...gallery, ...gallery];

export function Gallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
    skipSnaps: false,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    let timerId: ReturnType<typeof setInterval> | null = null;

    const startAutoplay = () => {
      stopAutoplay();
      timerId = setInterval(() => {
        if (emblaApi.canScrollNext()) {
          emblaApi.scrollNext();
        } else {
          emblaApi.scrollTo(0);
        }
      }, 3000);
    };

    const stopAutoplay = () => {
      if (timerId) clearInterval(timerId);
    };

    startAutoplay();

    emblaApi.on("pointerDown", stopAutoplay);
    emblaApi.on("pointerUp", startAutoplay);

    return () => {
      stopAutoplay();
    };
  }, [emblaApi]);

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

      {/* Masked Slider Container */}
      <div className="mt-14 relative w-full">
        <div
          className="relative w-full overflow-hidden select-none"
          style={{
            WebkitMaskImage: `url(${newMask})`,
            maskImage: `url(${newMask})`,
            WebkitMaskSize: "140% 100%",
            maskSize: "140% 100%",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        >
          <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing py-6 px-3 sm:px-4 lg:px-6">
            <div className="flex gap-3 sm:gap-4">
              {repeatedGallery.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="relative aspect-[3/4] h-[260px] sm:h-[360px] lg:h-[440px] w-[calc((100%-12px)/2)] sm:w-[calc((100%-32px)/3)] lg:w-[calc((100%-64px)/5)] shrink-0 overflow-hidden"
                >
                  <img
                    src={src}
                    alt={`LARZ gallery item ${i + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={scrollPrev}
            className="grid size-11 place-items-center rounded-xl bg-neutral-900/90 text-neutral-300 border border-neutral-700/60 hover:bg-neutral-800 hover:text-white transition-colors shadow-lg"
          >
            <ChevronLeft className="size-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={scrollNext}
            className="grid size-11 place-items-center rounded-xl bg-neutral-900/90 text-neutral-300 border border-neutral-700/60 hover:bg-neutral-800 hover:text-white transition-colors shadow-lg"
          >
            <ChevronRight className="size-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </section>
  );
}

