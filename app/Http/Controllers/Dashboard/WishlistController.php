<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\WishlistItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * Send direct visits to the wishlist section of the dashboard.
     */
    public function index(): RedirectResponse
    {
        return to_route('dashboard', ['section' => 'deseos']);
    }

    /**
     * Toggle a product in the authenticated user's wishlist.
     */
    public function toggle(Request $request, Product $product): JsonResponse|RedirectResponse
    {
        $user = $request->user();
        $item = $user->wishlist()->where('product_id', $product->id)->first();

        if ($item) {
            $item->delete();
            $added = false;
        } else {
            $user->wishlist()->create(['product_id' => $product->id]);
            $added = true;
        }

        if ($request->wantsJson()) {
            return response()->json(['added' => $added]);
        }

        return to_route('dashboard', ['section' => 'deseos'])->with(
            'success',
            $added
                ? 'Producto agregado a tu lista de deseos.'
                : 'Producto eliminado de tu lista de deseos.',
        );
    }

    /**
     * Remove an item from the authenticated user's wishlist.
     */
    public function destroy(Request $request, WishlistItem $item): RedirectResponse
    {
        abort_unless($item->user_id === $request->user()->id, 403);

        $item->delete();

        return to_route('dashboard', ['section' => 'deseos'])->with('success', 'Producto eliminado de tu lista de deseos.');
    }
}
