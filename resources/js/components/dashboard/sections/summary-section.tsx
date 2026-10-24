import { useCallback } from 'react';
import OrderStatusBadge from '@/components/dashboard/order-status-badge';
import { useCart } from '@/contexts/CartContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { useToast } from '@/contexts/ToastContext';
import { reorderItems } from '@/lib/dashboard';
import { money } from '@/lib/format';
import type {
    DashboardAddress,
    DashboardOrder,
    DashboardUser,
    PaymentMethod,
    Product,
    WishlistEntry,
} from '@/types';

export default function SummarySection({
    user,
    orders,
    addresses,
    wishlist,
    paymentMethods,
    recommendedProducts,
}: {
    user: DashboardUser;
    orders: DashboardOrder[];
    addresses: DashboardAddress[];
    wishlist: WishlistEntry[];
    paymentMethods: PaymentMethod[];
    recommendedProducts: Product[];
}) {
    const { setSection } = useDashboard();
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const firstName = user.name.split(' ')[0] ?? user.name;
    const defaultAddress =
        addresses.find((address) => address.is_default) ?? addresses[0];
    const latestOrder = orders[0];

    const buyAgain = useCallback(
        async (order: DashboardOrder) => {
            const items = await reorderItems(order);

            if (items.length === 0) {
                showToast('Este pedido ya no tiene productos disponibles.');
                return;
            }

            items.forEach((item) => addToCart(item.product_id, item.quantity));
        },
        [addToCart, showToast],
    );

    const cards = [
        {
            emoji: '📦',
            title: 'Tus pedidos',
            detail:
                orders.length > 0
                    ? `${orders.length} pedidos en tu historial`
                    : 'Aún no tienes pedidos',
            action: () => setSection('pedidos'),
            aria: 'Ir a tus pedidos',
        },
        {
            emoji: '📍',
            title: 'Tus direcciones',
            detail: defaultAddress
                ? `${defaultAddress.name} · ${defaultAddress.city}`
                : 'Agrega tu primera dirección',
            action: () => setSection('direcciones'),
            aria: 'Ir a tus direcciones',
        },
        {
            emoji: '❤️',
            title: 'Lista de deseos',
            detail: `${wishlist.length} ${
                wishlist.length === 1
                    ? 'producto guardado'
                    : 'productos guardados'
            }`,
            action: () => setSection('deseos'),
            aria: 'Ir a tu lista de deseos',
        },
        {
            emoji: '💳',
            title: 'Métodos de pago',
            detail:
                paymentMethods.length > 0
                    ? `${paymentMethods.length} ${
                          paymentMethods.length === 1 ? 'tarjeta' : 'tarjetas'
                      } guardadas`
                    : 'Agrega un método de pago',
            action: () => setSection('pagos'),
            aria: 'Ir a tus métodos de pago',
        },
        {
            emoji: '🔒',
            title: 'Inicio de sesión y seguridad',
            detail: user.two_factor_enabled
                ? 'Verificación en dos pasos activa'
                : 'Protege tu cuenta con 2FA',
            action: () => setSection('configuracion'),
            aria: 'Ir a seguridad de la cuenta',
        },
        {
            emoji: '🏪',
            title: 'Vende en MCE',
            detail: 'Llega a clientes en toda Venezuela',
            action: () =>
                showToast(
                    'Estamos preparando el programa de vendedores MCE para Venezuela.',
                ),
            aria: 'Conocer el programa de vendedores',
        },
    ];

    return (
        <div className="space-y-6 fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Hola, {firstName} 👋
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    Desde aquí puedes seguir tus pedidos, administrar tus
                    direcciones y cuidar tu cuenta.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => (
                    <button
                        key={card.title}
                        type="button"
                        onClick={card.action}
                        aria-label={card.aria}
                        className="card group flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-amz-orange"
                    >
                        <span
                            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-amz-bg text-2xl"
                            aria-hidden="true"
                        >
                            {card.emoji}
                        </span>
                        <span className="min-w-0">
                            <span className="block text-sm font-bold text-gray-900 group-hover:text-amz-link-hover">
                                {card.title}
                            </span>
                            <span className="mt-0.5 block text-xs leading-5 text-gray-600">
                                {card.detail}
                            </span>
                        </span>
                    </button>
                ))}
            </div>

            {latestOrder && (
                <section
                    aria-labelledby="latest-order-title"
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
                >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2
                            id="latest-order-title"
                            className="text-lg font-bold text-gray-900"
                        >
                            Pedido más reciente
                        </h2>
                        <OrderStatusBadge status={latestOrder.status} />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                        <div className="flex -space-x-3">
                            {latestOrder.items.slice(0, 4).map((item) => (
                                <span
                                    key={item.id}
                                    title={item.name}
                                    className={`flex size-16 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br text-3xl shadow ${item.color}`}
                                >
                                    <span aria-hidden="true">{item.emoji}</span>
                                </span>
                            ))}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-600">
                                {latestOrder.date_label} ·{' '}
                                {latestOrder.items.length}{' '}
                                {latestOrder.items.length === 1
                                    ? 'producto'
                                    : 'productos'}
                            </p>
                            <p className="mt-0.5 text-lg font-bold text-gray-900">
                                {money(latestOrder.total)}
                            </p>
                            <p className="text-xs text-gray-600">
                                Pedido {latestOrder.id}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => void buyAgain(latestOrder)}
                            className="btn-cart px-4 py-2 text-xs font-bold text-gray-900"
                        >
                            Comprar de nuevo
                        </button>
                    </div>

                    <div className="mt-4">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                            <div
                                className="h-full rounded-full bg-amz-orange transition-all duration-500"
                                style={{ width: `${latestOrder.progress}%` }}
                            />
                        </div>
                        <div className="mt-1.5 flex flex-wrap justify-between gap-2 text-[11px] text-gray-600">
                            <span>
                                {latestOrder.status === 'En camino' &&
                                latestOrder.eta
                                    ? `Llega ${latestOrder.eta}`
                                    : latestOrder.status}
                            </span>
                            <span>{latestOrder.progress}% completado</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSection('pedidos')}
                        className="link-mk mt-3 text-xs font-semibold"
                    >
                        Ver todos mis pedidos
                    </button>
                </section>
            )}

            <section aria-labelledby="recommended-title">
                <div className="flex items-center justify-between">
                    <h2
                        id="recommended-title"
                        className="text-lg font-bold text-gray-900"
                    >
                        Recomendado para ti
                    </h2>
                    <span className="text-xs text-gray-500">
                        Basado en tu actividad
                    </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {recommendedProducts.map((product) => (
                        <article
                            key={product.id}
                            className="card flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                        >
                            <div
                                className={`flex h-28 items-center justify-center bg-gradient-to-br ${product.gradient}`}
                            >
                                <span
                                    className="text-5xl drop-shadow"
                                    aria-hidden="true"
                                >
                                    {product.emoji}
                                </span>
                            </div>
                            <div className="flex flex-1 flex-col p-3">
                                <h3 className="line-clamp-2 text-xs leading-4 font-medium text-gray-900">
                                    {product.name}
                                </h3>
                                <p className="mt-2 text-base font-bold text-amz-price">
                                    {money(product.price)}
                                </p>
                                {product.old_price && (
                                    <p className="text-[11px] text-gray-500 line-through">
                                        {money(product.old_price)}
                                    </p>
                                )}
                                <button
                                    type="button"
                                    onClick={() => addToCart(product.id)}
                                    disabled={!product.in_stock}
                                    className="btn-cart mt-auto w-full py-1.5 text-[11px] font-bold text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {product.in_stock
                                        ? 'Agregar al carrito'
                                        : 'Agotado'}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}
