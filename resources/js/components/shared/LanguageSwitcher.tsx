import { Link } from '@inertiajs/react';
import { useI18n } from '@/i18n';

export function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
    const { locale } = useI18n();
    const next = locale === 'ar' ? 'en' : 'ar';

    return (
        <Link
            href={`/language/${next}`}
            preserveScroll
            className={`inline-flex items-center rounded-full border px-4 py-2 text-[0.9rem] font-medium tracking-[0.16em] uppercase transition-colors ${dark ? 'border-white/55 text-white/90 hover:border-white/40 hover:text-white' : 'border-slate-700 text-slate-300 hover:border-[#C5A880] hover:text-[#C5A880]'}`}
            style={{ fontFamily: 'Cairo, sans-serif' }}
            aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
        >
            {locale === 'ar' ? 'EN' : 'عربي'}
        </Link>
    );
}
