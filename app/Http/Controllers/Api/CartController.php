<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\SyncCartRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    /**
     * Return the cart stored for the authenticated user.
     */
    public function show(Request $request): JsonResponse
    {
        return response()->json($this->payload($request->user()));
    }

    /**
     * Merge the guest cart with the cart stored for the authenticated user.
     */
    public function sync(SyncCartRequest $request): JsonResponse
    {
        $user = $request->user();
        $items = collect($request->validated('items'));

        DB::transaction(function () use ($user, $items): void {
            foreach ($items as $item) {
                $cartItem = $user->cartItems()->firstOrNew([
                    'product_id' => $item['product_id'],
                ]);

                $currentQuantity = $cartItem->exists ? $cartItem->quantity : 0;

                $cartItem->quantity = min(99, $currentQuantity + $item['quantity']);
                $cartItem->save();
            }
        });

        return response()->json($this->payload($user));
    }

    /**
     * Replace the stored cart with the given items.
     */
    public function replace(SyncCartRequest $request): JsonResponse
    {
        $user = $request->user();
        $items = collect($request->validated('items'));

        DB::transaction(function () use ($user, $items): void {
            $user->cartItems()->delete();

            $user->cartItems()->createMany(
                $items->map(fn (array $item): array => [
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ])->all(),
            );
        });

        return response()->json($this->payload($user));
    }

    /**
     * Build the cart payload shared by every cart endpoint.
     *
     * @return array{items: array<int, int>}
     */
    private function payload(User $user): array
    {
        return [
            'items' => $user->cartItems()
                ->pluck('quantity', 'product_id')
                ->map(fn (int $quantity): int => $quantity)
                ->all(),
        ];
    }
}
