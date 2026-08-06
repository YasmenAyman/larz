import { Link } from '@inertiajs/react';

export function Logo({
    size = 'sm',
    withTagline = false,
}: {
    size?: 'sm' | 'lg';
    withTagline?: boolean;
}) {
    return (
        <Link href="/" aria-label="LARZ Developments — home" className="inline-block">
            <span
                className={
                    size === 'lg'
                        ? 'block text-4xl font-semibold tracking-[0.12em] text-ink sm:text-5xl'
                        : 'block text-lg font-semibold tracking-[0.18em] text-ink'
                }
            >
                LARZ<sup className="ml-0.5 align-super text-[0.4em]">®</sup>
            </span>
            {withTagline && (
                <span className="mt-1 block text-center text-[0.6rem] tracking-[0.42em] text-ink-muted">
                    DEVELOPMENTS
                </span>
            )}
        </Link>
    );
}
