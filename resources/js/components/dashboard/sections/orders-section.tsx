import { useMemo, useState } from 'react';
import OrderCard from '@/components/dashboard/order-card';
import { useDashboard } from '@/contexts/DashboardContext';
import type { DashboardOrder, OrderStatus } from '@/types';

type Filter = 'Todos' | OrderStatus;

const FILTERS: Filter[] = [
    'Todos',
    'En camino',
    'Entregado',
    'Preparando envío',
    'Cancelado',
];

export default function OrdersSection({
    orders,
}: {
    orders: DashboardOrder[];
}) {
    const { orderQuery, setOrderQuery } = useDashboard();
    const [filter, setFilter] = useState<Filter>('Todos');

    const filteredOrders = useMemo(() => {
        const query = orderQuery.trim().toLowerCase();

        return orders.filter((order) => {
            const matchesFilter = filter === 'Todos' || order.status === filter;

            if (!matchesFilter || query === '') {
                return matchesFilter;
            }

            return (
                order.id.toLowerCase().includes(query) ||
                order.items.some((item) =>
                    item.name.toLowerCase().includes(query),
                )
            );
        });
    }, [filter, orderQuery, orders]);

    return (
        <div className="space-y-5 fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Tus pedidos
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    Consulta el estado, vuelve a comprar o cancela pedidos
                    mientras estén en preparación.
                </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                <div className="hide-scroll flex gap-2 overflow-x-auto pb-1">
                    {FILTERS.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setFilter(item)}
                            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                filter === item
                                    ? 'bg-amz-dark text-white'
                                    : 'border border-gray-300 bg-white text-gray-700 hover:border-amz-orange'
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <label className="mt-3 block">
                    <span className="sr-only">
                        Buscar por número de pedido o producto
                    </span>
                    <div className="flex h-9 items-center overflow-hidden rounded-md border border-gray-300 bg-white focus-within:border-amz-orange focus-within:ring-2 focus-within:ring-amz-orange/30">
                        <span className="flex w-9 items-center justify-center text-gray-500">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="size-4"
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
                        </span>
                        <input
                            type="search"
                            value={orderQuery}
                            onChange={(event) =>
                                setOrderQuery(event.target.value)
                            }
                            placeholder="Buscar por número de pedido o producto"
                            className="mk-input h-full min-w-0 flex-1 border-0 bg-transparent pr-3 text-sm outline-none placeholder:text-gray-400"
                        />
                    </div>
                </label>
            </div>

            <p className="text-xs text-gray-600">
                {filteredOrders.length}{' '}
                {filteredOrders.length === 1 ? 'pedido' : 'pedidos'}
                {filter !== 'Todos' && ` en estado “${filter}”`}
            </p>

            {filteredOrders.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                    <span className="text-5xl" aria-hidden="true">
                        📭
                    </span>
                    <h2 className="mt-3 text-lg font-bold text-gray-900">
                        No encontramos pedidos
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Prueba con otro número de pedido, producto o filtro.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setFilter('Todos');
                            setOrderQuery('');
                        }}
                        className="link-mk mt-4 text-sm font-semibold"
                    >
                        Limpiar filtros
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
}
