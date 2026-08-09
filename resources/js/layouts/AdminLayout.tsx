import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
    }, []);
    return (
        <div dir="ltr" className="admin-shell relative min-h-screen bg-[#0c0c0e] font-sans text-white antialiased">
            {/* Ambient background glows */}
            <div className="pointer-events-none fixed -top-40 left-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#C5A880]/5 blur-[160px]" />
            <div className="pointer-events-none fixed top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-amber-600/5 blur-[140px]" />

            <div className="relative z-10 flex min-h-screen">
                <AdminSidebar open={open} onClose={() => setOpen(false)} />
                <div className="min-w-0 flex-1 flex flex-col">
                    <AdminHeader onMenu={() => setOpen(true)} />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
                </div>
            </div>
        </div>
    );
}
