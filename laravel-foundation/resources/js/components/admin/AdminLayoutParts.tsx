import { useState, type ReactNode } from 'react';
import { X } from 'lucide-react';

export function Breadcrumbs({ items }: { items: string[] }) {
    return (
        <nav aria-label="Breadcrumb" className="text-xs font-medium text-[#C5A880]/70 uppercase tracking-wider">
            {items.join(' / ')}
        </nav>
    );
}

export function Notification({ message }: { message?: string | null }) {
    return message ? (
        <div role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400 shadow-lg backdrop-blur-md">
            {message}
        </div>
    ) : null;
}

export function ConfirmationModal({ open, title, message, onCancel, onConfirm }: { open: boolean; title: string; message: string; onCancel: () => void; onConfirm: () => void }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#161619] p-6 text-white shadow-2xl">
                <div className="flex items-start justify-between">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <button type="button" onClick={onCancel} aria-label="Close" className="rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white">
                        <X className="size-5" />
                    </button>
                </div>
                <p className="mt-3 text-sm text-white/60">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onCancel} className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition-all hover:bg-white/10 hover:text-white">
                        إلغاء / Cancel
                    </button>
                    <button type="button" onClick={onConfirm} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:bg-rose-500">
                        تأكيد / Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export function Pagination({ current = 1, total = 1 }: { current?: number; total?: number }) {
    return (
        <div className="flex items-center justify-between text-xs text-white/50">
            <span>Page {current} of {total}</span>
            <div className="flex gap-2">
                <button type="button" disabled={current <= 1} className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 transition-all hover:border-[#C5A880] hover:text-white disabled:opacity-30">
                    Previous
                </button>
                <button type="button" disabled={current >= total} className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 transition-all hover:border-[#C5A880] hover:text-white disabled:opacity-30">
                    Next
                </button>
            </div>
        </div>
    );
}

export function SearchInput({ value, onChange, placeholder = 'Search...' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
    return (
        <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="h-[42px] w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30"
        />
    );
}

export function FilterSelect({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-[42px] rounded-xl border border-white/15 bg-[#1e1e22] px-3.5 text-sm text-white/90 outline-none focus:border-[#C5A880]"
        >
            {options.map((option) => (
                <option key={option} className="bg-[#19191c] text-white">
                    {option}
                </option>
            ))}
        </select>
    );
}

export function StatusBadge({ status }: { status: string }) {
    return (
        <span className="inline-flex items-center rounded-full border border-[#C5A880]/30 bg-[#C5A880]/10 px-3 py-1 text-xs font-semibold text-[#C5A880]">
            {status}
        </span>
    );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.01] px-6 py-12 text-center">
            <h2 className="text-lg font-medium text-white/80">{title}</h2>
            <p className="mt-2 text-sm text-white/40">{message}</p>
        </div>
    );
}

export function FormField({ label, children, error }: { label: string; children: ReactNode; error?: string }) {
    return (
        <label className="block text-sm text-white/80">
            <span className="mb-2 block text-xs font-medium text-white/70 uppercase tracking-wider">{label}</span>
            {children}
            {error && <span className="mt-1 block text-xs text-rose-400">{error}</span>}
        </label>
    );
}

export function ImageUploadField({ label = 'Image', onChange }: { label?: string; onChange?: (file: File | null) => void }) {
    return (
        <FormField label={label}>
            <input
                type="file"
                accept="image/*"
                onChange={(event) => onChange?.(event.target.files?.[0] ?? null)}
                className="block w-full rounded-xl border border-white/15 bg-[#1e1e22] px-3 py-2 text-sm text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-[#C5A880]/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#C5A880]"
            />
        </FormField>
    );
}

export function FileUploadField({ label = 'File', onChange }: { label?: string; onChange?: (file: File | null) => void }) {
    return (
        <FormField label={label}>
            <input
                type="file"
                onChange={(event) => onChange?.(event.target.files?.[0] ?? null)}
                className="block w-full rounded-xl border border-white/15 bg-[#1e1e22] px-3 py-2 text-sm text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-[#C5A880]/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#C5A880]"
            />
        </FormField>
    );
}
