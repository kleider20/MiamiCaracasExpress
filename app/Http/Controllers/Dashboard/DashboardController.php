<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Resources\AddressResource;
use App\Http\Resources\OrderResource;
use App\Http\Resources\PaymentMethodResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\WishlistResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Sections available inside the dashboard.
     *
     * @var array<int, string>
     */
    private const SECTIONS = [
        'resumen',
        'pedidos',
        'direcciones',
        'deseos',
        'pagos',
        'configuracion',
    ];

    /**
     * Display the customer account dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $section = (string) $request->query('section', 'resumen');

        if (! in_array($section, self::SECTIONS, true)) {
            $section = 'resumen';
        }

        $orders = $user->orders()
            ->with(['items', 'shippingAddress'])
            ->latest('date')
            ->get();

        $addresses = $user->addresses()
            ->orderByDesc('is_default')
            ->orderBy('id')
            ->get();

        $wishlist = $user->wishlist()
            ->with('product')
            ->latest()
            ->get();

        $paymentMethods = $user->paymentMethods()
            ->orderByDesc('is_default')
            ->orderBy('id')
            ->get();

        return Inertia::render('dashboard/index', [
            'section' => $section,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'email_verified_at' => $user->email_verified_at?->toISOString(),
                'created_at' => $user->created_at?->toISOString(),
                'member_since' => $user->created_at?->locale('es')->translatedFormat('F \d\e Y'),
                'two_factor_enabled' => $user->two_factor_confirmed_at !== null,
            ],
            'orders' => OrderResource::collection($orders)->resolve(),
            'addresses' => AddressResource::collection($addresses)->resolve(),
            'wishlist' => WishlistResource::collection($wishlist)->resolve(),
            'paymentMethods' => PaymentMethodResource::collection($paymentMethods)->resolve(),
            'recommendedProducts' => ProductResource::collection(
                Product::query()->inRandomOrder()->limit(4)->get(),
            )->resolve(),
            'products' => ProductResource::collection(
                Product::query()->orderBy('id')->get(),
            )->resolve(),
        ]);
    }
}
