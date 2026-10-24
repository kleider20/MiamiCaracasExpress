<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Send direct visits to the orders section of the dashboard.
     */
    public function index(): RedirectResponse
    {
        return to_route('dashboard', ['section' => 'pedidos']);
    }

    /**
     * Return the items of an order so the cart can buy them again.
     */
    public function reorder(Request $request, Order $order): JsonResponse
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        $items = $order->items()
            ->whereNotNull('product_id')
            ->get()
            ->map(fn ($item): array => [
                'product_id' => $item->product_id,
                'quantity' => $item->qty,
            ])
            ->values();

        return response()->json(['items' => $items]);
    }

    /**
     * Cancel an order while it is still on its way.
     */
    public function cancel(Request $request, Order $order): RedirectResponse
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        if (in_array($order->status, ['Entregado', 'Cancelado'], true)) {
            return to_route('dashboard', ['section' => 'pedidos'])->with('error', 'Este pedido ya no se puede cancelar.');
        }

        $order->update([
            'status' => 'Cancelado',
            'eta' => null,
        ]);

        return to_route('dashboard', ['section' => 'pedidos'])->with('success', "El pedido {$order->id} fue cancelado.");
    }
}
