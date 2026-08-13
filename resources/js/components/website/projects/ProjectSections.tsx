import { useCallback, useEffect, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, Baby, Bike, BookOpen, ChevronLeft, ChevronRight, Dog, Droplet, Dumbbell, Flame, Leaf, Moon, Play, User, Users, Waves, X } from 'lucide-react';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { useI18n } from '@/i18n';
import type { ProjectSections, WebsiteProject } from '@/types/website';
import type { PageProps } from '@/types';

const icons = { user: User, book: BookOpen, bike: Bike, dumbbell: Dumbbell, waves: Waves, moon: Moon, droplet: Droplet, users: Users, baby: Baby, dog: Dog, leaf: Leaf, flame: Flame } as const;
const imageSource = (...sources: Array<string | null | undefined>) => sources.find((source) => Boolean(source)) ?? '';

type InquiryForm = { name: string; phone: string; email: string; project_id: string; project_unit_type_id: string; preferred_contact_method: string; message: string; consent_at: string; source_url: string; _hp_website: string };
type BrochureForm = { name: string; phone: string; email: string; project_id: string; source_url: string; _hp_website: string };

const NAME_PATTERN = /^[\p{L}\s]+$/u;
const PHONE_PATTERN = /^[0-9]{6,40}$/;

export function ProjectHero({ project, sections }: { project: WebsiteProject; sections: ProjectSections }) {
    const { locale } = useI18n();
    const isRtl = locale === 'ar';
    const [ref, api] = useEmblaCarousel({ loop: true, direction: isRtl ? 'rtl' : 'ltr' });
    const [selected, setSelected] = useState(0);
    const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);
    useEffect(() => { if (!api) return; const onSelect = () => setSelected(api.selectedScrollSnap()); onSelect(); api.on('select', onSelect); const timer = setInterval(() => api.scrollNext(), 5000); return () => { clearInterval(timer); api.off('select', onSelect); }; }, [api]);
    return <section dir={isRtl ? 'rtl' : 'ltr'} className="relative bg-night" style={{ backgroundImage: `radial-gradient(ellipse 60% 70% at 82% 10%, rgba(164, 121, 43, 0.30) 0%, rgba(115, 79, 27, 0.2) 35%, transparent 72%), linear-gradient(110deg, rgba(6, 4, 4, 0.98) 28%, rgba(2, 2, 4, 0.73) 100%), url(${project.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}><div className="relative min-h-[86vh] overflow-hidden"><div className="relative mx-auto flex min-h-[86vh] max-w-site flex-col justify-center px-6 pt-40 pb-16 sm:px-10 lg:px-24"><div ref={ref} className="overflow-hidden"><div className="flex">{sections.heroSlides.map((slide, index) => <div key={index} className="w-full shrink-0"><Eyebrow className="text-ink">{slide.eyebrow}</Eyebrow><h1 className="mt-8 text-5xl font-light leading-[1.08] text-ink sm:text-6xl lg:text-[4.5rem]">{slide.titleLine1}<br />{slide.titleLine2}</h1><p className="mt-8 max-w-md text-sm leading-relaxed text-ink-muted">{slide.description}</p><div className="mt-10 flex flex-wrap items-center gap-6">{slide.cta1Label && <a href={slide.cta1Url || '#brochure'} className="inline-flex items-center gap-3 border border-gold px-6 py-4 text-[0.7rem] tracking-[0.18em] text-ink uppercase transition-colors hover:bg-gold/10">{slide.cta1Label} <ArrowRight className={`size-3.5 ${isRtl ? 'rotate-180' : ''}`} /></a>}{slide.cta2Label && <a href={slide.cta2Url || '#brochure'} className="text-[0.7rem] tracking-[0.18em] text-ink-muted uppercase hover:text-ink">{slide.cta2Label}</a>}</div></div>)}</div></div><div className="mt-12 flex items-center gap-2" role="tablist" aria-label="Project hero slides">{sections.heroSlides.map((_, index) => <button key={index} type="button" role="tab" aria-selected={selected === index} aria-label={`Show slide ${index + 1}`} onClick={() => scrollTo(index)} className={`h-px transition-all ${selected === index ? 'w-8 bg-gold' : 'w-6 bg-hairline hover:bg-ink-dim'}`} />)}</div></div></div></section>;
}

export function ProjectStats({ project }: { project: WebsiteProject }) {
    return <section className="relative bg-night"><div className="border-t border-hairline/50"><div className="mx-auto grid max-w-site grid-cols-2 md:grid-cols-4">{project.facts.map((stat) => <div key={stat.label} className="border-e border-b border-hairline/50 px-6 py-8 last:border-e-0 sm:px-10 md:border-b-0"><p className="text-3xl font-light text-ink">{stat.value}</p><p className="mt-2 text-[0.65rem] font-light tracking-[0.22em] text-ink uppercase">{stat.label}</p><p className="mt-1 text-xs text-ink-muted">{stat.note}</p></div>)}</div></div></section>;
}

export function ProjectOverview({ project, sections }: { project: WebsiteProject; sections: ProjectSections }) {
    const { t } = useI18n();
    const overviewImage = imageSource(project.overviewImage, project.gallery[0], project.heroImage);
    return <section id="overview" className="bg-white py-20 text-paper-ink sm:py-24"><div className="mx-auto grid max-w-[1440px] gap-14 px-6 sm:px-10 md:grid-cols-2 lg:items-center"><div><Eyebrow tone="light">{t('Overview')}</Eyebrow><h2 className="mt-5 text-3xl font-light leading-[1.1] sm:text-[3rem]">{sections.overview.heading}</h2><p className="mt-6 text-sm font-light leading-relaxed text-ink-muted md:text-lg">{sections.overview.body}</p></div><figure className="relative h-[360px] max-w-xl overflow-hidden border border-paper-muted/30 bg-[#e4e4e7] sm:h-[500px]">{overviewImage && <img src={overviewImage} alt="Courtyard and greenery" className="size-full object-cover" />}</figure></div></section>;
}

export function ProjectGallery({ project, sections }: { project: WebsiteProject; sections: ProjectSections }) {
    if (!project.gallery.length) return null;
    const gallery = sections.gallery ?? { eyebrow: 'Gallery', heading: 'A closer look.' };
    return <section id="gallery" className="bg-night py-24"><div className="mx-auto max-w-5xl px-6 sm:px-10"><Eyebrow className="text-ink">{gallery.eyebrow}</Eyebrow><h2 className="mt-6 text-3xl font-light leading-[1.2] text-ink sm:text-[2.25rem]">{gallery.heading}</h2><div className="mt-10 grid gap-4 sm:grid-cols-3">{project.gallery.map((src, i) => <img key={`${src}-${i}`} src={src} alt={`Gallery image ${i + 1}`} className="h-[220px] w-full object-cover" loading="lazy" />)}</div></div></section>;
}

export function Homes3D({ project, sections }: { project: WebsiteProject; sections: ProjectSections }) {
    const { t } = useI18n();
    if (!sections.homes3d?.heading) return null;
    const items = sections.homes3d.items ?? [];
    return (
        <section id="homes3d" className="bg-[#0d0d0f] py-[72px] text-[#d8d5d3] sm:py-[86px]">
            <div className="mx-auto max-w-[1096px] px-[14px] sm:px-8">
                <Eyebrow className="text-ink">{t('The homes · in 3D')}</Eyebrow>
                <h2 className="mt-6 max-w-[590px] text-[2.65rem] font-light leading-[1.08] tracking-[-0.025em] text-[#d8d5d3] sm:text-[3rem]">{sections.homes3d.heading}</h2>
                <p className="mt-6 max-w-[610px] text-[0.95rem] font-light leading-[1.65] text-[#716f70]">{sections.homes3d.description}</p>
                {items.length > 0 && (
                    <div className="mt-[52px] grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {items.map((item, i) => (
                            <div key={i} className="flex min-h-[190px] flex-col justify-between border border-[#2a2a2e] bg-[#17171b] px-[21px] py-[25px] transition-colors duration-300 hover:border-[#4a4135]">
                                <div>
                                    <p className="text-[0.62rem] font-light tracking-[0.2em] text-[#676568] uppercase">{item.tag}</p>
                                    <h3 className="mt-3 text-[1.3rem] font-light leading-tight text-[#bebbbb]">{item.name}</h3>
                                    <p className="mt-5 text-[1.65rem] font-light leading-none tracking-[-0.02em] text-[#aaa7a7]">{item.size} <span className="text-[0.75rem] tracking-normal text-[#858283]">m&sup2;</span></p>
                                </div>
                                <a href={item.url || '#'} target={item.url ? '_blank' : undefined} rel={item.url ? 'noopener noreferrer' : undefined} className="mt-6 inline-flex items-center gap-1 text-[0.61rem] font-light tracking-[0.2em] text-[#696769] uppercase transition-colors hover:text-[#c8a15a]">
                                    {t('View in 3D')} <ArrowRight className="size-3 rtl:rotate-180" />
                                </a>
                            </div>
                        ))}
                    </div>
                )}
                {sections.homes3d.note && (
                    <div className="mt-8 flex items-center gap-3">
                        <span className="h-px w-8 bg-gold" />
                        <p className="text-[0.8rem] font-light text-[#716f70]">{sections.homes3d.note}</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export function ProjectFacilities({ project }: { project: WebsiteProject }) {
    if (!project.unitTypes.length) return null;
    return <section id="facilities" className="bg-night py-24"><div className="mx-auto max-w-[1440px] px-6 sm:px-10"><Eyebrow className="text-ink">Facilities</Eyebrow><h2 className="mt-6 max-w-lg text-3xl font-light leading-[1.2] text-ink sm:text-[3rem]">Unit types &amp; floor plans</h2><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{project.unitTypes.map((unit) => <div key={unit.tag} className="rounded-lg border border-hairline/40 p-6"><p className="text-[0.6rem] tracking-[0.22em] text-gold uppercase">{unit.tag}</p><h3 className="mt-2 text-lg text-ink">{unit.name}</h3><p className="mt-2 text-sm text-ink-muted">{unit.size}</p></div>)}</div></div></section>;
}

export function Masterplan({ project, sections }: { project: WebsiteProject; sections: ProjectSections }) {
    const { t } = useI18n();
    const { data, setData, post, processing, errors, recentlySuccessful, setError, clearErrors } = useForm<BrochureForm>({
        name: '',
        phone: '',
        email: '',
        project_id: String(project.id),
        source_url: typeof window !== 'undefined' ? window.location.href : '',
        _hp_website: '',
    });
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const masterplanImage = imageSource(project.masterplanImage, project.gallery[1], project.gallery[0], project.heroImage);
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();

        let hasErrors = false;
        const name = data.name.trim();
        if (!name || !NAME_PATTERN.test(name)) {
            setError('name', t('Name must contain letters only.'));
            hasErrors = true;
        }
        if (!PHONE_PATTERN.test(data.phone)) {
            setError('phone', t('Phone must contain numbers only.'));
            hasErrors = true;
        }
        if (hasErrors) {
            return;
        }

        post('/brochure-requests', { preserveScroll: true });
    };

    return <section id="brochure" className="bg-night py-24 sm:py-28"><div className="mx-auto grid max-w-[1440px] gap-12 px-6 sm:px-10 md:grid-cols-[1fr_40%]"><div><Eyebrow className="text-ink">{t('Masterplan & brochure')}</Eyebrow><h2 className="mt-6 text-3xl font-light leading-[1.2] text-ink sm:text-[2.9rem]">{sections.masterplan.heading}</h2><p className="mt-6 text-sm leading-relaxed text-ink-muted">{sections.masterplan.description}</p><figure className="relative mt-8">{masterplanImage && <img src={masterplanImage} alt="KLOVE masterplan render" className="h-[320px] w-full border-2 border-hairline/80 object-cover sm:h-[450px]" />}</figure></div>
        <div className="bg-surface-card/70 p-7"><h3 className="text-lg font-light text-ink">{sections.masterplan.brochureHeading}</h3><p className="mt-1 text-xs text-ink-muted">{sections.masterplan.brochureDescription}</p>
            <form className="mt-6 space-y-5" onSubmit={submit} noValidate>
                {(flash?.success || recentlySuccessful) && <p className="rounded border border-emerald-700/40 bg-emerald-950/50 px-3 py-2 text-xs text-emerald-300">{flash?.success ?? t('Brochure request received.')}</p>}
                <label className="block text-[0.6rem] tracking-[0.24em] text-ink-muted uppercase">{t('Name')}<input type="text" value={data.name} onChange={(event) => setData('name', event.target.value.replace(/[^\p{L}\s]/gu, ''))} required placeholder={t('Your name')} className="mt-2 w-full border border-hairline/60 bg-night px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-gold focus:outline-none" />{errors.name && <span className="mt-1 block text-xs text-rose-400">{errors.name}</span>}</label>
                <label className="block text-[0.6rem] tracking-[0.24em] text-ink-muted uppercase">{t('Phone')}<input type="tel" inputMode="numeric" value={data.phone} onChange={(event) => setData('phone', event.target.value.replace(/\D/g, ''))} required placeholder={t('Your number')} className="mt-2 w-full border border-hairline/60 bg-night px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-gold focus:outline-none" />{errors.phone && <span className="mt-1 block text-xs text-rose-400">{errors.phone}</span>}</label>
                <input type="hidden" value={data.source_url} onChange={() => undefined} />
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true"><label>Do not fill<input type="text" tabIndex={-1} autoComplete="off" value={data._hp_website} onChange={(event) => setData('_hp_website', event.target.value)} /></label></div>
                <button type="submit" disabled={processing} className="flex w-full items-center justify-center gap-3 border border-gold px-6 py-3.5 text-[0.7rem] tracking-[0.18em] text-ink uppercase transition-colors hover:bg-gold/10 disabled:opacity-60">{processing ? t('Sending...') : t('Download brochure')} <ArrowRight className="size-3.5 rtl:rotate-180" /></button>
                <p className="text-center text-[0.65rem] text-ink-muted">{t("We'll only use this to send the brochure and follow up.")}</p>
            </form>
        </div></div></section>;
}

export function VirtualTour({ project, sections }: { project: WebsiteProject; sections: ProjectSections }) {
    const [open, setOpen] = useState(false);
    const { t } = useI18n();
    return <><section id="virtual-tour" className="relative overflow-hidden border-b border-hairline/30 py-20" style={{ backgroundImage: 'radial-gradient(ellipse 100% 100% at 55% 10%, rgba(164, 121, 43, 0.30) 0%, rgba(115, 79, 27, 0.2) 55%, transparent 72%)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}><div className="mx-auto max-w-3xl px-6 text-center"><button type="button" onClick={() => setOpen(true)} aria-label={t('Play virtual tour video')} className="mx-auto grid size-11 place-items-center rounded-full border border-gold text-gold transition-all duration-300 hover:scale-110 hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"><Play className="size-4 translate-x-[1px]" /></button><Eyebrow className="mt-6 justify-center text-ink">{t('Virtual tour')}</Eyebrow><h2 className="mt-5 text-3xl font-light leading-[1.2] text-ink sm:text-[2.3rem]">{sections.virtualTour.heading}</h2><p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">{sections.virtualTour.description}</p><button type="button" onClick={() => setOpen(true)} className="mt-8 inline-flex items-center gap-3 border border-gold px-7 py-3.5 text-[0.7rem] tracking-[0.18em] text-ink uppercase transition-colors hover:bg-gold/10">{t('Start the virtual tour')} <ArrowRight className="size-3.5 rtl:rotate-180" /></button></div></section>{open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-night/90 backdrop-blur-sm" onClick={() => setOpen(false)}><div className="relative mx-4 w-full max-w-4xl" onClick={(e) => e.stopPropagation()}><button type="button" onClick={() => setOpen(false)} className="absolute -top-10 right-0 flex items-center gap-2 text-xs tracking-[0.15em] text-ink-muted uppercase hover:text-ink">{t('Close')} <X className="size-3.5" /></button><div className="relative aspect-video w-full border border-hairline/30"><iframe src={sections.virtualTour.videoUrl} title="KLOVE New Cairo — Virtual Tour" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="size-full" /></div></div></div>}</>;
}

export function ConstructionUpdates({ project, sections }: { project: WebsiteProject; sections: ProjectSections }) {
    const { t } = useI18n();
    const items = sections.construction.items ?? [];
    return (
        <section id="construction" className="bg-[#f4f3f1] py-24 sm:py-28">
            <div className="mx-auto max-w-[1096px] px-6 sm:px-8">
                <Eyebrow tone="light">{t('Construction updates')}</Eyebrow>
                <h2 className="mt-5 max-w-[520px] text-[2.65rem] font-light leading-[1.08] tracking-[-0.025em] sm:text-[3rem] text-paper-ink">{sections.construction.heading}</h2>
                <p className="mt-6 max-w-[510px] text-[0.95rem] font-light leading-[1.65] text-[#716f70]">{sections.construction.description}</p>
                {items.length > 0 && (
                    <div className="mt-12 grid gap-5 sm:grid-cols-3">
                        {items.map((item, i) => (
                            <article key={i}>
                                <div className="aspect-[16/10] overflow-hidden bg-[#e8e7e5]">
                                    {imageSource(item.image, project.updates[i]?.image, project.gallery[i], project.gallery[0], project.heroImage) && <img src={imageSource(item.image, project.updates[i]?.image, project.gallery[i], project.gallery[0], project.heroImage)} alt={item.title} className="size-full object-cover" loading="lazy" />}
                                </div>
                                <p className="mt-4 text-[0.62rem] font-light tracking-[0.2em] text-[#858283] uppercase">{item.tag}</p>
                                <h3 className="mt-2 text-[0.95rem] font-light text-paper-ink">{item.title}</h3>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export function Amenities({ project, sections }: { project: WebsiteProject; sections: ProjectSections }) {
    const { t } = useI18n();
    const categories = sections.amenities.categories ?? [];
    const iconFor = (item: { icon: string | null; title: string }) => {
        const key = item.icon ?? project.amenities.find((amenity) => amenity.title === item.title)?.icon;
        return key && key in icons ? icons[key as keyof typeof icons] : User;
    };

    return (
        <section id="amenities" className="bg-night py-24">
            <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
                <Eyebrow className="text-ink">{t('Amenities & services')}</Eyebrow>
                <h2 className="mt-6 max-w-lg text-3xl font-light leading-[1.2] text-ink sm:text-[3rem]">{sections.amenities.heading}</h2>
                <div className="mt-12 space-y-16">
                    {categories.map((cat, ci) => (
                        <div key={ci} className="flex justify-center">
                            <div className="w-full max-w-[1080px]">
                                <p className="text-[0.6rem] tracking-[0.24em] text-ink-muted uppercase">{cat.title}</p>
                                <div className="mt-4 border-b border-hairline/40" />
                                <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-8">
                                    {cat.items.map((item, ii) => {
                                        const Icon = iconFor(item);
                                        return (
                                            <div key={ii}>
                                                <span className="grid size-12 place-items-center overflow-hidden rounded-full border border-gold/60">
                                                    {item.icon && (item.icon.startsWith('http') || item.icon.startsWith('/')) ? (
                                                        <img src={item.icon} alt={item.title} className="size-5 object-contain" style={{ filter: 'brightness(0) invert(0.6)' }} />
                                                    ) : (
                                                        <Icon className="size-4 text-gold" />
                                                    )}
                                                </span>
                                                <h3 className="mt-4 text-sm text-ink">{item.title}</h3>
                                                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.description}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function LocationMap({ project, sections }: { project: WebsiteProject; sections: ProjectSections }) {
    const { t } = useI18n();
    const nearby = sections.location.nearbyLocations ?? [];
    const whatsappUrl = sections.cta.whatsappNumber ? `https://wa.me/${sections.cta.whatsappNumber.replace(/[^0-9]/g, '')}` : '#';
    const locationImage = imageSource(sections.location.image, project.mapImage, project.gallery[2], project.gallery[0], project.heroImage);

    return <><section id="location" className="bg-paper py-24"><div className="mx-auto grid max-w-[1440px] gap-12 px-6 sm:px-10 md:grid-cols-2 md:items-center md:grid-cols-[1fr_50%]"><div><Eyebrow tone="light">{t('Location & map')}</Eyebrow><h2 className="mt-6 text-3xl font-light leading-[1.2] text-paper-ink sm:text-[3rem]">{sections.location.heading}</h2><p className="mt-6 text-sm leading-relaxed text-paper-muted">{sections.location.description}</p>{nearby.length > 0 && <ul className="mt-8">{nearby.map((drive, i) => <li key={i} className="flex items-baseline justify-between border-b border-paper-muted/25 py-4"><span className="text-md text-paper-ink/80">{drive.place}</span><span className="text-lg font-light text-paper-muted">{drive.time}</span></li>)}</ul>}<p className="mt-5 text-xs text-paper-muted">{sections.location.gateNote}</p><p className="mt-2 text-[0.7rem] text-paper-muted/70">{sections.location.driveNote}</p></div><figure className="relative">{locationImage && <img src={locationImage} alt={t('Interactive map')} className="h-full max-h-[600px] w-full object-cover" loading="lazy" />}</figure></div></section>
        <section className="bg-gradient-to-b from-surface-deep to-night py-24 text-center" style={{ backgroundImage: 'radial-gradient(ellipse 100% 100% at 55% 10%, rgba(164, 121, 43, 0.30) 0%, rgba(115, 79, 27, 0.2) 55%, transparent 72%)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}><div className="mx-auto max-w-2xl px-6"><Eyebrow className="justify-center text-ink">{sections.cta.eyebrow}</Eyebrow><h2 className="mt-6 text-3xl font-light leading-[1.3] text-ink sm:text-[3rem]">{sections.cta.heading}</h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                <a href="#brochure" className="inline-flex items-center gap-3 border border-gold px-6 py-4 text-[0.7rem] tracking-[0.18em] text-ink uppercase transition-colors hover:bg-gold/10">{sections.cta.primaryCtaLabel || t('Request pricing & payment plan')} <ArrowRight className="size-3.5 rtl:rotate-180" /></a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-[0.7rem] tracking-[0.18em] text-ink-muted uppercase hover:text-ink">{sections.cta.secondaryCtaLabel || t('WhatsApp us')}</a>
            </div>
        </div></section></>;
}
