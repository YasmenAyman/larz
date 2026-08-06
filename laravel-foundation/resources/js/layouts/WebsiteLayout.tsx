import type { ReactNode } from 'react';
import { Footer } from '@/components/website/Footer';
import { Header } from '@/components/website/Header';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';

export default function WebsiteLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-surface font-sans text-ink">
            <Header />
            <main>{children}</main>
            <WhatsAppButton />
            <Footer />
        </div>
    );
}
