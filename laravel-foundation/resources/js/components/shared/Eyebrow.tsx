import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function Eyebrow({
    children,
    className,
    tone = 'dark',
}: {
    children: ReactNode;
    className?: string;
    tone?: 'dark' | 'light';
}) {
    return (
        <p
            className={cn(
                'flex items-center gap-3 text-[0.65rem] tracking-[0.28em] uppercase',
                tone === 'dark' ? 'text-ink-muted' : 'text-paper-muted',
                className,
            )}
        >
            <span className="inline-block h-px w-6 bg-gold" />
            {children}
        </p>
    );
}
