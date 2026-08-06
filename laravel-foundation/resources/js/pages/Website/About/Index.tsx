import { SeoHead, type SeoMetadata } from '@/components/shared/SeoHead';
import { ArrowRight, Award, Crown, Medal, Star } from 'lucide-react';
import { Eyebrow } from '@/components/shared/Eyebrow';
import WebsiteLayout from '@/layouts/WebsiteLayout';
const awardIcons = { award: Award, star: Star, medal: Medal, crown: Crown };

export default function Index({ hero, stats, story, awards, partners, promise, seo }: { hero: { heading: string; description: string; backgroundImage: string }; stats: Array<{ value: string; label: string; note: string }>; story: { heading: string; body: string; image: string }; awards: Array<{ icon: string | null; title: string; year: number | null; copy: string | null }>; partners: Array<{ name: string; role: string | null }>; promise: { heading: string }; seo: SeoMetadata }) {
    const heroLines = (hero.heading ?? 'You\'re not choosing\na building.').split('\n');
    const storyParagraphs = (story.body ?? '').split('\n');
    return (
        <WebsiteLayout>
            <SeoHead seo={seo} />
            <section
                className="relative overflow-hidden py-10"
                style={{
                    backgroundImage: `
              radial-gradient(
                ellipse 60% 70% at 82% 10%,
                rgba(164, 121, 43, 0.30) 0%,
                rgba(115, 79, 27, 0.2) 35%,
                transparent 72%
              ),
              linear-gradient(
                110deg,
                rgba(6, 4, 4, 0.98) 28%,
                rgba(2, 2, 4, 0.73) 100%
              ),
              url(${hero.backgroundImage})
            `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="relative mx-auto flex min-h-[620px] max-w-[1440px] flex-col justify-center px-6 pt-36 pb-20 sm:px-10 lg:px-24">
                    <Eyebrow className="text-ink">About LARZ</Eyebrow>
                    <h1 className="mt-7 max-w-3xl text-3xl font-light leading-[1.08] tracking-[-0.03em] text-ink sm:text-4xl lg:text-[4.2rem]">
                        {heroLines.map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
                    </h1>
                    <p className="mt-7 max-w-md text-sm leading-relaxed text-ink-muted">
                        {hero.description}
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-6">
                        <a href="/projects" className="inline-flex items-center gap-3 border border-gold px-5 py-3 text-[0.62rem] tracking-[0.2em] text-ink uppercase transition-colors hover:bg-gold/10">
                            Explore our projects <ArrowRight className="size-3.5" strokeWidth={1.5} />
                        </a>
                        <a href="/contact" className="text-[0.6rem] tracking-[0.2em] text-ink-muted uppercase hover:text-ink">
                            Contact us
                        </a>
                    </div>
                </div>
            </section>

            <section className="border-b border-hairline/50 bg-night">
                <div className="mx-auto grid max-w-[950px] grid-cols-2 md:grid-cols-4">
                    {stats.map(({ value, label, note }) => (
                        <div key={label} className="border-r border-hairline/50 px-4 py-7 last:border-r-0 sm:px-6">
                            <p className="text-5xl font-light text-ink">{value}</p>
                            <p className="mt-2 text-[0.65rem] font-light tracking-[0.22em] text-ink uppercase">{label}</p>
                            <p className="mt-1 text-[0.7rem] text-ink-muted">{note}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-[#EFEFF1] py-20 text-paper-ink sm:py-24">
                <div className="mx-auto grid max-w-[1440px] gap-14 px-6 sm:px-10 md:grid-cols-2 lg:items-center">
                    <div className="max-w-xl">
                        <Eyebrow tone="light">Our story</Eyebrow>
                        <h2 className="mt-5 text-3xl font-light leading-[1.1] sm:text-[3rem]">{story.heading}</h2>
                        <p className="mt-6 text-sm font-light leading-relaxed text-ink-muted md:text-lg">
                            {storyParagraphs.map((paragraph, index) => <span key={paragraph}>{index > 0 && <br />}{paragraph}</span>)}
                        </p>
                    </div>
                    <figure className="relative h-[360px] max-w-xl overflow-hidden border border-paper-muted/30 bg-[#e4e4e7] sm:h-[500px]">
                        <img src={story.image} alt="Placeholder image of a LARZ development" className="size-full object-cover" />
                    </figure>
                </div>
            </section>

            <section className="bg-night py-20 sm:py-24">
                <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-24">
                    <Eyebrow className="text-ink">Awards &amp; achievements</Eyebrow>
                    <h2 className="mt-5 max-w-xl text-3xl font-light leading-[1.15] text-ink sm:text-[3rem]">Recognised for building things that last.</h2>
                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {awards.map(({ icon, title, year, copy }) => {
                            const Icon = awardIcons[icon as keyof typeof awardIcons] ?? Award;
                            return (
                            <article key={title + year} className="flex flex-col justify-start border border-hairline/40 p-6 transition-colors duration-300 hover:border-gold/40 sm:p-7 lg:p-8">
                                <div className="grid size-12 place-items-center rounded-full border border-white/30 text-ink-muted"><Icon className="size-5" strokeWidth={1.25} /></div>
                                <h3 className="mt-7 text-lg font-normal tracking-tight text-ink sm:text-xl">{title}</h3>
                                <p className="mt-2 text-[0.7rem] tracking-[0.2em] text-ink-muted uppercase">{year}</p>
                                <p className="mt-4 text-xs leading-relaxed text-ink-muted">{copy}</p>
                            </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-[#EFEFF1] py-20 text-paper-ink sm:py-24">
                <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-24">
                    <Eyebrow tone="light">Partnerships &amp; affiliations</Eyebrow>
                    <h2 className="mt-5 max-w-xl text-3xl font-light leading-[1.15] sm:text-[3rem]">The names behind our work.</h2>
                    <p className="mt-5 max-w-lg text-sm leading-relaxed text-paper-muted">We build with partners who share our standards — in design, engineering and delivery.</p>
                    <div className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {partners.map(({ name, role }) => (
                            <div key={name} className="flex min-h-[140px] flex-col items-center justify-center border border-paper-muted/30 px-5 text-center">
                                <span className="text-[0.52rem] tracking-[0.25em] text-paper-muted">[ LOGO ]</span>
                                <div className="my-3 h-px w-full bg-paper-muted/20" />
                                <h3 className="text-sm text-paper-ink">{name}</h3>
                                <p className="mt-2 text-[0.58rem] text-ink-muted">{role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section
                className="relative overflow-hidden bg-night py-20 text-center sm:py-24"
                style={{
                    backgroundImage: `radial-gradient(ellipse 100% 100% at 55% 10%, rgba(164, 121, 43, 0.30) 0%, rgba(115, 79, 27, 0.2) 55%, transparent 72%)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="relative mx-auto max-w-2xl px-6">
                    <Eyebrow className="justify-center text-ink">Our promise</Eyebrow>
                    <h2 className="mt-5 text-2xl font-light leading-[1.3] text-ink sm:text-3xl md:text-[2.45rem]">{promise.heading}</h2>
                    <div className="mt-8 flex flex-wrap justify-center gap-6">
                        <a href="/projects" className="inline-flex items-center gap-3 border border-gold px-5 py-3 text-[0.62rem] tracking-[0.2em] text-ink uppercase hover:bg-gold/10">Explore our projects <ArrowRight className="size-3.5" strokeWidth={1.5} /></a>
                        <a href="/contact" className="self-center text-[0.6rem] tracking-[0.2em] text-ink-muted uppercase hover:text-ink">Talk to us</a>
                    </div>
                </div>
            </section>
        </WebsiteLayout>
    );
}
