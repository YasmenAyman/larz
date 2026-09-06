import { Head, usePage } from '@inertiajs/react';
import type { WebsiteSharedProps } from '@/types/website';

export default function Maintenance({ locale, title, message }: { locale: 'en' | 'ar'; title: string; message: string }) {
    const isArabic = locale === 'ar';
    const nextLocale = isArabic ? 'en' : 'ar';
    const { props } = usePage<WebsiteSharedProps>();
    const logo = props.site.settings['brand.logo'];

    return (
        <>
            <Head title={title} />
            <main dir={isArabic ? 'rtl' : 'ltr'} className="relative grid min-h-screen place-items-center overflow-hidden bg-[#101013] px-6 text-white">
                <div aria-hidden="true" className="absolute -top-40 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-[#C5A880]/10 blur-[150px]" />
                <div className="relative w-full max-w-2xl text-center">
                    <a href={`/language/${nextLocale}`} className="absolute top-0 right-0 rounded-full border border-white/20 px-4 py-2 text-xs text-white/80 transition hover:border-[#C5A880] hover:text-[#C5A880]">
                        {isArabic ? 'English' : 'العربية'}
                    </a>
                    {logo ? (
                        <img src={logo} alt="LARZ Developments" className="mx-auto h-16 w-auto max-w-[260px] object-contain sm:h-20" />
                    ) : (
                        <p className="text-xs font-semibold tracking-[0.35em] text-[#C5A880] uppercase">LARZ Developments</p>
                    )}
                    <h1 className="mt-10 text-4xl font-semibold leading-tight sm:text-6xl">{title}</h1>
                    <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">{message}</p>
                </div>
            </main>
        </>
    );
}
