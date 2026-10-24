import { router, usePage } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import {
    destroy as destroyAddress,
    setDefault as setDefaultAddress,
    store as storeAddress,
    update as updateAddress,
} from '@/actions/App/Http/Controllers/Dashboard/AddressController';
import AddressCard from '@/components/dashboard/address-card';
import type { DashboardAddress } from '@/types';

type AddressForm = {
    name: string;
    person: string;
    street: string;
    city: string;
    zip: string;
    phone: string;
    is_default: boolean;
};

const EMPTY_FORM: AddressForm = {
    name: 'Casa',
    person: '',
    street: '',
    city: '',
    zip: '',
    phone: '',
    is_default: false,
};

export default function AddressesSection({
    addresses,
}: {
    addresses: DashboardAddress[];
}) {
    const page = usePage();
    const errors = (page.props.errors ?? {}) as Record<string, string>;

    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<DashboardAddress | null>(null);
    const [form, setForm] = useState<AddressForm>(EMPTY_FORM);

    const openCreate = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setFormOpen(true);
        window.setTimeout(() => {
            document
                .getElementById('address-form')
                ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
    };

    const openEdit = (address: DashboardAddress) => {
        setEditing(address);
        setForm({
            name: address.name,
            person: address.person,
            street: address.street,
            city: address.city,
            zip: address.zip,
            phone: address.phone,
            is_default: address.is_default,
        });
        setFormOpen(true);
        window.setTimeout(() => {
            document
                .getElementById('address-form')
                ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditing(null);
        setForm(EMPTY_FORM);
    };

    const submit = useCallback(
        (event: FormEvent) => {
            event.preventDefault();

            const options = {
                preserveScroll: true,
                onSuccess: () => closeForm(),
            };

            if (editing) {
                router.put(updateAddress(editing.id).url, form, options);
            } else {
                router.post(storeAddress().url, form, options);
            }
        },
        [editing, form],
    );

    const remove = (address: DashboardAddress) => {
        if (
            !window.confirm(
                `¿Eliminar la dirección “${address.name}”? Esta acción no se puede deshacer.`,
            )
        ) {
            return;
        }

        router.delete(destroyAddress(address.id).url, {
            preserveScroll: true,
        });
    };

    const makeDefault = (address: DashboardAddress) => {
        router.post(
            setDefaultAddress(address.id).url,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const setField = <K extends keyof AddressForm>(
        key: K,
        value: AddressForm[K],
    ) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    return (
        <div className="space-y-5 fade-in">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Tus direcciones
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Tu dirección predeterminada se usará en el checkout de
                        la tienda.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={openCreate}
                    className="btn-cart px-4 py-2 text-xs font-bold text-gray-900"
                >
                    + Agregar dirección
                </button>
            </div>

            {formOpen && (
                <form
                    id="address-form"
                    onSubmit={submit}
                    className="rounded-lg border border-amz-orange/50 bg-white p-4 shadow-sm fade-in sm:p-5"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-gray-900">
                            {editing
                                ? 'Editar dirección'
                                : 'Nueva dirección de envío'}
                        </h2>
                        <button
                            type="button"
                            onClick={closeForm}
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
                        <Field
                            label="Etiqueta"
                            error={errors.name}
                            hint="Casa, Oficina, etc."
                        >
                            <input
                                value={form.name}
                                onChange={(event) =>
                                    setField('name', event.target.value)
                                }
                                maxLength={50}
                                className="mk-input w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Casa"
                            />
                        </Field>

                        <Field label="Nombre completo *" error={errors.person}>
                            <input
                                value={form.person}
                                onChange={(event) =>
                                    setField('person', event.target.value)
                                }
                                maxLength={120}
                                required
                                autoComplete="name"
                                className="mk-input w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Ana García"
                            />
                        </Field>

                        <Field
                            label="Calle y número *"
                            error={errors.street}
                            className="sm:col-span-2"
                        >
                            <input
                                value={form.street}
                                onChange={(event) =>
                                    setField('street', event.target.value)
                                }
                                required
                                autoComplete="street-address"
                                className="mk-input w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Av. Francisco de Miranda, Edif. Parque Cristal"
                            />
                        </Field>

                        <Field
                            label="Colonia, ciudad o estado *"
                            error={errors.city}
                        >
                            <input
                                value={form.city}
                                onChange={(event) =>
                                    setField('city', event.target.value)
                                }
                                required
                                autoComplete="address-level2"
                                className="mk-input w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Los Palos Grandes, Caracas"
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-3">
                            <Field label="C.P." error={errors.zip}>
                                <input
                                    value={form.zip}
                                    onChange={(event) =>
                                        setField(
                                            'zip',
                                            event.target.value.replace(
                                                /\D/g,
                                                '',
                                            ),
                                        )
                                    }
                                    inputMode="numeric"
                                    maxLength={6}
                                    required
                                    autoComplete="postal-code"
                                    className="mk-input w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                    placeholder="1060"
                                />
                            </Field>

                            <Field label="Teléfono" error={errors.phone}>
                                <input
                                    value={form.phone}
                                    onChange={(event) =>
                                        setField('phone', event.target.value)
                                    }
                                    maxLength={30}
                                    required
                                    autoComplete="tel"
                                    className="mk-input w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                    placeholder="+58 412-1234567"
                                />
                            </Field>
                        </div>
                    </div>

                    <label className="mt-3 flex items-center gap-2 text-xs text-gray-700">
                        <input
                            type="checkbox"
                            checked={form.is_default}
                            onChange={(event) =>
                                setField('is_default', event.target.checked)
                            }
                            className="size-4 accent-amz-orange"
                        />
                        Usar como dirección predeterminada
                    </label>

                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={closeForm}
                            className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-cart px-5 py-1.5 text-xs font-bold text-gray-900"
                        >
                            {editing ? 'Guardar cambios' : 'Guardar dirección'}
                        </button>
                    </div>
                </form>
            )}

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <button
                    type="button"
                    onClick={openCreate}
                    className="flex min-h-44 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white/60 p-4 text-gray-600 transition hover:border-amz-orange hover:text-amz-link-hover"
                >
                    <span className="flex size-12 items-center justify-center rounded-full bg-amz-bg text-3xl">
                        +
                    </span>
                    <span className="mt-2 text-sm font-semibold">
                        Agregar dirección
                    </span>
                </button>

                {addresses.map((address) => (
                    <AddressCard
                        key={address.id}
                        address={address}
                        onEdit={() => openEdit(address)}
                        onDelete={() => remove(address)}
                        onDefault={() => makeDefault(address)}
                    />
                ))}
            </div>
        </div>
    );
}

function Field({
    label,
    error,
    hint,
    className,
    children,
}: {
    label: string;
    error?: string;
    hint?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <label className={className}>
            <span className="mb-1 block text-xs font-semibold text-gray-700">
                {label}
            </span>
            {children}
            {hint && !error && (
                <span className="mt-0.5 block text-[10px] text-gray-500">
                    {hint}
                </span>
            )}
            {error && (
                <span className="mt-0.5 block text-[11px] text-red-600">
                    {error}
                </span>
            )}
        </label>
    );
}
