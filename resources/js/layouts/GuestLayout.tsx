import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0c0c0e] px-4 py-8 font-sans text-white">
            {/* Ambient background glowing effects */}
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#C5A880]/10 blur-[140px]" />
            <div className="pointer-events-none absolute -bottom-40 -left-20 h-[400px] w-[400px] rounded-full bg-amber-600/5 blur-[120px]" />
            <div className="pointer-events-none absolute top-1/3 -right-20 h-[350px] w-[350px] rounded-full bg-[#D4AF37]/5 blur-[100px]" />

            {/* Back to website link */}
            <div className="absolute top-6 left-6 z-20">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                    <ArrowLeft className="size-3.5" />
                    <span>العودة للموقع الرئيسي</span>
                </Link>
            </div>

            {/* Container */}
            <div className="relative z-10 flex w-full max-w-md flex-col items-center">
                {/* Brand Logo Header */}
                <div className="mb-8 flex flex-col items-center text-center">
                    <Link href="/" aria-label="LARZ home" className="group flex flex-col items-center">
                        <span className="text-3xl font-semibold tracking-[0.25em] text-white transition-colors duration-300 group-hover:text-[#C5A880]">
                            LARZ<sup className="ml-0.5 align-super text-[0.4em]">®</sup>
                        </span>
                        <span className="mt-1 text-[0.55rem] tracking-[0.35em] text-white/40 uppercase transition-colors duration-300 group-hover:text-white/60">
                            developments
                        </span>
                    </Link>
                </div>

                {/* Login Glassmorphism Card */}
                <div className="w-full rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-8">
                    {children}
                </div>

                {/* Footer copyright note */}
                <div className="mt-8 text-center text-xs text-white/30">
                    &copy; {new Date().getFullYear()} LARZ Developments. All rights reserved.
                </div>
            </div>
        </div>
    );
}
