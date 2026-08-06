import { useForm, usePage } from '@inertiajs/react';
import { ArrowRight, Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone, Youtube } from 'lucide-react';
import { Eyebrow } from '@/components/shared/Eyebrow';
import WebsiteLayout from '@/layouts/WebsiteLayout';
import type { PageProps } from '@/types';
import { SeoHead, type SeoMetadata } from '@/components/shared/SeoHead';

type ContactProps = {
    contact: { phone: string | null; email: string | null; address: string | null };
    projects: Array<{ id: number; title: string }>;
    hero: { heading: string; description: string };
    location: { image: string };
    social: Record<string, string | null>;
    seo: SeoMetadata;
};

type ContactForm = { name: string; phone: string; project_id: string; email: string; message: string; consent_at: string; source_url: string; _hp_website: string };

export default function Index({ contact, projects, hero, location, social, seo }: ContactProps) {
    const cards = [
        { icon: Phone, label: 'Hotline', value: contact.phone, note: 'Sat–Thu, 9am–6pm' },
        { icon: MessageCircle, label: 'WhatsApp', value: `+20 ${contact.phone}`, note: 'Fast replies, every day' },
        { icon: Mail, label: 'Email', value: 'info@larz...', note: 'larzdevelopments.com' },
        { icon: MapPin, label: 'Sales office', value: 'New Cairo', note: '[Full address]' },
    ];

    const safeSocial = social ?? { instagram: null, facebook: null, linkedin: null };

    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm<ContactForm>({
        name: '',
        phone: '',
        project_id: projects[0]?.id ? String(projects[0].id) : '',
        email: '',
        message: '',
        consent_at: new Date().toISOString(),
        source_url: typeof window !== 'undefined' ? window.location.href : '',
        _hp_website: '',
    });
    const submit = (event: React.FormEvent) => { event.preventDefault(); post('/contact-us', { preserveScroll: true, onSuccess: () => reset() }); };
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;

    return (
        <WebsiteLayout>
            <SeoHead seo={seo} />
            <section className="relative overflow-hidden border-b border-hairline/30 bg-night" style={{ backgroundImage: 'radial-gradient(ellipse 80% 90% at 82% 25%, rgba(164, 121, 43, 0.30) 0%, rgba(115, 79, 27, 0.2) 35%, transparent 72%), linear-gradient(110deg, rgba(6, 4, 4, 0.98) 28%, rgba(2, 2, 4, 0.73) 100%)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                <div className="relative mx-auto flex min-h-[700px] max-w-[1440px] flex-col justify-center px-6 pt-36 pb-16 sm:px-10 lg:px-24">
                    <Eyebrow className="text-ink">Contact us</Eyebrow>
                    <h1 className="mt-7 text-3xl font-light leading-[1.08] tracking-[-0.03em] text-ink sm:text-6xl lg:text-[4.25rem]">{hero.heading}</h1>
                    <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-muted">{hero.description}</p>
                    <div className="mt-8 flex flex-wrap items-center gap-6">
                        <a href="#request" className="inline-flex items-center gap-3 border border-gold px-5 py-3 text-[0.62rem] tracking-[0.2em] text-ink uppercase transition-colors hover:bg-gold/10">Request pricing &amp; a tour <ArrowRight className="size-3.5" /></a>
                        <a href="#whatsapp" className="text-[0.6rem] tracking-[0.2em] text-ink-muted uppercase hover:text-ink">WhatsApp us</a>
                    </div>
                </div>
            </section>
            <section className="bg-paper py-20 text-paper-ink sm:py-24">
                <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-24">
                    <Eyebrow tone="light">Get in touch</Eyebrow>
                    <h2 className="mt-5 text-4xl font-light leading-[1.1] sm:text-[2.5rem]">However suits you best.</h2>
                    <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {cards.map(({ icon: Icon, label, value, note }) => (
                            <article key={label} className="min-h-[145px] border border-paper-muted/30 p-5">
                                <div className="grid size-10 place-items-center rounded-full border border-gold text-gold"><Icon className="size-4" /></div>
                                <p className="mt-4 text-[0.56rem] tracking-[0.2em] text-paper-muted uppercase">{label}</p>
                                <p className="mt-2 text-lg font-light text-paper-ink">{value}</p>
                                <p className="mt-1 text-[0.62rem] text-paper-muted">{note}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
            <section id="request" className="bg-night py-20 sm:py-24">
                <div className="mx-auto grid max-w-[1440px] gap-12 px-6 sm:px-10 lg:grid-cols-[1fr_50%] lg:px-24">
                    <div className="max-w-xl">
                        <Eyebrow className="text-ink/80">Request pricing / tour</Eyebrow>
                        <h2 className="mt-5 text-3xl font-light leading-[1.08] text-ink sm:text-[3rem]">Book a visit or request pricing.</h2>
                        <p className="mt-6 max-w-md text-md leading-relaxed text-ink-muted">Tell us which community you&apos;re interested in and how to reach you. Our team will follow up with pricing, payment plans and available units.</p>
                    </div>
                    <form className="border border-hairline/60 bg-[#16161a] p-6 sm:p-7" onSubmit={submit} noValidate>
                        <h3 className="text-xl font-light text-ink">Request details</h3>
                        <p className="mt-1 text-xs text-ink-muted">We&apos;ll get back to you quickly.</p>
                        {(flash?.success || recentlySuccessful) && (
                            <p className="mt-4 rounded border border-emerald-700/40 bg-emerald-950/50 px-3 py-2 text-xs text-emerald-300">
                                {flash?.success ?? 'Thanks — we received your request and will reply within one business day.'}
                            </p>
                        )}
                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                            <label className="text-[0.52rem] tracking-[0.2em] text-ink-muted uppercase">
                                Name
                                <input type="text" value={data.name} onChange={(event) => setData('name', event.target.value)} required placeholder="Your name" className="mt-2 block w-full border border-hairline/60 bg-night px-3 py-3 text-xs tracking-normal text-ink outline-none placeholder:text-ink-muted focus:border-gold" />
                                {errors.name && <span className="mt-1 block text-xs text-rose-400">{errors.name}</span>}
                            </label>
                            <label className="text-[0.52rem] tracking-[0.2em] text-ink-muted uppercase">
                                Phone
                                <input type="tel" value={data.phone} onChange={(event) => setData('phone', event.target.value)} required placeholder="Your number" className="mt-2 block w-full border border-hairline/60 bg-night px-3 py-3 text-xs tracking-normal text-ink outline-none placeholder:text-ink-muted focus:border-gold" />
                                {errors.phone && <span className="mt-1 block text-xs text-rose-400">{errors.phone}</span>}
                            </label>
                        </div>
                        <label className="mt-5 block text-[0.52rem] tracking-[0.2em] text-ink-muted uppercase">
                            Project
                            <select value={data.project_id} onChange={(event) => setData('project_id', event.target.value)} className="mt-2 block w-full border border-hairline/60 bg-night px-3 py-3 text-xs tracking-normal text-ink outline-none focus:border-gold">
                                {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
                            </select>
                        </label>
                        <label className="mt-5 block text-[0.52rem] tracking-[0.2em] text-ink-muted uppercase">
                            Email
                            <input type="email" value={data.email} onChange={(event) => setData('email', event.target.value)} placeholder="Optional" className="mt-2 block w-full border border-hairline/60 bg-night px-3 py-3 text-xs tracking-normal text-ink outline-none placeholder:text-ink-muted focus:border-gold" />
                            {errors.email && <span className="mt-1 block text-xs text-rose-400">{errors.email}</span>}
                        </label>
                        <label className="mt-5 block text-[0.52rem] tracking-[0.2em] text-ink-muted uppercase">
                            Message
                            <textarea rows={4} value={data.message} onChange={(event) => setData('message', event.target.value)} placeholder="Anything you'd like us to know" className="mt-2 block w-full resize-none border border-hairline/60 bg-night px-3 py-3 text-xs tracking-normal text-ink outline-none placeholder:text-ink-muted focus:border-gold" />
                        </label>
                        <input type="hidden" value={data.consent_at} onChange={() => undefined} />
                        <input type="hidden" value={data.source_url} onChange={() => undefined} />
                        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                            <label>Do not fill<input type="text" tabIndex={-1} autoComplete="off" value={data._hp_website} onChange={(event) => setData('_hp_website', event.target.value)} /></label>
                        </div>
                        <button type="submit" disabled={processing} className="mt-5 inline-flex w-full items-center justify-center gap-3 border border-gold px-5 py-3 text-[0.62rem] tracking-[0.2em] text-ink uppercase transition-colors hover:bg-gold/10 disabled:opacity-60">
                            {processing ? 'Sending...' : 'Send request'} <ArrowRight className="size-3.5" />
                        </button>
                        <p className="mt-3 text-center text-[0.58rem] text-ink-muted">We&apos;ll only use your details to follow up on this request.</p>
                    </form>
                </div>
            </section>
            <section className="bg-paper py-20 text-paper-ink sm:py-24">
                <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-6 sm:px-10 lg:grid-cols-[1fr_540px] lg:px-24">
                    <div className="max-w-md">
                        <Eyebrow tone="light">Location &amp; map</Eyebrow>
                        <h2 className="mt-5 text-3xl font-light leading-[1.1] sm:text-[3rem]">Find us.</h2>
                        <p className="mt-6 text-md leading-relaxed text-paper-muted/80">Visit our sales office in New Cairo, or find each community on the map. We&apos;ll be glad to walk you through it in person.</p>
                        <p className="mt-5 text-xs text-paper-muted/80">{contact.address} · New Cairo, Egypt</p>
                        <a href="#directions" className="mt-7 inline-flex items-center gap-3 border border-gold px-5 py-3 text-[0.8rem] tracking-[0.2em] text-paper-ink uppercase hover:bg-gold/10">Get directions <ArrowRight className="size-3.5" /></a>
                    </div>
                    <figure className="relative h-[360px] overflow-hidden border border-paper-muted/30 bg-[#e4e4e7] sm:h-[420px]"><img src={location.image} alt="Placeholder map image for the LARZ sales office" className="size-full object-cover" /></figure>
                </div>
            </section>
            <section className="relative overflow-hidden bg-night py-20 text-center sm:py-32" style={{ backgroundImage: 'radial-gradient(ellipse 100% 100% at 55% 10%, rgba(164, 121, 43, 0.30) 0%, rgba(115, 79, 27, 0.2) 55%, transparent 72%)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                <div className="relative mx-auto max-w-2xl px-6">
                    <Eyebrow className="justify-center text-ink">Social media</Eyebrow>
                    <h2 className="mt-5 text-3xl font-light text-ink sm:text-[3rem]">Follow LARZ.</h2>
                    <div className="mt-7 flex justify-center gap-3">
                        {[
                            { Icon: Instagram, label: 'Instagram', href: safeSocial.instagram },
                            { Icon: Facebook, label: 'Facebook', href: safeSocial.facebook },
                            { Icon: Linkedin, label: 'LinkedIn', href: safeSocial.linkedin },
                            { Icon: Youtube, label: 'YouTube', href: '#' },
                        ].map(({ Icon, label, href }) => (
                            <a key={label} href={href ?? '#'} aria-label={label} className="grid size-10 place-items-center rounded-full border border-hairline text-ink-muted hover:border-gold hover:text-gold"><Icon className="size-4" /></a>
                        ))}
                    </div>
                    <p className="mt-5 text-sm text-ink-muted">Hotline {contact.phone} · {contact.email}</p>
                </div>
            </section>
        </WebsiteLayout>
    );
}
