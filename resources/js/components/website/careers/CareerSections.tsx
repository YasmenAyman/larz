import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { ArrowRight, ChartNoAxesCombined, Heart, Leaf, Medal, X } from 'lucide-react';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { useI18n } from '@/i18n';
type CareerFormData = { job_position_id: string; internship_program_id: string; name: string; email: string; phone: string; resume: File | null; cover_note: string; cover_letter: string; consent_at: string; source_url: string; _hp_website: string };

const NAME_PATTERN = /^[\p{L}\s]+$/u;
const PHONE_PATTERN = /^[0-9]{6,40}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CareersHero({ hero }: { hero: { eyebrow?: string; heading: string; description: string; backgroundImage?: string } }) {
    const [showCvForm, setShowCvForm] = useState(false);
    const { t } = useI18n();
    const background = hero.backgroundImage ?? '';
    return (
        <section className="relative overflow-hidden border-b border-hairline/30 bg-night" style={{
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
              url(${background})
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}>
            <div className="relative mx-auto flex min-h-[800px] max-w-[1440px] flex-col justify-center px-6 pt-36 pb-20 sm:px-10 lg:px-24">
                <Eyebrow className="text-ink">{hero.eyebrow ?? t('Careers')}</Eyebrow>
                <h1 className="mt-7 max-w-2xl text-3xl font-light leading-[1.08] tracking-[-0.03em] sm:text-6xl lg:text-[4.25rem]">{(hero.heading ?? `${t('Build your future')} ${t('with LARZ.')}`).replace(/\\n/g, ' ')}</h1>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-muted">{hero.description}</p>
                <div className="mt-8 flex flex-wrap items-center gap-6"><a href="#roles" className="inline-flex items-center gap-3 border border-gold px-5 py-3 text-[0.62rem] tracking-[0.2em] text-ink uppercase hover:bg-gold/10">{t('Vacancies')} <ArrowRight className="size-3.5 rtl:rotate-180" strokeWidth={1.5} /></a><button type="button" onClick={() => setShowCvForm(true)} className="text-[0.6rem] tracking-[0.2em] text-ink-muted uppercase hover:text-ink">{t('Send your CV')}</button></div>
            </div>
            {showCvForm && <CareerFormModal title={t('Send your CV')} onClose={() => setShowCvForm(false)} />}
        </section>
    );
}

export function WhyLarz({ values, settings }: { values: Array<{ title: string; description: string; icon: string }>; settings: { eyebrow: string; heading: string; description: string | null } }) {
    return <section className="bg-paper py-20 text-paper-ink sm:py-24"><div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-24"><Eyebrow tone="light">{settings.eyebrow}</Eyebrow><h2 className="mt-5 max-w-xl text-4xl font-light leading-[1.1] sm:text-[2.5rem]">{settings.heading}</h2>{settings.description && <p className="mt-4 max-w-2xl text-sm text-paper-muted">{settings.description}</p>}<div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{values.map(({ icon, title, description }) => { const Icon = ({ heart: Heart, growth: ChartNoAxesCombined, leaf: Leaf, medal: Medal } as const)[icon as 'heart' | 'growth' | 'leaf' | 'medal'] ?? Heart; return <article key={title}><div className="grid size-12 place-items-center rounded-full border border-gold text-gold"><Icon className="size-5" strokeWidth={2} /></div><h3 className="mt-4 text-md font-semibold text-paper-ink">{title}</h3><p className="mt-2 text-sm leading-relaxed text-paper-muted/90">{description}</p></article>; })}</div></div></section>;
}

export function OpenRoles({ jobs, settings }: { jobs: Array<{ id: number; slug: string; title: string; department: string; location: string; employmentType: string }>; settings: { eyebrow: string; heading: string; description: string | null } }) {
    const [activeRole, setActiveRole] = useState<{ id: number; title: string; slug: string } | null>(null);
    const { t } = useI18n();
    return <section id="roles" className="bg-night py-20 sm:py-24"><div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-24"><Eyebrow className="text-ink">{settings.eyebrow}</Eyebrow><h2 className="mt-5 text-4xl font-light text-ink sm:text-[2.5rem]">{settings.heading}</h2>{settings.description && <p className="mt-4 max-w-2xl text-sm text-ink-muted">{settings.description}</p>}<div className="mt-8 border-t border-hairline/45">{jobs.map(({ id, slug, title, department, location, employmentType }) => <div key={id} className="flex flex-col gap-4 border-b border-hairline/45 py-7 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-lg text-ink">{title}</h3><p className="mt-2 text-sm text-ink-muted">{department} · {location} · {employmentType}</p></div><button type="button" onClick={() => setActiveRole({ id, title, slug })} className="inline-flex w-fit items-center gap-3 border border-gold px-4 py-2 text-sm tracking-[0.18em] text-ink uppercase hover:bg-gold/10">{t('Apply')} <ArrowRight className="size-3 rtl:rotate-180" strokeWidth={1.5} /></button></div>)}</div></div>{activeRole && <CareerFormModal title={`${t('Apply for')} ${activeRole.title}`} roleId={activeRole.id} jobSlug={activeRole.slug} onClose={() => setActiveRole(null)} />}</section>;
}

export function InternshipPrograms({ internship, settings }: { internship: { id: number; title: string; description: string; cta_label: string }; settings: { eyebrow: string; heading: string; description: string; cta_label: string; image: string } }) {
    const [showForm, setShowForm] = useState(false);
    const { t } = useI18n();
    return <section id="internship" className="bg-paper py-20 text-paper-ink sm:py-24"><div className="mx-auto grid max-w-[1440px] items-center gap-12 px-6 sm:px-10 lg:grid-cols-[1fr_50%] lg:px-24"><div className="max-w-xl"><Eyebrow tone="light">{settings.eyebrow}</Eyebrow><h2 className="mt-5 text-4xl leading-[1.08] font-light sm:text-[3rem]">{settings.heading}</h2><p className="mt-6 text-md leading-relaxed text-paper-muted/80">{settings.description}</p><button type="button" onClick={() => setShowForm(true)} className="mt-7 inline-flex items-center gap-3 border border-gold px-5 py-3 text-[0.8rem] tracking-[0.2em] text-paper-ink uppercase hover:bg-gold/10">{settings.cta_label} <ArrowRight className="size-3.5 rtl:rotate-180" strokeWidth={1.5} /></button></div><figure className="relative h-[360px] overflow-hidden border border-paper-muted/30 bg-[#e4e4e7] sm:h-[520px]"><img src={settings.image} alt={settings.heading} className="size-full object-cover" /></figure></div>{showForm && <CareerFormModal title={t('Apply for the internship program')} internshipId={internship.id} onClose={() => setShowForm(false)} />}</section>;
}

export function CareersCta({ cta }: { cta: { eyebrow: string; heading: string; cta_label: string } }) {
    const [showCvForm, setShowCvForm] = useState(false);
    const { t } = useI18n();
    return <section id="cv" className="relative overflow-hidden bg-night py-20 text-center sm:py-32" style={{ backgroundImage: 'radial-gradient(ellipse 90% 100% at 55% 10%, rgba(164, 121, 43, 0.30) 0%, rgba(115, 79, 27, 0.2) 55%, transparent 72%)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}><div className="relative mx-auto max-w-2xl px-6"><Eyebrow className="justify-center text-ink">{cta.eyebrow}</Eyebrow><h2 className="mt-5 text-3xl leading-[1.12] font-light text-ink sm:text-[3rem]">{cta.heading}</h2><button type="button" onClick={() => setShowCvForm(true)} className="mt-8 inline-flex items-center gap-3 border border-gold px-5 py-3 text-[0.9rem] tracking-[0.2em] text-ink uppercase hover:bg-gold/10">{cta.cta_label} <ArrowRight className="size-3.5 rtl:rotate-180" strokeWidth={1.5} /></button></div>{showCvForm && <CareerFormModal title={t('Send your CV')} onClose={() => setShowCvForm(false)} />}</section>;
}

function CareerFormModal({ title, roleId, internshipId, jobSlug, onClose }: { title: string; roleId?: number; internshipId?: number; jobSlug?: string; onClose: () => void }) {
    const action = roleId ? (jobSlug ? `/careers/${jobSlug}/apply` : '/career-general-applications') : internshipId ? '/internship-applications' : '/career-general-applications';
    const { t } = useI18n();
    const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm<CareerFormData>({ job_position_id: roleId ? String(roleId) : '', internship_program_id: internshipId ? String(internshipId) : '', name: '', email: '', phone: '', resume: null, cover_note: '', cover_letter: '', consent_at: new Date().toISOString(), source_url: typeof window !== 'undefined' ? window.location.href : '', _hp_website: '' });
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
        const email = data.email.trim();
        if (!email || !EMAIL_PATTERN.test(email)) {
            setError('email', t('Please enter a valid email address (e.g. name@example.com).'));
            hasErrors = true;
        }
        if (hasErrors) {
            return;
        }

        post(action, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-night/85 px-4 py-8 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
            <div className="relative max-h-full w-full max-w-xl overflow-y-auto border border-hairline/60 bg-surface-deep p-6 text-left shadow-2xl sm:p-8" onClick={(event) => event.stopPropagation()}>
                <button type="button" onClick={onClose} aria-label={t('Close')} className="absolute top-5 right-5 text-ink-muted transition-colors hover:text-ink"><X className="size-5" /></button>
                <Eyebrow className="text-ink">{t('Careers')}</Eyebrow>
                <h2 className="mt-5 pr-8 text-3xl font-light text-ink">{title}</h2>
                <p className="mt-2 text-sm text-ink-muted">{t('Share your details and our team will get back to you.')}</p>
                <form className="mt-7 space-y-5" onSubmit={submit} noValidate>
                    {roleId && <input type="hidden" name="job_position_id" value={data.job_position_id} />}
                    {internshipId && <input type="hidden" name="internship_program_id" value={data.internship_program_id} />}
                    <label className="block text-[0.6rem] tracking-[0.2em] text-ink-muted uppercase">{t('Name')}<input required type="text" value={data.name} onChange={(event) => setData('name', event.target.value.replace(/[^\p{L}\s]/gu, ''))} placeholder={t('Your name')} className="mt-2 block w-full border border-hairline/60 bg-night px-4 py-3 text-sm normal-case tracking-normal text-ink outline-none placeholder:text-ink-muted focus:border-gold" />{errors.name && <span className="mt-1 block text-xs text-rose-400">{errors.name}</span>}</label>
                    <label className="block text-[0.6rem] tracking-[0.2em] text-ink-muted uppercase">{t('Email')}<input required type="email" value={data.email} onChange={(event) => setData('email', event.target.value.replace(/\s/g, ''))} placeholder={t('Your email address')} className="mt-2 block w-full border border-hairline/60 bg-night px-4 py-3 text-sm normal-case tracking-normal text-ink outline-none placeholder:text-ink-muted focus:border-gold" />{errors.email && <span className="mt-1 block text-xs text-rose-400">{errors.email}</span>}</label>
                    <label className="block text-[0.6rem] tracking-[0.2em] text-ink-muted uppercase">{t('Phone')}<input required type="tel" inputMode="numeric" value={data.phone} onChange={(event) => setData('phone', event.target.value.replace(/\D/g, ''))} placeholder={t('Your phone number')} className="mt-2 block w-full border border-hairline/60 bg-night px-4 py-3 text-sm normal-case tracking-normal text-ink outline-none placeholder:text-ink-muted focus:border-gold" />{errors.phone && <span className="mt-1 block text-xs text-rose-400">{errors.phone}</span>}</label>
                    <label className="block text-[0.6rem] tracking-[0.2em] text-ink-muted uppercase">{t('CV / Resume')}<input required type="file" accept=".pdf,.doc,.docx" onChange={(event) => setData('resume', event.target.files?.[0] ?? null)} className="mt-2 block w-full border border-hairline/60 bg-night px-4 py-3 text-sm normal-case tracking-normal text-ink file:mr-4 file:border-0 file:bg-transparent file:text-xs file:text-ink-muted" />{errors.resume && <span className="mt-1 block text-xs text-rose-400">{errors.resume}</span>}</label>
                    <label className="block text-[0.6rem] tracking-[0.2em] text-ink-muted uppercase">{t('Message')}<textarea rows={4} value={roleId ? data.cover_note : data.cover_letter} onChange={(event) => roleId ? setData('cover_note', event.target.value) : setData('cover_letter', event.target.value)} placeholder={t('Tell us a little about yourself')} className="mt-2 block w-full resize-none border border-hairline/60 bg-night px-4 py-3 text-sm normal-case tracking-normal text-ink outline-none placeholder:text-ink-muted focus:border-gold" /></label>
                    <input type="hidden" value={data.consent_at} onChange={() => undefined} />
                    <input type="hidden" value={data.source_url} onChange={() => undefined} />
                    <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true"><label>{t('Do not fill')}<input type="text" tabIndex={-1} autoComplete="off" value={data._hp_website} onChange={(event) => setData('_hp_website', event.target.value)} /></label></div>
                    <button type="submit" disabled={processing} className="inline-flex w-full items-center justify-center gap-3 border border-gold px-5 py-3 text-[0.7rem] tracking-[0.2em] text-ink uppercase transition-colors hover:bg-gold/10 disabled:opacity-50">{processing ? t('Sending...') : t('Send application')} <ArrowRight className="size-3.5 rtl:rotate-180" strokeWidth={1.5} /></button>
                </form>
            </div>
        </div>
    );
}
