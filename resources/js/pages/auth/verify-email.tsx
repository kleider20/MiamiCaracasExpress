import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthButton from '@/components/auth/auth-button';
import AuthCard from '@/components/auth/auth-card';
import { useAuth } from '@/contexts/AuthContext';
import { useAutoDismiss } from '@/hooks/use-auto-dismiss';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    const { logout, loading: logoutLoading } = useAuth();
    const [processing, setProcessing] = useState(false);

    const sentMessage = useAutoDismiss(
        status === 'verification-link-sent'
            ? 'Te enviamos un nuevo enlace de verificación a tu correo.'
            : undefined,
    );

    const resend = () => {
        router.post(
            send().url,
            {},
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <>
            <Head title="Verifica tu correo" />

            <AuthCard
                title="Verifica tu correo"
                subtitle="Antes de continuar, confirma tu dirección de correo con el enlace que te enviamos."
            >
                {sentMessage && (
                    <div
                        role="status"
                        className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs leading-5 font-medium text-amz-green"
                    >
                        {sentMessage}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="flex items-start gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-3">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="mt-0.5 size-5 shrink-0 text-[#146eb4]"
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
                        <p className="text-xs leading-5 text-gray-700">
                            Si no encuentras el correo, revisa tu carpeta de
                            spam o solicita uno nuevo.
                        </p>
                    </div>

                    <AuthButton
                        type="button"
                        onClick={resend}
                        loading={processing}
                        loadingLabel="Enviando..."
                    >
                        Reenviar correo de verificación
                    </AuthButton>

                    <AuthButton
                        type="button"
                        variant="secondary"
                        onClick={logout}
                        loading={logoutLoading}
                        loadingLabel="Cerrando sesión..."
                    >
                        Cerrar sesión
                    </AuthButton>
                </div>
            </AuthCard>
        </>
    );
}
