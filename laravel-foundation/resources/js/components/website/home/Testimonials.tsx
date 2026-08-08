import { useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { useI18n } from '@/i18n';
import reviewBackground from '@assets/review_bg.png';

export function Testimonials({ testimonials, settings }: { testimonials: Array<{ quote: string; name: string; role: string | null; image: string | null }>; settings: { eyebrow: string; heading: string; description: string } }) {
    const autoplayPlugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }));
    const { locale } = useI18n();
    const isRtl = locale === 'ar';

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            dragFree: false,
            align: 'start',
            slidesToScroll: 1,
            margin: '10',
            direction: isRtl ? 'rtl' : 'ltr',
        } as Parameters<typeof useEmblaCarousel>[0],
        [autoplayPlugin.current],
    );

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
    const NextIcon = isRtl ? ChevronLeft : ChevronRight;

    return (
        <section
            dir={isRtl ? 'rtl' : 'ltr'}
            className="mb-20 bg-surface py-20 lg:py-28"
            style={{
                backgroundImage: `url(${reviewBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
                <SectionHeading
                    eyebrow={settings.eyebrow}
                    title={settings.heading}
                    description={settings.description}
                />

                {/* Carousel viewport */}
                <div className="mt-14 cursor-grab overflow-hidden active:cursor-grabbing" ref={emblaRef}>
                    <div className="flex gap-6">
                        {testimonials.map((item, i) => (
                            <figure
                                key={`${item.name}-${i}`}
                                /* 1 slide mobile, 2 slides md+ */
                                className="flex basis-full shrink-0 gap-6 rounded-2xl bg-[#121212] p-6 md:basis-[calc(50%-12px)]"
                            >
                                {item.image ? <img src={item.image} alt={item.name} className={`h-56 w-full shrink-0 rounded-xl object-cover grayscale sm:w-[50%] ${isRtl ? 'order-2' : ''}`} draggable={false} /> : <div className={`h-56 w-full shrink-0 rounded-xl bg-white/5 sm:w-[50%] ${isRtl ? 'order-2' : ''}`} aria-hidden="true" />}
                                <div className={`flex min-w-0 flex-col justify-between ${isRtl ? 'text-right' : ''}`}>
                                    <blockquote className="text-sm leading-relaxed text-ink-muted">{item.quote}</blockquote>
                                    <figcaption className="mt-6">
                                        <p className="text-sm text-ink">{item.name}</p>
                                        <p className="text-xs text-ink-dim">{item.role}</p>
                                    </figcaption>
                                </div>
                            </figure>
                        ))}
                    </div>
                </div>

                {/* Controls */}
                <div className={`mt-8 flex items-center gap-3 ${isRtl ? 'justify-start' : 'justify-end'}`}>
                    <button type="button" aria-label="Previous testimonial" onClick={scrollPrev} className="grid size-10 place-items-center rounded-l-2xl bg-white/20 text-white transition-colors hover:bg-neutral-800">
                        <PrevIcon className="size-4" strokeWidth={1.5} />
                    </button>
                    <button type="button" aria-label="Next testimonial" onClick={scrollNext} className="grid size-10 place-items-center rounded-r-2xl bg-white/20 text-white transition-colors hover:bg-neutral-800">
                        <NextIcon className="size-4" strokeWidth={1.5} />
                    </button>
                </div>
            </div>
        </section>
    );
}
