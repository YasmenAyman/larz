import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function AnimationWrapper({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn(className)}>{children}</div>;
}
