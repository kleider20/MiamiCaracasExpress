import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
    sendPasswordReset,
    update as updateProfile,
} from '@/actions/App/Http/Controllers/Dashboard/ProfileController';
import { edit as editSecurity } from '@/routes/security';
import type { DashboardUser } from '@/types';

export default function SettingsSection({ user }: { user: DashboardUser }) {
    const page = usePage();
    const errors = (page.props.errors ?? {}) as Record<string, string>;

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
    });

    const initials = user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');

    const submit = (event: FormEvent) => {
        event.preventDefault();

        router.put(updateProfile().url, form, {
            preserveScroll: true,
            onSuccess: () => setEditing(false),
        });
    };

    const sendReset = () => {
        router.post(sendPasswordReset().url, {}, { preserveScroll: true });
    };

    return (
        <div className="space-y-5 fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Configuración de la cuenta
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    Administra tu información personal y la seguridad de tu
                    cuenta MCE.
                </p>
            </div>

            <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-wrap items-center gap-4">
                    <span className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-amz-navy to-amz-navy-light text-xl font-bold text-white">
                        {initials || 'MCE'}
                    </span>
                    <div className="min-w-0 flex-1">
                        <h2 className="truncate text-lg font-bold text-gray-900">
                            {user.name}
                        </h2>
                        <p className="truncate text-xs text-gray-600">
                            {user.email}
                        </p>
                        {user.member_since && (
                            <p className="mt-0.5 text-[11px] text-gray-500">
                                Miembro desde {user.member_since}
                            </p>
                        )}
                    </div>
                    {!editing && (
                        <button
                            type="button"
                            onClick={() => setEditing(true)}
                            className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                        >
                            Editar datos
                        </button>
                    )}
                </div>

                {editing ? (
                    <form
                        onSubmit={submit}
                        className="mt-5 border-t border-gray-100 pt-4"
                    >
                        <div className="grid gap-3 sm:grid-cols-2">
                            <label>
                                <span className="mb-1 block text-xs font-semibold text-gray-700">
                                    Nombre
                                </span>
                                <input
                                    value={form.name}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            name: event.target.value,
                                        }))
                                    }
                                    required
                                    maxLength={255}
                                    className="mk-input w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                />
                                {errors.name && (
                                    <span className="mt-0.5 block text-[11px] text-red-600">
                                        {errors.name}
                                    </span>
                                )}
                            </label>

                            <label>
                                <span className="mb-1 block text-xs font-semibold text-gray-700">
                                    Correo electrónico
                                </span>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            email: event.target.value,
                                        }))
                                    }
                                    required
                                    maxLength={255}
                                    className="mk-input w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                />
                                {errors.email && (
                                    <span className="mt-0.5 block text-[11px] text-red-600">
                                        {errors.email}
                                    </span>
                                )}
                            </label>

                            <label className="sm:col-span-2">
                                <span className="mb-1 block text-xs font-semibold text-gray-700">
                                    Teléfono
                                </span>
                                <input
                                    value={form.phone}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            phone: event.target.value,
                                        }))
                                    }
                                    maxLength={30}
                                    placeholder="+58 412-1234567"
                                    className="mk-input w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                />
                                {errors.phone && (
                                    <span className="mt-0.5 block text-[11px] text-red-600">
                                        {errors.phone}
                                    </span>
                                )}
                            </label>
                        </div>

                        <p className="mt-2 text-[11px] text-gray-500">
                            Si cambias tu correo, deberás verificarlo de nuevo.
                        </p>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditing(false);
                                    setForm({
                                        name: user.name,
                                        email: user.email,
                                        phone: user.phone ?? '',
                                    });
                                }}
                                className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn-cart px-5 py-1.5 text-xs font-bold text-gray-900"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <dl className="mt-5 grid gap-3 border-t border-gray-100 pt-4 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
                                    Nombre
                                </dt>
                                <dd className="mt-0.5 text-gray-900">
                                    {user.name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
                                    Correo electrónico
                                </dt>
                                <dd className="mt-0.5 break-all text-gray-900">
                                    {user.email}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
                                    Teléfono
                                </dt>
                                <dd className="mt-0.5 text-gray-900">
                                    {user.phone || 'No registrado'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
                                    Contraseña
                                </dt>
                                <dd className="mt-0.5 text-gray-900">
                                    ••••••••
                                </dd>
                            </div>
                        </dl>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={sendReset}
                                className="link-mk text-xs font-semibold"
                            >
                                Cambiar contraseña
                            </button>
                            <span className="text-gray-300">|</span>
                            <Link
                                href={editSecurity()}
                                className="link-mk text-xs font-semibold"
                            >
                                Administrar dispositivos y llaves de acceso
                            </Link>
                        </div>
                    </>
                )}
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                <h2 className="text-base font-bold text-gray-900">
                    Seguridad avanzada
                </h2>

                <div className="mt-3 divide-y divide-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-3 py-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                Verificación en dos pasos
                            </p>
                            <p className="mt-0.5 text-xs text-gray-600">
                                {user.two_factor_enabled
                                    ? 'Activa: tu cuenta está protegida con un código adicional.'
                                    : 'Inactiva: agrega una capa extra de seguridad a tu cuenta.'}
                            </p>
                        </div>
                        <Link
                            href={editSecurity()}
                            aria-label="Administrar verificación en dos pasos"
                            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
                                user.two_factor_enabled
                                    ? 'bg-amz-green'
                                    : 'bg-gray-300'
                            }`}
                        >
                            <span
                                className={`inline-block size-4 rounded-full bg-white shadow transition ${
                                    user.two_factor_enabled
                                        ? 'translate-x-6'
                                        : 'translate-x-1'
                                }`}
                            />
                        </Link>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 py-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                Dispositivos conectados
                            </p>
                            <p className="mt-0.5 text-xs text-gray-600">
                                Revisa las sesiones y llaves de acceso de tu
                                cuenta.
                            </p>
                        </div>
                        <Link
                            href={editSecurity()}
                            className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                        >
                            Administrar
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
