import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `h-[50px] inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-[#C5A880] bg-[length:200%_auto] text-sm font-semibold uppercase tracking-[0.15em] text-black shadow-[0_4px_20px_rgba(197,168,128,0.25)] transition-all duration-300 hover:bg-[position:right_center] hover:shadow-[0_6px_25px_rgba(197,168,128,0.4)] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
