import { reorder as reorderRoute } from '@/actions/App/Http/Controllers/Dashboard/OrderController';
import { postJson } from '@/lib/http';
import type { DashboardOrder } from '@/types';

type ReorderItem = {
    product_id: number;
    quantity: number;
};

/**
 * Ask the server for the order items and fall back to the loaded order when
 * the request cannot be completed.
 */
export async function reorderItems(
    order: DashboardOrder,
): Promise<ReorderItem[]> {
    try {
        const data = await postJson<{ items: ReorderItem[] }>(
            reorderRoute(order.id).url,
        );

        if (Array.isArray(data.items) && data.items.length > 0) {
            return data.items;
        }
    } catch {
        // Fall back to the items already rendered in the card.
    }

    return order.items
        .filter((item) => item.product_id !== null)
        .map((item) => ({
            product_id: item.product_id as number,
            quantity: item.qty,
        }));
}
