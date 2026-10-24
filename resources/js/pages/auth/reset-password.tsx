import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import AuthButton from '@/components/auth/auth-button';
import AuthCard from '@/components/auth/auth-card';
import InputField from '@/components/auth/input-field';
import PasswordField from '@/components/auth/password-field';
import { login } from '@/routes';
import { update } from '@/routes/password';
import type { SharedData } from '@/types';
import { MIN_PASSWORD_LENGTH } from '@/lib/validation';

type FieldErrors = {
    password?: string;
    password_confirmation?: string;
};

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { errors: serverErrors } = usePage<SharedData>().props;

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState<FieldErrors>({});
    const [processing, setProcessing] = useState(false);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors: FieldErrors = {};

        if (password.length < MIN_PASSWORD_LENGTH) {
            nextErrors.password = `Tu contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
        }

        if (passwordConfirmation !== password) {
            nextErrors.password_confirmation =
                'Las contraseñas no coinciden. Vuelve a escribirlas.';
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        router.post(
            update().url,
            {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            },
            {
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <>
            <Head title="Restablecer contraseña" />

            <AuthCard
                title="Restablecer contraseña"
                subtitle="Elige una contraseña nueva para tu cuenta de Miami Caracas Express."
            >
                <form onSubmit={submit} noValidate className="space-y-4">
                    <InputField
                        id="email"
                        label="Correo electrónico"
                        type="email"
                        value={email}
                        onChange={() => undefined}
                        autoComplete="email"
                        readOnly
                    />

                    <PasswordField
                        id="password"
                        label="Nueva contraseña"
                        value={password}
                        onChange={setPassword}
                        placeholder="Escribe tu nueva contraseña"
                        autoComplete="new-password"
                        hint={`Al menos ${MIN_PASSWORD_LENGTH} caracteres.`}
                        autoFocus
                        required
                        error={errors.password ?? serverErrors.password}
                    />

                    <PasswordField
                        id="password_confirmation"
                        label="Confirma tu nueva contraseña"
                        value={passwordConfirmation}
                        onChange={setPasswordConfirmation}
                        placeholder="Repite tu nueva contraseña"
                        autoComplete="new-password"
                        required
                        error={
                            errors.password_confirmation ??
                            serverErrors.password_confirmation
                        }
                    />

                    <AuthButton
                        type="submit"
                        loading={processing}
                        loadingLabel="Guardando..."
                    >
                        Restablecer contraseña
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
