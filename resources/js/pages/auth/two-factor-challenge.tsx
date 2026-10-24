import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useMemo, useState } from 'react';
import AuthButton from '@/components/auth/auth-button';
import AuthCard from '@/components/auth/auth-card';
import InputError from '@/components/input-error';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { store } from '@/routes/two-factor/login';

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: 'Código de recuperación',
                description:
                    'Confirma el acceso a tu cuenta con uno de tus códigos de emergencia.',
                toggleText: 'usar un código de autenticación',
            };
        }

        return {
            title: 'Verificación en dos pasos',
            description:
                'Escribe el código de 6 dígitos que muestra tu aplicación de autenticación.',
            toggleText: 'usar un código de recuperación',
        };
    }, [showRecoveryInput]);

    const toggleRecoveryMode = (clearErrors: () => void): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
    };

    return (
        <>
            <Head title="Verificación en dos pasos" />

            <AuthCard
                title={authConfigContent.title}
                subtitle={authConfigContent.description}
            >
                <Form
                    {...store.form()}
                    className="space-y-4"
                    resetOnError
                    resetOnSuccess={!showRecoveryInput}
                >
                    {({ errors, processing, clearErrors }) => (
                        <>
                            {showRecoveryInput ? (
                                <div>
                                    <label
                                        htmlFor="recovery_code"
                                        className="mb-1 block text-sm font-bold text-gray-900"
                                    >
                                        Código de recuperación
                                    </label>
                                    <input
                                        id="recovery_code"
                                        name="recovery_code"
                                        type="text"
                                        placeholder="XXXX-XXXX"
                                        autoFocus={showRecoveryInput}
                                        required
                                        autoComplete="one-time-code"
                                        className="mk-input w-full rounded-md border border-gray-400 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]"
                                    />
                                    <InputError
                                        message={errors.recovery_code}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <InputOTP
                                        name="code"
                                        maxLength={OTP_MAX_LENGTH}
                                        value={code}
                                        onChange={(value) => setCode(value)}
                                        disabled={processing}
                                        pattern={REGEXP_ONLY_DIGITS}
                                        autoFocus
                                    >
                                        <InputOTPGroup>
                                            {Array.from(
                                                { length: OTP_MAX_LENGTH },
                                                (_, index) => (
                                                    <InputOTPSlot
                                                        key={index}
                                                        index={index}
                                                    />
                                                ),
                                            )}
                                        </InputOTPGroup>
                                    </InputOTP>
                                    <InputError message={errors.code} />
                                </div>
                            )}

                            <AuthButton
                                type="submit"
                                loading={processing}
                                loadingLabel="Verificando..."
                            >
                                Continuar
                            </AuthButton>

                            <p className="text-center text-xs text-gray-600">
                                o puedes{' '}
                                <button
                                    type="button"
                                    className="link-mk font-medium"
                                    onClick={() =>
                                        toggleRecoveryMode(clearErrors)
                                    }
                                >
                                    {authConfigContent.toggleText}
                                </button>
                            </p>
                        </>
                    )}
                </Form>
            </AuthCard>
        </>
    );
}
