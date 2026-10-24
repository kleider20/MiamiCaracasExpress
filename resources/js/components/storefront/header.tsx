import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useStorefront } from '@/contexts/StorefrontContext';
import { dashboard, login, register } from '@/routes';
import { edit as editSecurity } from '@/routes/security';

const DEPARTMENTS = [
    'Todos',
    'Electrónica',
    'Hogar',
    'Moda',
    'Deportes',
    'Juguetes',
];

const NAV_LINKS = [
    { label: 'Ofertas del día', category: 'Ofertas' },
    { label: 'Electrónica', category: 'Electrónica' },
    { label: 'Hogar', category: 'Hogar' },
    { label: 'Moda', category: 'Moda' },
    { label: 'Deportes', category: 'Deportes' },
    { label: 'Juguetes', category: 'Juguetes' },
    { label: 'Los más vendidos', category: 'Todos' },
];

export default function Header() {
    const { cartQty, cartBump } = useCart();
    const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
    const { query, search, selectCategory, setSideDrawerOpen, setCartOpen } =
        useStorefront();
    const [department, setDepartment] = useState('Todos');
    const [text, setText] = useState(query);

    useEffect(() => {
        setText(query);
    }, [query]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        search(text, department);
    }

    return (
        <header className="sticky top-0 z-40 font-sans shadow-md">
            <div className="bg-amz-dark text-white">
                <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-x-1 gap-y-2 px-2 py-2 md:px-4">
                    <button
                        type="button"
                        onClick={() => setSideDrawerOpen(true)}
                        aria-label="Abrir menú de categorías"
                        className="outline-hover flex size-10 items-center justify-center rounded-sm md:hidden"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="size-7"
                            aria-hidden="true"
                        >
                            <path
                                d="M4 7h16M4 12h16M4 17h16"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>

                    <a
                        href="/"
                        aria-label="Miami Caracas Express, ir a la página de inicio"
                        className="outline-hover flex shrink-0 items-end rounded-sm px-1 py-1 text-[26px] leading-none font-bold tracking-tight"
                    >
                        <span className="text-white">M</span>
                        <span className="text-amz-orange">CE</span>
                        <span className="text-white">.com</span>
                    </a>

                    <button
                        type="button"
                        className="outline-hover hidden items-end gap-1 rounded-sm px-2 py-1 text-left lg:flex"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="mb-1 size-5"
                            aria-hidden="true"
                        >
                            <path
                                d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />
                            <circle
                                cx="12"
                                cy="10"
                                r="2.4"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />
                        </svg>
                        <span className="text-xs leading-tight text-gray-300">
                            Enviar a
                            <br />
                            <span className="text-sm font-bold text-white">
                                Caracas 1010
                            </span>
                        </span>
                    </button>

                    <form
                        onSubmit={handleSubmit}
                        role="search"
                        className="order-last flex h-10 w-full overflow-hidden rounded-md focus-within:ring-3 focus-within:ring-amz-orange md:order-none md:mx-1 md:w-auto md:flex-1"
                    >
                        <label htmlFor="department" className="sr-only">
                            Departamento
                        </label>
                        <select
                            id="department"
                            value={department}
                            onChange={(event) =>
                                setDepartment(event.target.value)
                            }
                            className="hidden cursor-pointer border-r border-gray-300 bg-[#e6e6e6] px-2 text-xs text-gray-800 outline-none hover:bg-[#d4d4d4] sm:block"
                        >
                            {DEPARTMENTS.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="site-search" className="sr-only">
                            Buscar en Miami Caracas Express
                        </label>
                        <input
                            id="site-search"
                            type="search"
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                            placeholder="Buscar en MCE.com"
                            className="min-w-0 flex-1 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-500"
                        />
                        <button
                            type="submit"
                            aria-label="Buscar"
                            className="flex w-11 shrink-0 items-center justify-center bg-amz-orange text-amz-dark transition hover:bg-[#f7b32b]"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="size-6"
                                aria-hidden="true"
                            >
                                <circle
                                    cx="10.5"
                                    cy="10.5"
                                    r="6.5"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                />
                                <path
                                    d="m15.6 15.6 4.4 4.4"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </form>

                    <button
                        type="button"
                        className="outline-hover hidden items-center gap-1 rounded-sm px-2 py-2 text-sm font-bold lg:flex"
                    >
                        <span aria-hidden="true">🇻🇪</span>
                        <span>ES</span>
                        <svg
                            viewBox="0 0 12 12"
                            className="size-2 fill-gray-400"
                            aria-hidden="true"
                        >
                            <path d="m2 4 4 4 4-4Z" />
                        </svg>
                    </button>

                    <div className="group relative hidden sm:block">
                        <button
                            type="button"
                            className="outline-hover flex items-end gap-1 rounded-sm px-2 py-1 text-left"
                        >
                            <span className="text-xs leading-tight text-gray-300">
                                {isAuthenticated && user
                                    ? `Hola, ${user.name.split(' ')[0]}`
                                    : 'Hola, identifícate'}
                                <br />
                                <span className="text-sm font-bold text-white">
                                    Cuenta y Listas
                                </span>
                            </span>
                            <svg
                                viewBox="0 0 12 12"
                                className="mb-1 size-2 fill-gray-400"
                                aria-hidden="true"
                            >
                                <path d="m2 4 4 4 4-4Z" />
                            </svg>
                        </button>

                        <div className="invisible absolute top-full right-0 z-50 w-60 translate-y-1 rounded-md border border-gray-200 bg-white p-4 text-gray-900 opacity-0 shadow-xl transition-all duration-150 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                            {isAuthenticated && user ? (
                                <>
                                    <p className="mb-2 truncate px-1 text-xs text-gray-600">
                                        Hola,{' '}
                                        <span className="font-bold text-gray-900">
                                            {user.name}
                                        </span>
                                    </p>
                                    <div className="border-t border-gray-200 pt-2">
                                        <Link
                                            href={dashboard()}
                                            className="block py-1 text-xs hover:text-amz-link-hover hover:underline"
                                        >
                                            Mi cuenta
                                        </Link>
                                        <Link
                                            href={dashboard({
                                                query: { section: 'pedidos' },
                                            })}
                                            className="block py-1 text-xs hover:text-amz-link-hover hover:underline"
                                        >
                                            Mis pedidos
                                        </Link>
                                        <Link
                                            href={dashboard({
                                                query: { section: 'deseos' },
                                            })}
                                            className="block py-1 text-xs hover:text-amz-link-hover hover:underline"
                                        >
                                            Lista de deseos
                                        </Link>
                                        <Link
                                            href={editSecurity()}
                                            className="block py-1 text-xs hover:text-amz-link-hover hover:underline"
                                        >
                                            Seguridad
                                        </Link>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={logout}
                                        disabled={authLoading}
                                        className="mt-2 w-full rounded-md bg-amz-yellow px-3 py-2 text-center text-sm font-bold text-gray-900 transition hover:bg-[#f7ca00] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Cerrar sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="mb-2 block rounded-md bg-amz-yellow px-3 py-2 text-center text-sm font-bold text-gray-900 hover:bg-[#f7ca00]"
                                    >
                                        Iniciar sesión
                                    </Link>
                                    <p className="mb-2 text-center text-xs text-gray-600">
                                        ¿Cliente nuevo?{' '}
                                        <Link
                                            href={register()}
                                            className="text-amz-link hover:text-amz-link-hover hover:underline"
                                        >
                                            Empieza aquí
                                        </Link>
                                    </p>
                                    <div className="border-t border-gray-200 pt-2">
                                        <Link
                                            href={login()}
                                            className="block py-1 text-xs hover:text-amz-link-hover hover:underline"
                                        >
                                            Mi cuenta
                                        </Link>
                                        <Link
                                            href={login()}
                                            className="block py-1 text-xs hover:text-amz-link-hover hover:underline"
                                        >
                                            Mis pedidos
                                        </Link>
                                        <Link
                                            href={login()}
                                            className="block py-1 text-xs hover:text-amz-link-hover hover:underline"
                                        >
                                            Mis listas
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <Link
                        href={
                            isAuthenticated
                                ? dashboard({ query: { section: 'pedidos' } })
                                : login()
                        }
                        className="outline-hover hidden rounded-sm px-2 py-1 text-left md:block"
                    >
                        <span className="block text-xs leading-tight text-gray-300">
                            Devoluciones
                        </span>
                        <span className="block text-sm font-bold">
                            y Pedidos
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setCartOpen(true)}
                        aria-label={`Abrir carrito, ${cartQty} productos`}
                        className="outline-hover relative ml-auto flex items-end gap-1 rounded-sm px-2 py-1 md:ml-1"
                    >
                        <span className="relative">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="size-8"
                                aria-hidden="true"
                            >
                                <path
                                    d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H6"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <circle
                                    cx="10"
                                    cy="20"
                                    r="1.3"
                                    fill="currentColor"
                                />
                                <circle
                                    cx="17"
                                    cy="20"
                                    r="1.3"
                                    fill="currentColor"
                                />
                            </svg>
                            <span
                                key={cartBump}
                                className="mk-pop absolute -top-1 left-1/2 min-w-[18px] -translate-x-1/2 rounded-full bg-amz-orange px-1 text-center text-xs font-bold text-amz-dark"
                            >
                                {cartQty}
                            </span>
                        </span>
                        <span className="hidden text-sm font-bold sm:block">
                            Carrito
                        </span>
                    </button>
                </div>
            </div>

            <div className="bg-amz-navy text-white">
                <div className="hide-scroll mx-auto flex max-w-[1500px] items-center gap-1 overflow-x-auto px-2 md:px-4">
                    <button
                        type="button"
                        onClick={() => setSideDrawerOpen(true)}
                        className="outline-hover flex shrink-0 items-center gap-1 rounded-sm px-2 py-2 text-sm font-bold"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="size-4"
                            aria-hidden="true"
                        >
                            <path
                                d="M4 7h16M4 12h16M4 17h16"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                            />
                        </svg>
                        Todos
                    </button>

                    {NAV_LINKS.map((link) => (
                        <button
                            key={link.label}
                            type="button"
                            onClick={() => selectCategory(link.category)}
                            className="outline-hover shrink-0 rounded-sm px-2 py-2 text-sm hover:text-amz-orange"
                        >
                            {link.label}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
}
