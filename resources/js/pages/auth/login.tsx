import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import AuthButton from '@/components/auth/auth-button';
import AuthCard from '@/components/auth/auth-card';
import InputField from '@/components/auth/input-field';
import PasswordField from '@/components/auth/password-field';
import PasskeyVerify from '@/components/passkey-verify';
import { useAuth } from '@/contexts/AuthContext';
import { useAutoDismiss } from '@/hooks/use-auto-dismiss';
import { isValidEmail } from '@/lib/validation';
import { register } from '@/routes';
import { request as forgotPassword } from '@/routes/password';
import type { SharedData } from '@/types';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

type FieldErrors = {
    email?: string;
    password?: string;
};

export default function Login({ status, canResetPassword }: Props) {
    const { login, loading } = useAuth();
    const { errors: serverErrors } = usePage<SharedData>().props;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});

    const successMessage = useAutoDismiss(status);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors: FieldErrors = {};

        if (!isValidEmail(email)) {
            nextErrors.email = 'Escribe un correo electrónico válido.';
        }

        if (password.trim() === '') {
            nextErrors.password = 'Escribe tu contraseña para continuar.';
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        login({ email: email.trim(), password, remember });
    };

    return (
        <>
            <Head title="Iniciar sesión" />

            <AuthCard
                title="Iniciar sesión"
                subtitle="Bienvenido de nuevo a Miami Caracas Express"
                footer={
                    <p>
                        ¿Problemas para acceder? Revisa que tu correo esté bien
                        escrito o restablece tu contraseña.
                    </p>
                }
            >
                {successMessage && (
                    <div
                        role="status"
                        className="mb-4 flex items-start gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs leading-5 font-medium text-amz-green"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="mt-0.5 size-4 shrink-0"
                            aria-hidden="true"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <path
                                d="m8 12 2.5 2.5L16 9"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        {successMessage}
                    </div>
                )}

                <form onSubmit={submit} noValidate className="space-y-4">
                    <InputField
                        id="email"
                        label="Correo electrónico"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="tu@correo.com"
                        autoComplete="email"
                        inputMode="email"
                        autoFocus
                        required
                        error={errors.email ?? serverErrors.email}
                    />

                    <PasswordField
                        id="password"
                        label="Contraseña"
                        value={password}
                        onChange={setPassword}
                        placeholder="Escribe tu contraseña"
                        autoComplete="current-password"
                        required
                        error={errors.password ?? serverErrors.password}
                    />

                    <div className="flex items-center justify-between gap-3">
                        <label
                            htmlFor="remember"
                            className="flex cursor-pointer items-center gap-2 text-xs text-gray-700 select-none"
                        >
                            <input
                                id="remember"
                                name="remember"
                                type="checkbox"
                                checked={remember}
                                onChange={(event) =>
                                    setRemember(event.target.checked)
                                }
                                className="size-4 cursor-pointer rounded border-gray-400 accent-amz-orange"
                            />
                            Recordarme
                        </label>

                        {canResetPassword && (
                            <Link
                                href={forgotPassword()}
                                className="link-mk text-xs font-medium"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                    </div>

                    <AuthButton
                        type="submit"
                        loading={loading}
                        loadingLabel="Verificando..."
                    >
                        Continuar
                    </AuthButton>

                    <p className="text-[11px] leading-4 text-gray-500">
                        Al continuar aceptas las{' '}
                        <a href="#" className="link-mk">
                            condiciones de uso
                        </a>{' '}
                        y el{' '}
                        <a href="#" className="link-mk">
                            aviso de privacidad
                        </a>{' '}
                        de Miami Caracas Express.
                    </p>
                </form>
            </AuthCard>

            <div className="my-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-medium text-gray-500">
                    ¿Nuevo en Miami Caracas Express?
                </span>
                <span className="h-px flex-1 bg-gray-200" />
            </div>

            <Link
                href={register()}
                className="btn-cart flex h-9 w-full items-center justify-center px-4 text-sm font-medium text-gray-900 shadow-sm transition"
            >
                Crear tu cuenta en MCE
            </Link>

            <div className="mt-5">
                <PasskeyVerify
                    label="Iniciar sesión con llave de acceso"
                    loadingLabel="Verificando..."
                    separator="Acceso alternativo"
                />
            </div>
        </>
    );
}
