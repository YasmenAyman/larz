import { PillButton } from '@/components/shared/PillButton';
import { useI18n } from '@/i18n';
export function Hero({ hero }: { hero: { heading: string; description: string; cta_label: string; cta_url: string; heroImage: string } }) {
    const { t } = useI18n();
    const heading = (t(hero.heading ?? 'Designed for\nthe Way You Live')).split('\n');
    return (
        <section className="relative min-h-[400px] overflow-hidden bg-surface bg_pattern pt-32 pb-16 lg:min-h-[850px] lg:pb-0">
            <span
                aria-hidden="true"
                className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 select-none text-[35vw] font-light leading-none tracking-[0.12em] text-ink/[0.05]"
            >
                LARZ
            </span>

            <div className="relative mx-auto grid items-center gap-12 px-4 !pr-0 sm:px-8 md:grid-cols-[1fr_52%]">
                <div>
                    <h1 className="text-3xl font-bold leading-[1.15] text-ink sm:text-4xl lg:text-[88px]">
                        {heading.map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
                    </h1>
                    <p className="mt-6 max-w-md text-[18px] leading-relaxed text-ink-muted">
                        {t(hero.description)}
                    </p>
                    <PillButton label={t(hero.cta_label)} to={hero.cta_url} variant="split" className="mt-10" />
                </div>

                <div className="relative hidden lg:block">
                    <img src={hero.heroImage} alt="LARZ tower exterior" className="ml-auto w-full object-cover" />
                </div>
            </div>
        </section>
    );
}
