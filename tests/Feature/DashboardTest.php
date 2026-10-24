<?php

use App\Models\Address;
use App\Models\Order;
use App\Models\PaymentMethod;
use App\Models\User;
use App\Models\WishlistItem;
use Database\Seeders\DashboardSeeder;
use Database\Seeders\ProductSeeder;
use Database\Seeders\UserSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('the dashboard renders the demo account data', function () {
    $this->seed([
        UserSeeder::class,
        ProductSeeder::class,
        DashboardSeeder::class,
    ]);

    $user = User::query()->where('email', 'admin@mce.com')->firstOrFail();

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard/index')
        ->where('section', 'resumen')
        ->where('user.email', 'admin@mce.com')
        ->where('user.phone', '+58 412-555-0123')
        ->has('orders', 5)
        ->where('orders.0.id', '712-4891273-5540192')
        ->where('orders.0.status', 'En camino')
        ->where('orders.0.progress', 66)
        ->where('orders.0.eta', 'lunes 27 de octubre')
        ->where('orders.0.total', 3198)
        ->has('orders.0.items', 2)
        ->where('orders.0.items.0.product_id', 1)
        ->where('orders.0.shipping_address.name', 'Casa')
        ->has('addresses', 2)
        ->where('addresses.0.is_default', true)
        ->has('wishlist', 4)
        ->where('wishlist', fn ($wishlist) => collect($wishlist)
            ->firstWhere('product.id', 3)['in_stock'] === false)
        ->has('paymentMethods', 2)
        ->where('paymentMethods.0.brand', 'Visa')
        ->where('paymentMethods.0.is_default', true)
        ->has('recommendedProducts', 4)
        ->has('products', 18)
    );
});

test('the dashboard accepts a section query parameter', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard', ['section' => 'pagos']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/index')
            ->where('section', 'pagos')
        );
});

test('an unknown section falls back to the summary', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard', ['section' => 'no-existe']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('section', 'resumen')
        );
});

test('the dashboard only includes data owned by the authenticated user', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    Order::factory()->for($otherUser)->create([
        'id' => '712-0000000-0000001',
    ]);
    Address::factory()->for($otherUser)->create();
    WishlistItem::factory()->for($otherUser)->create();
    PaymentMethod::factory()->for($otherUser)->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('orders', 0)
            ->has('addresses', 0)
            ->has('wishlist', 0)
            ->has('paymentMethods', 0)
        );
});
