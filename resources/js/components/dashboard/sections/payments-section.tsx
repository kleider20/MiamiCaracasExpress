import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
    destroy as destroyPaymentMethod,
    setDefault as setDefaultPaymentMethod,
    store as storePaymentMethod,
} from '@/actions/App/Http/Controllers/Dashboard/PaymentMethodController';
import CreditCard from '@/components/dashboard/credit-card';
import type { PaymentMethod } from '@/types';

type CardForm = {
    brand: 'Visa' | 'Mastercard' | 'Amex';
    last4: string;
    holder: string;
    expiry: string;
    is_default: boolean;
};

const EMPTY_FORM: CardForm = {
    brand: 'Visa',
    last4: '',
    holder: '',
    expiry: '',
    is_default: false,
};

export default function PaymentsSection({
    paymentMethods,
}: {
    paymentMethods: PaymentMethod[];
}) {
    const page = usePage();
    const errors = (page.props.errors ?? {}) as Record<string, string>;

    const [formOpen, setFormOpen] = useState(false);
    const [form, setForm] = useState<CardForm>(EMPTY_FORM);
    const [expiryError, setExpiryError] = useState<string | null>(null);

    const setField = <K extends keyof CardForm>(key: K, value: CardForm[K]) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        setExpiryError(null);

        const match = form.expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);

        if (!match) {
            setExpiryError('Ingresa el vencimiento con el formato MM/AA.');
            return;
        }

        router.post(
            storePaymentMethod().url,
            {
                brand: form.brand,
                last4: form.last4,
                holder: form.holder,
                exp_month: Number(match[1]),
                exp_year: Number(match[2]),
                is_default: form.is_default,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setForm(EMPTY_FORM);
                    setFormOpen(false);
                },
            },
        );
    };

    const remove = (method: PaymentMethod) => {
        if (
            !window.confirm(
                `¿Eliminar la tarjeta ${method.brand} terminada en ${method.last4}?`,
            )
        ) {
            return;
        }

        router.delete(destroyPaymentMethod(method.id).url, {
            preserveScroll: true,
        });
    };

    const makeDefault = (method: PaymentMethod) => {
        router.post(
            setDefaultPaymentMethod(method.id).url,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="space-y-5 fade-in">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Métodos de pago
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Administra tus tarjetas de forma segura. Nunca guardamos
                        el número completo ni el CVV.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setForm(EMPTY_FORM);
                        setFormOpen(true);
                    }}
                    className="btn-cart px-4 py-2 text-xs font-bold text-gray-900"
                >
                    + Agregar tarjeta
                </button>
            </div>

            {formOpen && (
                <form
                    onSubmit={submit}
                    className="rounded-lg border border-amz-orange/50 bg-white p-4 shadow-sm fade-in sm:p-5"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-gray-900">
                            Nueva tarjeta
                        </h2>
                        <button
                            type="button"
                            onClick={() => setFormOpen(false)}
                            aria-label="Cerrar formulario"
                            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="size-5"
                                aria-hidden="true"
                            >
                                <path
                                    d="m6 6 12 12M18 6 6 18"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <label>
                            <span className="mb-1 block text-xs font-semibold text-gray-700">
                                Marca
                            </span>
                            <select
                                value={form.brand}
                                onChange={(event) =>
                                    setField(
                                        'brand',
                                        event.target.value as CardForm['brand'],
                                    )
                                }
                                className="mk-input w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                            >
                                <option value="Visa">Visa</option>
                                <option value="Mastercard">Mastercard</option>
                                <option value="Amex">American Express</option>
                            </select>
                            {errors.brand && (
                                <FieldError message={errors.brand} />
                            )}
                        </label>

                        <label>
                            <span className="mb-1 block text-xs font-semibold text-gray-700">
                                Últimos 4 dígitos
                            </span>
                            <input
                                value={form.last4}
                                onChange={(event) =>
                                    setField(
                                        'last4',
                                        event.target.value
                                            .replace(/\D/g, '')
                                            .slice(0, 4),
                                    )
                                }
                                inputMode="numeric"
                                maxLength={4}
                                required
                                placeholder="4821"
                                className="mk-input w-full rounded-md border border-gray-300 px-3 py-2 text-sm tracking-[0.3em]"
                            />
                            {errors.last4 && (
                                <FieldError message={errors.last4} />
                            )}
                        </label>

                        <label className="sm:col-span-2">
                            <span className="mb-1 block text-xs font-semibold text-gray-700">
                                Titular
                            </span>
                            <input
                                value={form.holder}
                                onChange={(event) =>
                                    setField(
                                        'holder',
                                        event.target.value.toUpperCase(),
                                    )
                                }
                                maxLength={120}
                                required
                                placeholder="ANA GARCIA"
                                className="mk-input w-full rounded-md border border-gray-300 px-3 py-2 text-sm uppercase"
                            />
                            {errors.holder && (
                                <FieldError message={errors.holder} />
                            )}
                        </label>

                        <label>
                            <span className="mb-1 block text-xs font-semibold text-gray-700">
                                Vencimiento MM/AA
                            </span>
                            <input
                                value={form.expiry}
                                onChange={(event) => {
                                    const digits = event.target.value
                                        .replace(/\D/g, '')
                                        .slice(0, 4);
                                    const next =
                                        digits.length > 2
                                            ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                                            : digits;

                                    setField('expiry', next);
                                }}
                                inputMode="numeric"
                                maxLength={5}
                                required
                                placeholder="08/29"
                                className="mk-input w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            />
                            {expiryError && (
                                <FieldError message={expiryError} />
                            )}
                        </label>

                        <label className="flex items-end gap-2 pb-2 text-xs text-gray-700">
                            <input
                                type="checkbox"
                                checked={form.is_default}
                                onChange={(event) =>
                                    setField('is_default', event.target.checked)
                                }
                                className="size-4 accent-amz-orange"
                            />
                            Usar como tarjeta predeterminada
                        </label>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setFormOpen(false)}
                            className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-cart px-5 py-1.5 text-xs font-bold text-gray-900"
                        >
                            Guardar tarjeta
                        </button>
                    </div>
                </form>
            )}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <button
                    type="button"
                    onClick={() => {
                        setForm(EMPTY_FORM);
                        setFormOpen(true);
                    }}
                    className="flex min-h-44 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white/60 p-4 text-gray-600 transition hover:border-amz-orange hover:text-amz-link-hover"
                >
                    <span className="flex size-12 items-center justify-center rounded-full bg-amz-bg text-3xl">
                        +
                    </span>
                    <span className="mt-2 text-sm font-semibold">
                        Agregar tarjeta
                    </span>
                </button>

                {paymentMethods.map((method) => (
                    <CreditCard
                        key={method.id}
                        method={method}
                        onDefault={() => makeDefault(method)}
                        onDelete={() => remove(method)}
                    />
                ))}
            </div>

            <p className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-[11px] text-gray-600">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-4 shrink-0 text-amz-green"
                    aria-hidden="true"
                >
                    <rect
                        x="4"
                        y="10"
                        width="16"
                        height="10"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.7"
                    />
                    <path
                        d="M8 10V7a4 4 0 0 1 8 0v3"
                        stroke="currentColor"
                        strokeWidth="1.7"
                    />
                </svg>
                Tus datos están protegidos con cifrado bancario. MCE no almacena
                el número completo de tu tarjeta.
            </p>
        </div>
    );
}

function FieldError({ message }: { message: string }) {
    return (
        <span className="mt-0.5 block text-[11px] text-red-600">{message}</span>
    );
}
