import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import AuthButton from '@/components/auth/auth-button';
import AuthCard from '@/components/auth/auth-card';
import InputField from '@/components/auth/input-field';
import PasswordField from '@/components/auth/password-field';
import { useAuth } from '@/contexts/AuthContext';
import { isValidEmail, MIN_PASSWORD_LENGTH } from '@/lib/validation';
import { login } from '@/routes';
import type { SharedData } from '@/types';

type FieldErrors = {
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
};

export default function Register() {
    const { register, loading } = useAuth();
    const { errors: serverErrors } = usePage<SharedData>().props;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState<FieldErrors>({});

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors: FieldErrors = {};

        if (name.trim().length < 3) {
            nextErrors.name = 'Escribe tu nombre completo (mínimo 3 letras).';
        }

        if (!isValidEmail(email)) {
            nextErrors.email = 'Escribe un correo electrónico válido.';
        }

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

        register({
            name: name.trim(),
            email: email.trim(),
            password,
            password_confirmation: passwordConfirmation,
        });
    };

    return (
        <>
            <Head title="Crear cuenta" />

            <AuthCard
                title="Crear cuenta"
                subtitle="Únete a Miami Caracas Express y disfruta de envíos gratis y ofertas exclusivas."
                footer={
                    <p>
                        Al crear tu cuenta aceptas nuestras{' '}
                        <a href="#" className="link-mk">
                            condiciones de uso
                        </a>{' '}
                        y el{' '}
                        <a href="#" className="link-mk">
                            aviso de privacidad
                        </a>
                        .
                    </p>
                }
            >
                <form onSubmit={submit} noValidate className="space-y-4">
                    <InputField
                        id="name"
                        label="Tu nombre"
                        value={name}
                        onChange={setName}
                        placeholder="Nombre y apellidos"
                        autoComplete="name"
                        autoFocus
                        required
                        error={errors.name ?? serverErrors.name}
                    />

                    <InputField
                        id="email"
                        label="Correo electrónico"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="tu@correo.com"
                        autoComplete="email"
                        inputMode="email"
                        required
                        error={errors.email ?? serverErrors.email}
                    />

                    <PasswordField
                        id="password"
                        label="Contraseña"
                        value={password}
                        onChange={setPassword}
                        placeholder="Crea una contraseña"
                        autoComplete="new-password"
                        hint={`Al menos ${MIN_PASSWORD_LENGTH} caracteres.`}
                        required
                        error={errors.password ?? serverErrors.password}
                    />

                    <PasswordField
                        id="password_confirmation"
                        label="Confirma tu contraseña"
                        value={passwordConfirmation}
                        onChange={setPasswordConfirmation}
                        placeholder="Repite tu contraseña"
                        autoComplete="new-password"
                        required
                        error={
                            errors.password_confirmation ??
                            serverErrors.password_confirmation
                        }
                    />

                    <AuthButton
                        type="submit"
                        variant="secondary"
                        loading={loading}
                        loadingLabel="Creando cuenta..."
                    >
                        Crear tu cuenta
                    </AuthButton>
                </form>
            </AuthCard>

            <div className="my-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-medium text-gray-500">
                    ¿Ya tienes una cuenta?
                </span>
                <span className="h-px flex-1 bg-gray-200" />
            </div>

            <Link
                href={login()}
                className="btn-amazon flex h-9 w-full items-center justify-center px-4 text-sm font-medium text-gray-900 shadow-sm transition"
            >
                Iniciar sesión
            </Link>
        </>
    );
}
