import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import AuthButton from '@/components/auth/auth-button';
import AuthCard from '@/components/auth/auth-card';
import InputField from '@/components/auth/input-field';
import { useAutoDismiss } from '@/hooks/use-auto-dismiss';
import { isValidEmail } from '@/lib/validation';
import { login } from '@/routes';
import { email as sendResetLink } from '@/routes/password';
import type { SharedData } from '@/types';

export default function ForgotPassword({ status }: { status?: string }) {
    const { errors: serverErrors } = usePage<SharedData>().props;

    const [email, setEmail] = useState('');
    const [error, setError] = useState<string>();
    const [processing, setProcessing] = useState(false);

    const successMessage = useAutoDismiss(status);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isValidEmail(email)) {
            setError('Escribe un correo electrónico válido.');

            return;
        }

        setError(undefined);

        router.post(
            sendResetLink().url,
            { email: email.trim() },
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <>
            <Head title="Recuperar contraseña" />

            <AuthCard
                title="Recuperar contraseña"
                subtitle="Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña."
                footer={
                    <p>
                        Por seguridad, el enlace caduca después de 60 minutos.
                        Si no lo recibes, revisa tu carpeta de spam.
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
                            <path
                                d="M3 7l9 6 9-6M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                                stroke="currentColor"
                                strokeWidth="1.8"
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
                        error={
                            error ??
                            serverErrors.email ??
                            serverErrors.throttle
                        }
                    />

                    <AuthButton
                        type="submit"
                        loading={processing}
                        loadingLabel="Enviando..."
                    >
                        Enviar enlace
                    </AuthButton>
                </form>
            </AuthCard>

            <div className="mt-4 text-center">
                <Link
                    href={login()}
                    className="link-mk inline-flex items-center gap-1 text-xs font-medium"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="size-3.5"
                        aria-hidden="true"
                    >
                        <path
                            d="M15 5l-7 7 7 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Volver a iniciar sesión
                </Link>
            </div>
        </>
    );
}
