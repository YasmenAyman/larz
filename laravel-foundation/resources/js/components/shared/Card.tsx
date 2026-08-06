import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn('rounded-2xl border border-hairline/60 bg-surface-card/50 p-7 backdrop-blur-sm sm:p-8', className)}>
            {children}
        </div>
    );
}
