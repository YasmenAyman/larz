import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn('mx-auto max-w-[1440px] px-4 sm:px-8', className)}>{children}</div>;
}
