import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { useI18n } from '@/i18n';

export default function ForgotPassword({ status }: { status?: string }) {
    const { locale, dir } = useI18n();
    const ar = locale === 'ar';
    const c = ar
        ? { title: 'نسيت كلمة المرور؟', intro: 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.', email: 'البريد الإلكتروني', send: 'إرسال رابط إعادة التعيين', sending: 'جارٍ الإرسال...' }
        : { title: 'Forgot password?', intro: 'Enter your email address and we will send you a password reset link.', email: 'Email address', send: 'Email password reset link', sending: 'Sending...' };
    const { data, setData, post, processing, errors } = useForm({ email: '' });
    const submit: FormEventHandler = (e) => { e.preventDefault(); post(route('password.email')); };

    return <GuestLayout><div dir={dir}><Head title={`${c.title} - LARZ`} /><div className="mb-6 text-center"><div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl border border-[#C5A880]/30 bg-[#C5A880]/10 text-[#C5A880]"><Mail className="size-5" /></div><h1 className="text-xl font-bold text-white sm:text-2xl">{c.title}</h1><p className="mt-2 text-sm leading-relaxed text-white/55">{c.intro}</p></div>{status && <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-xs font-medium text-emerald-400">{status}</div>}<form onSubmit={submit}><InputLabel htmlFor="email" value={c.email} /><TextInput id="email" type="email" name="email" value={data.email} className={`mt-2 block h-[50px] w-full ${ar ? 'text-right' : 'text-left'}`} placeholder="admin@larz.com" autoComplete="username" isFocused onChange={(e) => setData('email', e.target.value)} /><InputError message={errors.email} className="mt-2" /><div className="mt-5"><PrimaryButton disabled={processing}>{processing ? <span className="flex items-center gap-2"><Loader2 className="size-4 animate-spin" />{c.sending}</span> : c.send}</PrimaryButton></div></form></div></GuestLayout>;
}
