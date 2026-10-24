import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import AuthButton from '@/components/auth/auth-button';
import AuthCard from '@/components/auth/auth-card';
import PasswordField from '@/components/auth/password-field';
import PasskeyVerify from '@/components/passkey-verify';
import { store } from '@/routes/password/confirm';
import type { SharedData } from '@/types';

export default function ConfirmPassword() {
    const { errors: serverErrors } = usePage<SharedData>().props;

    const [password, setPassword] = useState('');
    const [error, setError] = useState<string>();
    const [processing, setProcessing] = useState(false);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password.trim() === '') {
            setError('Escribe tu contraseña para confirmar.');

            return;
        }

        setError(undefined);

        router.post(
            store().url,
            { password },
            {
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <>
            <Head title="Confirma tu contraseña" />

            <AuthCard
                title="Confirma tu contraseña"
                subtitle="Esta es un área segura de Miami Caracas Express. Confirma tu contraseña antes de continuar."
            >
                <form onSubmit={submit} noValidate className="space-y-4">
                    <PasswordField
                        id="password"
                        label="Contraseña"
                        value={password}
                        onChange={setPassword}
                        placeholder="Escribe tu contraseña"
                        autoComplete="current-password"
                        autoFocus
                        required
                        error={error ?? serverErrors.password}
                    />

                    <AuthButton
                        type="submit"
                        loading={processing}
                        loadingLabel="Confirmando..."
                    >
                        Confirmar contraseña
                    </AuthButton>
                </form>

                <div className="mt-5">
                    <PasskeyVerify
                        routes={{
                            options: confirmOptions(),
                            submit: confirmStore(),
                        }}
                        label="Confirmar con llave de acceso"
                        loadingLabel="Confirmando..."
                        separator="Acceso alternativo"
                    />
                </div>
            </AuthCard>
        </>
    );
}
