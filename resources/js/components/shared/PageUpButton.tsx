import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useI18n } from '@/i18n';

export function PageUpButton() {
    const { locale } = useI18n();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const updateVisibility = () => setVisible(window.scrollY > 320);

        updateVisibility();
        window.addEventListener('scroll', updateVisibility, { passive: true });

        return () => window.removeEventListener('scroll', updateVisibility);
    }, []);

    const label = locale === 'ar' ? 'العودة إلى أعلى الصفحة' : 'Back to top';

    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed bottom-6 left-6 z-50 grid size-12 place-items-center rounded-full border border-white/25 bg-black/70 text-white shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-[#C5A880] hover:bg-[#C5A880] hover:text-black active:scale-95 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}
        >
            <ArrowUp className="size-5" strokeWidth={1.8} />
        </button>
    );
}
