import { PillButton } from '@/components/shared/PillButton';
import { useI18n } from '@/i18n';
import defaultHeroVideo from '@assets/tower_video.mp4';

function displayHeading(value: string): string {
    return value.replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim();
}

export function Hero({ hero }: { hero: { heading: string; description: string; cta_label: string; cta_url: string; heroImage: string; heroVideo?: string | null } }) {
    const { t, locale } = useI18n();
    const isArabic = locale === 'ar';
    const heading = displayHeading(t(hero.heading ?? 'Designed for the Way You Live'));
    return (
        <section className="relative min-h-[400px] overflow-hidden bg-surface bg_pattern pt-32 pb-16 lg:min-h-[850px] lg:pb-0">
            <span
                aria-hidden="true"
                className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 select-none text-[35vw] font-light leading-none tracking-[0.12em] text-ink/[0.05]"
            >
                LARZ
            </span>

            <div className="relative mx-auto grid items-center gap-12 ps-4 pe-0 sm:ps-8 sm:pe-0 md:grid-cols-[1fr_52%]">
                <div>
                    <h1 className="text-3xl font-bold leading-[1.15] text-ink sm:text-4xl lg:text-[88px]">
                        {heading}
                    </h1>
                    <p className="mt-6 max-w-md text-[18px] leading-relaxed text-ink-muted">
                        {t(hero.description)}
                    </p>
                    <PillButton label={t(hero.cta_label)} to={hero.cta_url} variant="split" className="mt-10" />
                </div>

                <div className="relative hidden lg:block">
                    <div
                        className="ms-auto aspect-[767/889] w-full overflow-hidden"
                        style={{
                            maskImage: `url(${hero.heroImage})`,
                            maskMode: 'alpha',
                            maskPosition: 'center',
                            maskRepeat: 'no-repeat',
                            maskSize: '100% 100%',
                            WebkitMaskImage: `url(${hero.heroImage})`,
                            WebkitMaskPosition: 'center',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskSize: '100% 100%',
                            transform: isArabic ? 'scaleX(-1)' : undefined,
                        }}
                    >
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            poster={hero.heroImage}
                            aria-label="LARZ tower exterior"
                            className="h-full w-full object-cover"
                            style={{ transform: isArabic ? 'scaleX(-1)' : undefined }}
                        >
                            <source src={hero.heroVideo ?? defaultHeroVideo} type="video/mp4" />
                        </video>
                    </div>
                </div>
            </div>
        </section>
    );
}
