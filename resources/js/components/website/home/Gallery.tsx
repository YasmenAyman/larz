import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PillButton } from '@/components/shared/PillButton';
import { SectionHeading } from '@/components/shared/SectionHeading';
import newMask from '@assets/new_mask.png';
import { useI18n } from '@/i18n';
import { ImageLightbox } from '@/components/shared/ImageLightbox';

// Repeat gallery items for continuous infinite looping
export function Gallery({ gallery, settings }: { gallery: string[]; settings: { eyebrow: string; heading: string; description: string; cta_label: string; cta_url: string } }) {
    const repeatedGallery = [...gallery, ...gallery, ...gallery, ...gallery];
    const { t, locale } = useI18n();
    const isRtl = locale === 'ar';
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        dragFree: true,
        skipSnaps: false,
        direction: isRtl ? 'rtl' : 'ltr',
    });

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
    const NextIcon = isRtl ? ChevronLeft : ChevronRight;

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

        emblaApi.on('pointerDown', stopAutoplay);
        emblaApi.on('pointerUp', startAutoplay);

        return () => {
            stopAutoplay();
        };
    }, [emblaApi]);

    return (
        <section dir={isRtl ? 'rtl' : 'ltr'} className="overflow-hidden py-20 lg:py-28">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
                <SectionHeading
                    eyebrow={t(settings.eyebrow)}
                    title={t(settings.heading)}
                    description={<>{t(settings.description)}</>}
                />
                <div className="mt-8 flex justify-center">
                    <PillButton label={t(settings.cta_label)} to={settings.cta_url} />
                </div>
            </div>

            {/* Masked Slider Container */}
            <div className="relative mt-14 w-full">
                <div
                    className="relative w-full overflow-hidden select-none"
                    style={{
                        WebkitMaskImage: `url(${newMask})`,
                        maskImage: `url(${newMask})`,
                        WebkitMaskSize: '140% 100%',
                        maskSize: '100% 90%',
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                        maskPosition: 'center',
                    }}
                >
                    <div ref={emblaRef} className="cursor-grab overflow-hidden px-3 py-6 active:cursor-grabbing sm:px-4 lg:px-6">
                        <div className="flex gap-3 sm:gap-4">
                            {repeatedGallery.map((src, i) => (
                                <button
                                    type="button"
                                    key={`${src}-${i}`}
                                    onClick={() => setSelectedImageIndex(i % gallery.length)}
                                    aria-label={`Open gallery image ${(i % gallery.length) + 1}`}
                                    className="relative aspect-[3/4] h-[290px] w-[calc((100%-12px)/2)] shrink-0 cursor-zoom-in overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-[400px] sm:w-[calc((100%-32px)/3)] lg:h-[540px] lg:w-[calc((100%-64px)/5)]"
                                >
                                    <img
                                        src={src}
                                        alt={`LARZ gallery item ${i + 1}`}
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                        draggable={false}
                                    />
                                </button>
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
                        className={`grid size-10 place-items-center bg-white/20 text-white transition-colors hover:bg-neutral-800 ${isRtl ? 'rounded-r-2xl' : 'rounded-l-2xl'}`}>
                        <PrevIcon className="size-5" strokeWidth={1.75} />
                    </button>
                    <button
                        type="button"
                        aria-label="Next slide"
                        onClick={scrollNext}
                        className={`grid size-10 place-items-center bg-white/20 text-white transition-colors hover:bg-neutral-800 ${isRtl ? 'rounded-l-2xl' : 'rounded-r-2xl'}`}
                    >
                        <NextIcon className="size-5" strokeWidth={1.75} />
                    </button>
                </div>
            </div>

            {selectedImageIndex !== null && <ImageLightbox images={gallery} initialIndex={selectedImageIndex} alt="Selected LARZ gallery image" onClose={() => setSelectedImageIndex(null)} />}
        </section>
    );
}
