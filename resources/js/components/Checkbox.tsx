import { InputHTMLAttributes } from 'react';

export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'size-4 rounded border-white/20 bg-[#25252a] text-[#C5A880] focus:ring-[#C5A880]/30 focus:ring-offset-0 accent-[#C5A880] cursor-pointer ' +
                className
            }
        />
    );
}
