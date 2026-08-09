import { Link } from '@inertiajs/react';
import { useI18n } from '@/i18n';

export function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
    const { locale } = useI18n();
    const next = locale === 'ar' ? 'en' : 'ar';

    return (
        <Link
            href={`/language/${next}`}
            preserveScroll
            className={`inline-flex items-center rounded-full border px-3 py-1 text-[0.65rem] font-medium tracking-[0.16em] uppercase transition-colors ${dark ? 'border-white/15 text-white/70 hover:border-white/40 hover:text-white' : 'border-slate-700 text-slate-300 hover:border-[#C5A880] hover:text-[#C5A880]'}`}
            aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
        >
            {locale === 'ar' ? 'EN' : 'عربي'}
        </Link>
    );
}
