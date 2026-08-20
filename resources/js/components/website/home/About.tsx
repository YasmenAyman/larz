import statsIcon1 from '@assets/stats_icon_1.svg';
import statsIcon2 from '@assets/stats_icon_2.svg';
import statsIcon3 from '@assets/stats_icon_3.svg';
import statsIcon4 from '@assets/stats_icon_4.svg';
import { useI18n } from '@/i18n';

export function About({ stats }: { stats: Array<{ value: string; label: string }> }) {
    const icons = [statsIcon1, statsIcon2, statsIcon3, statsIcon4];
    const { t } = useI18n();

    return (
        <section className="bg-[#EFEFF1] py-20 text-paper-ink">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
                <dl className="grid grid-cols-2 gap-x-10 gap-y-12 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <div key={stat.label} className={index % 2 === 1 ? 'lg:mt-16' : ''}>
                            <img src={icons[index]} alt="" className="h-9 w-9 object-contain opacity-85" style={{ filter: 'brightness(0) invert(0.1)' }} />

                            {/* Gradient divider */}
                            <div
                                className="my-4 h-[2px] w-full"
                                style={{
                                    background:
                                        'linear-gradient(to right, color-mix(in srgb, var(--paper-ink) 35%, transparent) 50%, color-mix(in srgb, var(--paper-ink) 35%, transparent) 40%, transparent)',
                                }}
                            />

                            <dt className="sr-only">{t(stat.label)}</dt>
                            <dd className="flex items-baseline gap-2">
                                <span className="font-serif text-3xl text-paper-ink sm:text-[40px]">{stat.value}</span>
                                <span className="text-[22px] text-paper-ink">{t(stat.label)}</span>
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}
