import { PillButton } from '@/components/shared/PillButton';
import { useI18n } from '@/i18n';
import defaultHeroVideo from '@assets/hero_video.mp4';

function displayHeading(value: string): string {
    return value.replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim();
}

export function Hero({ hero }: { hero: { heading: string; description: string; cta_label: string; cta_url: string; heroImage: string; heroVideo?: string | null } }) {
    const { t } = useI18n();
    const heading = displayHeading(t(hero.heading ?? 'Designed for the Way You Live'));
    return (
        <section className="relative isolate min-h-[400px] overflow-hidden bg-black pt-32 pb-16 lg:min-h-[850px] lg:pb-0">
            <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={hero.heroImage}
                aria-label="LARZ hero background"
                className="absolute inset-0 -z-20 h-full w-full object-cover"
            >
                <source src={hero.heroVideo ?? defaultHeroVideo} type="video/mp4" />
            </video>
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/60" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-black/55 via-black/20 to-black/45" />

            <div className="relative mx-auto flex min-h-[252px] w-full max-w-[1536px] items-center px-4 sm:px-8 lg:min-h-[718px] lg:px-16">
                <div className="max-w-5xl">
                    <h1 className="text-3xl font-bold leading-[1.15] text-white sm:text-4xl lg:text-[88px]">
                        {heading}
                    </h1>
                    <p className="mt-6 max-w-md text-[18px] leading-relaxed text-white/80">
                        {t(hero.description)}
                    </p>
                    <PillButton label={t(hero.cta_label)} to={hero.cta_url} variant="split" className="mt-10" />
                </div>
            </div>
        </section>
    );
}
