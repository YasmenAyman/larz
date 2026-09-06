import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Footer } from '@/components/website/Footer';
import { Header } from '@/components/website/Header';
import { PageUpButton } from '@/components/shared/PageUpButton';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { WebsiteFlashToast } from '@/components/shared/WebsiteToast';
import { useI18n } from '@/i18n';

export default function WebsiteLayout({ children }: { children: ReactNode }) {
    const { dir } = useI18n();
    useEffect(() => {
        document.documentElement.lang = dir === 'rtl' ? 'ar' : 'en';
        document.documentElement.dir = dir;
    }, [dir]);
    return (
        <div dir={dir} className="min-h-screen font-sans text-ink">
            <WebsiteFlashToast />
            <Header />
            <main>{children}</main>
            <PageUpButton />
            <WhatsAppButton />
            <Footer />
        </div>
    );
}
