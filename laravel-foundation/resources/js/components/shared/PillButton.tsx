import { ArrowUpRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { cn } from '@/utils/cn';

type Props = {
    label: string;
    to?: string;
    className?: string;
    variant?: 'pill' | 'split';
};

export function PillButton({ label, to = '/', className, variant = 'pill' }: Props) {
    if (variant === 'split') {
        return (
            <div className={cn('flex items-center gap-1', className)}>
                <Link
                    href={to}
                    className="rounded-full border border-hairline bg-surface-card/70 px-10 py-3 text-md text-ink transition-colors hover:bg-surface-card"
                >
                    {label}
                </Link>
                <Link
                    href={to}
                    aria-label={label}
                    className="grid w-[70px] h-[50px] place-items-center rounded-full border border-hairline bg-surface-card/70 text-ink transition-colors hover:bg-surface-card"
                >
                    <ArrowUpRight className="size-5" strokeWidth={2} />
                </Link>
            </div>
        );
    }

    return (
        <Link
            href={to}
            className={cn(
                'inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-card/70 px-8 py-2 text-md text-ink transition-colors hover:bg-surface-card',
                className,
            )}
        >
            {label}
            <ArrowUpRight className="size-4" strokeWidth={1.5} />
        </Link>
    );
}
