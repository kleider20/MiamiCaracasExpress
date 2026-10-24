import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';

const STYLES: Record<OrderStatus, string> = {
    Entregado: 'border-green-300 bg-green-100 text-green-800',
    'En camino': 'border-blue-300 bg-blue-100 text-blue-800',
    'Preparando envío': 'border-yellow-300 bg-yellow-100 text-yellow-800',
    Cancelado: 'border-red-300 bg-red-100 text-red-700',
};

export default function OrderStatusBadge({
    status,
    className,
}: {
    status: OrderStatus;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold',
                STYLES[status],
                className,
            )}
        >
            {status}
        </span>
    );
}
