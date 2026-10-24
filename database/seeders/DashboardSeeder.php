<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DashboardSeeder extends Seeder
{
    /**
     * Seed the demo account dashboard: orders, addresses, wishlist and cards.
     */
    public function run(): void
    {
        $user = User::query()->firstOrCreate(
            ['email' => 'admin@mce.com'],
            [
                'name' => 'Administrador MCE',
                'password' => 'password',
                'email_verified_at' => now(),
            ],
        );

        DB::transaction(function () use ($user): void {
            $user->orders()->delete();
            $user->addresses()->delete();
            $user->wishlist()->delete();
            $user->paymentMethods()->delete();

            $user->update(['phone' => $user->phone ?: '+58 412-555-0123']);

            $home = $user->addresses()->create([
                'name' => 'Casa',
                'person' => 'Ana García',
                'street' => 'Av. Francisco de Miranda, Edif. Parque Cristal, Piso 4',
                'city' => 'Los Palos Grandes, Caracas',
                'zip' => '1060',
                'phone' => '+58 412-1234567',
                'is_default' => true,
            ]);

            $user->addresses()->create([
                'name' => 'Oficina',
                'person' => 'Ana García',
                'street' => 'Av. Principal de Los Ruices, Torre Delta, Piso 8',
                'city' => 'Los Ruices, Caracas',
                'zip' => '1071',
                'phone' => '+58 412-8765432',
                'is_default' => false,
            ]);

            foreach ($this->orders() as $definition) {
                $order = $user->orders()->create([
                    'id' => $definition['id'],
                    'date' => $definition['date'],
                    'status' => $definition['status'],
                    'eta' => $definition['eta'] ?? null,
                    'shipping_address_id' => $home->id,
                    'total' => 0,
                ]);

                foreach ($definition['items'] as $item) {
                    $product = Product::query()
                        ->where('name', 'like', '%'.$item['match'].'%')
                        ->first();

                    $order->items()->create([
                        'product_id' => $product?->id,
                        'name' => $product?->name ?? $item['fallback_name'],
                        'emoji' => $product?->emoji ?? $item['emoji'],
                        'qty' => $item['qty'],
                        'price' => $product?->price ?? $item['price'],
                        'color' => $product?->gradient ?? $item['color'],
                    ]);
                }

                $order->update([
                    'total' => $order->items()->get()
                        ->sum(fn ($item): float => $item->price * $item->qty),
                ]);
            }

            Product::query()->update(['in_stock' => true]);

            foreach ([
                'Bocina Bluetooth PartyBox',
                'Cafetera Espresso Deluxe',
                'Laptop UltraBook',
                'Bicicleta Estática Spinning',
            ] as $match) {
                $product = Product::query()
                    ->where('name', 'like', '%'.$match.'%')
                    ->first();

                if ($product) {
                    $user->wishlist()->firstOrCreate(['product_id' => $product->id]);
                }
            }

            Product::query()
                ->where('name', 'like', '%Laptop UltraBook%')
                ->update(['in_stock' => false]);

            $user->paymentMethods()->create([
                'brand' => 'Visa',
                'last4' => '4821',
                'holder' => 'ANA GARCIA',
                'exp_month' => 8,
                'exp_year' => 29,
                'is_default' => true,
                'color' => 'from-blue-600 to-indigo-800',
            ]);

            $user->paymentMethods()->create([
                'brand' => 'Mastercard',
                'last4' => '7305',
                'holder' => 'ANA GARCIA',
                'exp_month' => 3,
                'exp_year' => 27,
                'is_default' => false,
                'color' => 'from-red-600 to-orange-700',
            ]);
        });
    }

    /**
     * Demo orders for the account dashboard.
     *
     * @return array<int, array<string, mixed>>
     */
    private function orders(): array
    {
        return [
            [
                'id' => '712-4891273-5540192',
                'date' => '2026-10-22',
                'status' => 'En camino',
                'eta' => 'lunes 27 de octubre',
                'items' => [
                    [
                        'match' => 'SoundMax',
                        'fallback_name' => 'Audífonos SoundMax Pro',
                        'emoji' => '🎧',
                        'qty' => 1,
                        'price' => 1299,
                        'color' => 'from-slate-700 to-slate-900',
                    ],
                    [
                        'match' => 'FitBand',
                        'fallback_name' => 'Smartwatch FitBand X2',
                        'emoji' => '⌚',
                        'qty' => 1,
                        'price' => 1899,
                        'color' => 'from-blue-600 to-indigo-800',
                    ],
                ],
            ],
            [
                'id' => '712-2245891-1098765',
                'date' => '2026-10-15',
                'status' => 'Entregado',
                'items' => [
                    [
                        'match' => 'Robot Aspiradora',
                        'fallback_name' => 'Robot Aspiradora SmartClean',
                        'emoji' => '🤖',
                        'qty' => 1,
                        'price' => 4299,
                        'color' => 'from-teal-600 to-cyan-900',
                    ],
                ],
            ],
            [
                'id' => '712-9981234-7712340',
                'date' => '2026-10-03',
                'status' => 'Entregado',
                'items' => [
                    [
                        'match' => 'AirFlex',
                        'fallback_name' => 'Tenis AirFlex',
                        'emoji' => '👟',
                        'qty' => 1,
                        'price' => 1599,
                        'color' => 'from-sky-500 to-cyan-700',
                    ],
                    [
                        'match' => 'Mochila Urbana',
                        'fallback_name' => 'Mochila Antirrobo',
                        'emoji' => '🎒',
                        'qty' => 1,
                        'price' => 749,
                        'color' => 'from-indigo-600 to-blue-900',
                    ],
                ],
            ],
            [
                'id' => '712-5567890-3345612',
                'date' => '2026-09-28',
                'status' => 'Preparando envío',
                'items' => [
                    [
                        'match' => 'Control Gaming',
                        'fallback_name' => 'Control Gaming Pro RGB',
                        'emoji' => '🎮',
                        'qty' => 1,
                        'price' => 1099,
                        'color' => 'from-emerald-600 to-green-800',
                    ],
                ],
            ],
            [
                'id' => '712-1123456-9988776',
                'date' => '2026-09-10',
                'status' => 'Cancelado',
                'items' => [
                    [
                        'match' => 'Bloques Constructores',
                        'fallback_name' => 'Bloques Constructores',
                        'emoji' => '🧱',
                        'qty' => 1,
                        'price' => 899,
                        'color' => 'from-yellow-500 to-amber-700',
                    ],
                ],
            ],
        ];
    }
}
