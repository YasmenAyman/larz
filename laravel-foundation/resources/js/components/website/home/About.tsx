import statsIcon1 from '@assets/stats_icon_1.svg';
import statsIcon2 from '@assets/stats_icon_2.svg';
import statsIcon3 from '@assets/stats_icon_3.svg';
import statsIcon4 from '@assets/stats_icon_4.svg';

export function About({ stats }: { stats: Array<{ value: string; label: string }> }) {
    const icons = [statsIcon1, statsIcon2, statsIcon3, statsIcon4];

    return (
        <section className="bg-surface bg_state py-20">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
                <dl className="grid grid-cols-2 gap-x-10 gap-y-12 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <div key={stat.label} className={index % 2 === 1 ? 'lg:mt-16' : ''}>
                            <img src={icons[index]} alt="" className="h-8 w-8 object-contain opacity-85" />

                            {/* Gradient divider */}
                            <div
                                className="my-4 h-[2px] w-full"
                                style={{
                                    background:
                                        'linear-gradient(to right, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.35) 40%, transparent)',
                                }}
                            />

                            <dt className="sr-only">{stat.label}</dt>
                            <dd className="flex items-baseline gap-2">
                                <span className="font-serif text-3xl text-ink sm:text-[40px]">{stat.value}</span>
                                <span className="text-[20px] text-ink-muted">+ {stat.label}</span>
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}
