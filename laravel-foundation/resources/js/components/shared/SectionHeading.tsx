import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function SectionHeading({
    eyebrow,
    title,
    description,
    className,
}: {
    eyebrow: string;
    title: ReactNode;
    description?: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('text-center', className)}>
            <p className="text-[0.9rem] lg:text-[1.2rem] tracking-[0.32em] text-ink-dim uppercase">
                {eyebrow}
            </p>
            <h2 className="mx-auto mt-2 max-w-3xl text-2xl leading-[1.25] font-normal text-ink sm:text-3xl md:text-[3.3rem]">
                {title}
            </h2>
            {description && (
                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-muted">
                    {description}
                </p>
            )}
        </div>
    );
}
