import { ArrowUpRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import finalCtaBackground from '@assets/Footer_bg.png';

export function FinalCta({ settings }: { settings: { eyebrow: string; heading: string; cta_label: string; cta_url: string } }) {
    const headingLines = (settings.heading ?? "Let's Build\nThe Future Together").split('\n');
    return (
        <section
            className="relative overflow-hidden"
            style={{ backgroundImage: `url(${finalCtaBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="relative mx-auto flex min-h-[420px] max-w-[1440px] flex-col items-center justify-center px-4 py-20 text-center sm:px-8 sm:py-28">
                <p className="text-[0.6rem] tracking-[0.3em] text-ink/80 uppercase sm:text-xs">{settings.eyebrow}</p>
                <h2 className="mt-6 max-w-3xl text-3xl leading-[1.1] font-bold text-ink sm:text-5xl md:text-[64px]">
                    {headingLines.map((line, index) => (
                        <span key={line}>{index > 0 && <br />}{line}</span>
                    ))}
                </h2>
                <Link
                    href={settings.cta_url || '#'}
                    className="mt-10 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-card/70 px-7 py-3 text-md text-ink transition-colors hover:bg-surface-card"
                >
                    {settings.cta_label}
                    <ArrowUpRight className="size-4" strokeWidth={1.5} />
                </Link>
            </div>
        </section>
    );
}