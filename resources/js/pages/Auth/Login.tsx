import Checkbox from '@/components/Checkbox';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="تسجيل الدخول - لوحة التحكم" />

            {/* Header Title inside card */}
            <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl border border-[#C5A880]/30 bg-[#C5A880]/10 text-[#C5A880]">
                    <ShieldCheck className="size-6" />
                </div>
                <h1 className="text-xl font-bold tracking-wide text-white sm:text-2xl">
                    تسجيل الدخول
                </h1>
                <p className="mt-1 text-xs text-white/50">
                    أدخل بيانات حسابك للوصول إلى لوحة التحكم
                </p>
            </div>

            {status && (
                <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-center text-xs font-medium text-emerald-400">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* Email Input */}
                <div>
                    <InputLabel htmlFor="email" value="البريد الإلكتروني / Email" />

                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40">
                            <Mail className="size-4" />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="h-[50px] pl-10 pr-4 text-left"
                            placeholder="admin@larz.com"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>

                    <InputError message={errors.email} className="mt-2 text-xs" />
                </div>

                {/* Password Input */}
                <div>
                    <InputLabel htmlFor="password" value="كلمة المرور / Password" />

                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40">
                            <Lock className="size-4" />
                        </div>
                        <TextInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className="h-[50px] pl-10 pr-10"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/40 transition-colors hover:text-white"
                            aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                        >
                            {showPassword ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    </div>

                    <InputError message={errors.password} className="mt-2 text-xs" />
                </div>

                {/* Options Row */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    'remember',
                                    (e.target.checked || false) as false,
                                )
                            }
                        />
                        <span className="text-xs text-white/70 hover:text-white transition-colors">
                            تذكرني
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs text-[#C5A880] transition-colors hover:text-amber-300 hover:underline"
                        >
                            نسيت كلمة المرور؟
                        </Link>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <PrimaryButton className="h-[50px]" disabled={processing}>
                        {processing ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="size-4 animate-spin" />
                                جاري التحقق...
                            </span>
                        ) : (
                            'تسجيل الدخول'
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
