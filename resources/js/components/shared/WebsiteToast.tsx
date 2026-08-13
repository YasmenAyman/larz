import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, X } from 'lucide-react';
import { useI18n } from '@/i18n';
import type { PageProps } from '@/types';

type ToastState = { message: string; key: number };

const listeners = new Set<(toast: ToastState) => void>();

export function showWebsiteToast(message: string) {
    const toast = { message, key: Date.now() };
    listeners.forEach((listener) => listener(toast));
}

function WebsiteToastHost() {
    const [toast, setToast] = useState<ToastState | null>(null);
    const dir = typeof document !== 'undefined' ? document.documentElement.dir : 'ltr';

    useEffect(() => {
        const listener = (next: ToastState) => setToast(next);
        listeners.add(listener);

        return () => {
            listeners.delete(listener);
        };
    }, []);

    useEffect(() => {
        if (!toast) {
            return undefined;
        }

        const timer = window.setTimeout(() => setToast(null), 5000);

        return () => window.clearTimeout(timer);
    }, [toast]);

    if (!toast) {
        return null;
    }

    return createPortal(
        <div
            role="status"
            aria-live="polite"
            key={toast.key}
            className={`pointer-events-auto fixed top-24 z-[200] w-[min(calc(100vw-3rem),24rem)] ${dir === 'rtl' ? 'left-6' : 'right-6'}`}
            style={{ animation: 'website-toast-in 0.3s ease-out' }}
        >
            <div className="flex items-start gap-3 rounded-lg border border-emerald-600/40 bg-[#0f1a14]/95 px-4 py-3.5 shadow-2xl backdrop-blur-md">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" aria-hidden="true" />
                <p className="flex-1 text-sm leading-relaxed text-emerald-100">{toast.message}</p>
                <button
                    type="button"
                    onClick={() => setToast(null)}
                    className="shrink-0 text-emerald-400/70 transition-colors hover:text-emerald-300"
                    aria-label="Close notification"
                >
                    <X className="size-4" />
                </button>
            </div>
        </div>,
        document.body,
    );
}

export function WebsiteToastHostRoot() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return <WebsiteToastHost />;
}

export function WebsiteFlashToast() {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const { t } = useI18n();
    const lastFlash = useRef<string | null>(null);

    useEffect(() => {
        if (!flash?.success) {
            lastFlash.current = null;
            return;
        }

        if (flash.success === lastFlash.current) {
            return;
        }

        lastFlash.current = flash.success;
        showWebsiteToast(t(flash.success));
    }, [flash?.success, t]);

    return null;
}
