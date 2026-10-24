import { Link } from '@inertiajs/react';
import { useCart } from '@/contexts/CartContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { useStorefront } from '@/contexts/StorefrontContext';
import { cn } from '@/lib/utils';
import type {
    DashboardAddress,
    DashboardSection,
    DashboardUser,
} from '@/types';

const NAV_ITEMS: Array<{
    id: DashboardSection;
    label: string;
    emoji: string;
}> = [
    { id: 'resumen', label: 'Resumen', emoji: '🏠' },
    { id: 'pedidos', label: 'Pedidos', emoji: '📦' },
    { id: 'direcciones', label: 'Direcciones', emoji: '📍' },
    { id: 'deseos', label: 'Deseos', emoji: '❤️' },
    { id: 'pagos', label: 'Pagos', emoji: '💳' },
    { id: 'configuracion', label: 'Configuración', emoji: '⚙️' },
];

export default function DashboardHeader({
    user,
    addresses,
}: {
    user: DashboardUser;
    addresses: DashboardAddress[];
}) {
    const { section, setSection, orderQuery, searchOrders, logout } =
        useDashboard();
    const { cartQty } = useCart();
    const { setCartOpen } = useStorefront();

    const firstName = user.name.split(' ')[0] ?? user.name;
    const defaultZip =
        addresses.find((address) => address.is_default)?.zip ??
        addresses[0]?.zip ??
        '1010';

    return (
        <header className="sticky top-0 z-50 shadow-md">
            <div className="bg-amz-dark text-white">
                <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 py-2.5">
                    <Link
                        href="/"
                        className="outline-hover shrink-0 rounded-sm leading-none"
                        aria-label="Volver a la tienda Miami Caracas Express"
                    >
                        <span className="text-2xl font-black tracking-tight">
                            MCE
                            <span className="text-amz-orange">.com</span>
                        </span>
                        <span className="mt-0.5 block text-[9px] font-semibold tracking-[0.18em] text-gray-300">
                            MIAMI CARACAS EXPRESS
                        </span>
                    </Link>

                    <div className="hidden min-w-0 items-center gap-1.5 rounded-sm px-2 py-1 text-left sm:flex">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="size-5 shrink-0 text-white"
                            aria-hidden="true"
                        >
                            <path
                                d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z"
                                stroke="currentColor"
                                strokeWidth="1.7"
                            />
                            <circle
                                cx="12"
                                cy="10"
                                r="2.4"
                                stroke="currentColor"
                                strokeWidth="1.7"
                            />
                        </svg>
                        <span className="leading-tight">
                            <span className="block text-[10px] text-gray-300">
                                Enviar a
                            </span>
                            <span className="block text-xs font-bold">
                                Caracas {defaultZip}
                            </span>
                        </span>
                    </div>

                    <form
                        className="flex h-10 min-w-0 flex-1 overflow-hidden rounded-md bg-white focus-within:ring-3 focus-within:ring-amz-orange/70"
                        onSubmit={(event) => {
                            event.preventDefault();
                            searchOrders(orderQuery);
                        }}
                        role="search"
                    >
                        <select
                            aria-label="Buscar en"
                            className="hidden shrink-0 border-r border-gray-300 bg-gray-100 px-2 text-xs text-gray-700 outline-none sm:block"
                            defaultValue="pedidos"
                        >
                            <option value="pedidos">Pedidos</option>
                        </select>
                        <input
                            type="search"
                            value={orderQuery}
                            onChange={(event) =>
                                searchOrders(event.target.value)
                            }
                            placeholder="Buscar en tus pedidos..."
                            aria-label="Buscar en tus pedidos"
                            className="min-w-0 flex-1 px-3 text-sm text-gray-900 outline-none placeholder:text-gray-500"
                        />
                        <button
                            type="submit"
                            aria-label="Buscar"
                            className="flex w-12 items-center justify-center bg-amz-orange text-gray-900 transition hover:bg-[#f3a847]"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="size-5"
                                aria-hidden="true"
                            >
                                <circle
                                    cx="11"
                                    cy="11"
                                    r="6.5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                                <path
                                    d="m16 16 4.5 4.5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </form>

                    <Link
                        href="/dashboard"
                        className="outline-hover hidden rounded-sm px-2 py-1 text-left leading-tight md:block"
                    >
                        <span className="block text-[10px] text-gray-300">
                            Hola, {firstName}
                        </span>
                        <span className="block text-xs font-bold">
                            Cuenta y listas
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setCartOpen(true)}
                        className="outline-hover relative flex items-end gap-1 rounded-sm px-2 py-1"
                        aria-label={`Abrir carrito, ${cartQty} productos`}
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
                            <span className="absolute -top-1 right-0 min-w-5 rounded-full bg-amz-orange px-1 text-center text-xs font-black text-gray-900">
                                {cartQty}
                            </span>
                        </span>
                        <span className="hidden pb-0.5 text-xs font-bold sm:block">
                            Carrito
                        </span>
                    </button>
                </div>
            </div>

            <div className="bg-amz-navy text-white">
                <div className="hide-scroll mx-auto flex max-w-[1500px] items-center gap-1 overflow-x-auto px-3 py-1.5">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setSection(item.id)}
                            aria-current={
                                section === item.id ? 'page' : undefined
                            }
                            className={cn(
                                'flex shrink-0 items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-medium transition',
                                section === item.id
                                    ? 'bg-white/10 font-bold outline outline-1 outline-white'
                                    : 'hover:outline hover:outline-1 hover:outline-white/50',
                            )}
                        >
                            <span aria-hidden="true">{item.emoji}</span>
                            {item.label}
                        </button>
                    ))}

                    <button
                        type="button"
                        onClick={() => void logout()}
                        className="ml-auto flex shrink-0 items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-medium text-gray-200 transition hover:outline hover:outline-1 hover:outline-white/50"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="size-4"
                            aria-hidden="true"
                        >
                            <path
                                d="M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3M10 8l-4 4 4 4M6 12h9"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </header>
    );
}
