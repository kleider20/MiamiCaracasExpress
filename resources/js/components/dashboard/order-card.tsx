import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { cancel as cancelRoute } from '@/actions/App/Http/Controllers/Dashboard/OrderController';
import OrderStatusBadge from '@/components/dashboard/order-status-badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { reorderItems } from '@/lib/dashboard';
import { money } from '@/lib/format';
import type { DashboardOrder } from '@/types';

export default function OrderCard({ order }: { order: DashboardOrder }) {
    const [expanded, setExpanded] = useState(false);
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const buyAgain = useCallback(async () => {
        const items = await reorderItems(order);

        if (items.length === 0) {
            showToast('Este pedido ya no tiene productos disponibles.');
            return;
        }

        items.forEach((item) => addToCart(item.product_id, item.quantity));
    }, [addToCart, order, showToast]);

    const cancelOrder = useCallback(() => {
        if (
            !window.confirm(
                `¿Seguro que quieres cancelar el pedido ${order.id}?`,
            )
        ) {
            return;
        }

        router.post(cancelRoute(order.id).url, {}, { preserveScroll: true });
    }, [order.id]);

    const trackPackage = useCallback(() => {
        setExpanded(true);
        showToast(
            order.eta
                ? `Tu pedido llega ${order.eta}.`
                : 'Tu pedido está en camino.',
        );
    }, [order.eta, showToast]);

    const canCancel = !['Entregado', 'Cancelado'].includes(order.status);

    return (
        <article className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <header className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
                <div>
                    <p className="text-[10px] font-semibold tracking-wide text-gray-500 uppercase">
                        Pedido realizado
                    </p>
                    <p className="text-xs font-medium text-gray-900">
                        {order.date_label}
                    </p>
                </div>
                <div>
                    <p className="text-[10px] font-semibold tracking-wide text-gray-500 uppercase">
                        Total
                    </p>
                    <p className="text-xs font-medium text-gray-900">
                        {money(order.total)}
                    </p>
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold tracking-wide text-gray-500 uppercase">
                        Enviar a
                    </p>
                    <p className="truncate text-xs font-medium text-gray-900">
                        {order.shipping_address
                            ? `${order.shipping_address.person}, ${order.shipping_address.city}`
                            : 'Dirección no disponible'}
                    </p>
                </div>
                <div className="ml-auto text-right">
                    <p className="text-[10px] text-gray-500">
                        Pedido {order.id}
                    </p>
                    <button
                        type="button"
                        onClick={() => setExpanded((value) => !value)}
                        className="link-mk text-xs font-semibold"
                        aria-expanded={expanded}
                    >
                        {expanded ? 'Ocultar detalles' : 'Ver detalles'}
                    </button>
                </div>
            </header>

            <div className="px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <OrderStatusBadge status={order.status} />
                    <p className="text-xs font-semibold text-gray-900">
                        {order.status === 'En camino' && order.eta
                            ? `Llega ${order.eta}`
                            : order.status === 'Entregado'
                              ? 'Entregado a tiempo'
                              : order.status}
                    </p>
                </div>

                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${
                            order.status === 'Cancelado'
                                ? 'bg-amz-red'
                                : 'bg-amz-orange'
                        }`}
                        style={{ width: `${order.progress}%` }}
                    />
                </div>

                <ul className="mt-3 divide-y divide-gray-100">
                    {order.items.map((item) => (
                        <li key={item.id}>
                            <button
                                type="button"
                                onClick={() => setExpanded((value) => !value)}
                                className="flex w-full items-center gap-3 py-2 text-left hover:bg-gray-50"
                            >
                                <span
                                    className={`flex size-12 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-2xl ${item.color}`}
                                    aria-hidden="true"
                                >
                                    {item.emoji}
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="line-clamp-2 block text-xs font-medium text-gray-900">
                                        {item.name}
                                    </span>
                                    <span className="mt-0.5 block text-[11px] text-gray-500">
                                        Cantidad: {item.qty}
                                    </span>
                                </span>
                                <span className="shrink-0 text-xs font-bold text-gray-900">
                                    {money(item.line_total)}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>

                {expanded && (
                    <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 p-3 fade-in">
                        <dl className="space-y-1.5 text-xs">
                            {order.items.map((item) => (
                                <div
                                    key={`detail-${item.id}`}
                                    className="flex justify-between gap-3"
                                >
                                    <dt className="text-gray-600">
                                        {item.qty} × {item.name}
                                    </dt>
                                    <dd className="font-medium text-gray-900">
                                        {money(item.line_total)}
                                    </dd>
                                </div>
                            ))}
                            <div className="flex justify-between border-t border-gray-200 pt-1.5">
                                <dt className="text-gray-600">Subtotal</dt>
                                <dd className="font-medium text-gray-900">
                                    {money(order.total)}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-600">Envío</dt>
                                <dd className="flex items-center gap-1 font-medium text-gray-900">
                                    <span className="prime-tag text-[11px]">
                                        prime
                                    </span>
                                    GRATIS
                                </dd>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 pt-1.5 text-sm font-bold text-gray-900">
                                <dt>Total</dt>
                                <dd>{money(order.total)}</dd>
                            </div>
                        </dl>

                        {order.shipping_address && (
                            <p className="mt-2 border-t border-gray-200 pt-2 text-[11px] leading-5 text-gray-600">
                                Enviado a {order.shipping_address.person} ·{' '}
                                {order.shipping_address.street},{' '}
                                {order.shipping_address.city}{' '}
                                {order.shipping_address.zip} ·{' '}
                                {order.shipping_address.phone}
                            </p>
                        )}
                    </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => void buyAgain()}
                        className="btn-cart px-4 py-1.5 text-xs font-bold text-gray-900"
                    >
                        Comprar de nuevo
                    </button>

                    <button
                        type="button"
                        onClick={() => setExpanded((value) => !value)}
                        className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                    >
                        {expanded ? 'Ocultar detalles' : 'Ver detalles'}
                    </button>

                    {order.status === 'En camino' && (
                        <button
                            type="button"
                            onClick={trackPackage}
                            className="link-mk text-xs font-semibold"
                        >
                            Rastrear paquete
                        </button>
                    )}

                    {order.status === 'Entregado' && (
                        <button
                            type="button"
                            onClick={() =>
                                showToast(
                                    'Gracias por tu compra. Las reseñas con foto estarán disponibles muy pronto.',
                                )
                            }
                            className="link-mk text-xs font-semibold"
                        >
                            Escribir reseña
                        </button>
                    )}

                    {canCancel && (
                        <button
                            type="button"
                            onClick={cancelOrder}
                            className="ml-auto text-xs font-semibold text-amz-link hover:text-amz-link-hover hover:underline"
                        >
                            Cancelar pedido
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}
