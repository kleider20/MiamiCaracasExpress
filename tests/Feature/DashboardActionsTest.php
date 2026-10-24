<?php

use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\User;
use App\Models\WishlistItem;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

test('cancelling an order on its way marks it as cancelled', function () {
    $user = User::factory()->create();
    $order = Order::factory()->for($user)->create([
        'status' => 'En camino',
        'eta' => 'lunes 27 de octubre',
    ]);

    $this->actingAs($user)
        ->post(route('dashboard.orders.cancel', $order))
        ->assertRedirect()
        ->assertSessionHas('success');

    $order->refresh();

    expect($order->status)->toBe('Cancelado')
        ->and($order->eta)->toBeNull();
});

test('a delivered order cannot be cancelled', function () {
    $user = User::factory()->create();
    $order = Order::factory()->for($user)->create([
        'status' => 'Entregado',
    ]);

    $this->actingAs($user)
        ->post(route('dashboard.orders.cancel', $order))
        ->assertRedirect()
        ->assertSessionHas('error');

    expect($order->fresh()->status)->toBe('Entregado');
});

test('a customer cannot cancel another customer order', function () {
    $otherUser = User::factory()->create();
    $order = Order::factory()->for($otherUser)->create([
        'status' => 'En camino',
    ]);

    $this->actingAs(User::factory()->create())
        ->post(route('dashboard.orders.cancel', $order))
        ->assertForbidden();

    expect($order->fresh()->status)->toBe('En camino');
});

test('reordering returns the order items as cart payloads', function () {
    $user = User::factory()->create();
    $order = Order::factory()->for($user)->create();
    $product = Product::factory()->create();

    OrderItem::factory()->for($order)->create([
        'product_id' => $product->id,
        'qty' => 2,
        'price' => 1299,
    ]);

    $this->actingAs($user)
        ->postJson(route('dashboard.orders.reorder', $order))
        ->assertOk()
        ->assertJsonCount(1, 'items')
        ->assertJsonPath('items.0.product_id', $product->id)
        ->assertJsonPath('items.0.quantity', 2);
});

test('storing the first address makes it the default', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('dashboard.addresses.store'), [
            'name' => 'Casa',
            'person' => 'Ana García',
            'street' => 'Av. Francisco de Miranda, Edif. Parque Cristal',
            'city' => 'Los Palos Grandes, Caracas',
            'zip' => '1060',
            'phone' => '+58 412-1234567',
            'is_default' => false,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('addresses', [
        'user_id' => $user->id,
        'name' => 'Casa',
        'is_default' => true,
    ]);
});

test('an address requires every shipping field', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('dashboard.addresses.store'), [])
        ->assertSessionHasErrors([
            'name',
            'person',
            'street',
            'city',
            'zip',
            'phone',
        ]);
});

test('marking an address as default unsets the previous one', function () {
    $user = User::factory()->create();
    $default = Address::factory()->for($user)->create([
        'is_default' => true,
    ]);
    $other = Address::factory()->for($user)->create([
        'is_default' => false,
    ]);

    $this->actingAs($user)
        ->post(route('dashboard.addresses.setDefault', $other))
        ->assertRedirect()
        ->assertSessionHas('success');

    expect($default->fresh()->is_default)->toBeFalse()
        ->and($other->fresh()->is_default)->toBeTrue();
});

test('a customer cannot update an address owned by someone else', function () {
    $address = Address::factory()->create();

    $this->actingAs(User::factory()->create())
        ->put(route('dashboard.addresses.update', $address), [
            'name' => 'Robada',
            'person' => 'Intruso',
            'street' => 'Calle falsa 123',
            'city' => 'Caracas',
            'zip' => '1010',
            'phone' => '+58 412-0000000',
        ])
        ->assertForbidden();
});

test('storing a card normalizes its holder and last four digits', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('dashboard.payment-methods.store'), [
            'brand' => 'Visa',
            'last4' => '48a21',
            'holder' => 'ana garcia',
            'exp_month' => 8,
            'exp_year' => 29,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('payment_methods', [
        'user_id' => $user->id,
        'brand' => 'Visa',
        'last4' => '4821',
        'holder' => 'ANA GARCIA',
        'is_default' => true,
    ]);
});

test('a customer cannot change another customer payment method', function () {
    $method = PaymentMethod::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post(route('dashboard.payment-methods.setDefault', $method))
        ->assertForbidden();
});

test('toggling a product adds it to and removes it from the wishlist', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $this->actingAs($user)
        ->post(route('dashboard.wishlist.toggle', $product))
        ->assertRedirect();

    $this->assertDatabaseHas('wishlist_items', [
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $this->actingAs($user)
        ->post(route('dashboard.wishlist.toggle', $product))
        ->assertRedirect();

    $this->assertDatabaseMissing('wishlist_items', [
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);
});

test('a customer cannot delete another customer wishlist item', function () {
    $item = WishlistItem::factory()->create();

    $this->actingAs(User::factory()->create())
        ->delete(route('dashboard.wishlist.destroy', $item))
        ->assertForbidden();
});

test('changing the email resets its verification', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $this->actingAs($user)
        ->put(route('dashboard.profile.update'), [
            'name' => 'María Fernández',
            'email' => 'maria.nueva@mce.com',
            'phone' => '+58 412-7654321',
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $user->refresh();

    expect($user->name)->toBe('María Fernández')
        ->and($user->email)->toBe('maria.nueva@mce.com')
        ->and($user->phone)->toBe('+58 412-7654321')
        ->and($user->email_verified_at)->toBeNull();
});

test('the password reset link is sent to the authenticated email', function () {
    Notification::fake();

    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('dashboard.profile.password-reset'))
        ->assertRedirect()
        ->assertSessionHas('success');

    Notification::assertSentTo($user, ResetPassword::class);
});
