<?php

use App\Models\Product;
use App\Models\User;

test('guests cannot access the cart endpoints', function () {
    $this->getJson(route('cart.show'))->assertUnauthorized();
    $this->postJson(route('cart.sync'), ['items' => []])->assertUnauthorized();
    $this->putJson(route('cart.replace'), ['items' => []])->assertUnauthorized();
});

test('the guest cart is merged with the stored cart', function () {
    $user = User::factory()->create();
    [$phone, $laptop] = Product::factory()->count(2)->create();

    $user->cartItems()->create([
        'product_id' => $phone->id,
        'quantity' => 2,
    ]);

    $response = $this->actingAs($user)->postJson(route('cart.sync'), [
        'items' => [
            ['product_id' => $phone->id, 'quantity' => 3],
            ['product_id' => $laptop->id, 'quantity' => 1],
        ],
    ]);

    $response->assertOk();

    $items = $response->json('items');

    expect($items[(string) $phone->id])->toBe(5)
        ->and($items[(string) $laptop->id])->toBe(1)
        ->and($user->cartItems()->count())->toBe(2);
});

test('the merged quantity is capped at 99 units', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $user->cartItems()->create([
        'product_id' => $product->id,
        'quantity' => 90,
    ]);

    $response = $this->actingAs($user)->postJson(route('cart.sync'), [
        'items' => [
            ['product_id' => $product->id, 'quantity' => 20],
        ],
    ]);

    $response->assertOk();

    expect($response->json('items')[(string) $product->id])->toBe(99)
        ->and($user->cartItems()->where('product_id', $product->id)->value('quantity'))->toBe(99);
});

test('the stored cart can be replaced', function () {
    $user = User::factory()->create();
    [$phone, $laptop] = Product::factory()->count(2)->create();

    $user->cartItems()->create([
        'product_id' => $phone->id,
        'quantity' => 4,
    ]);

    $response = $this->actingAs($user)->putJson(route('cart.replace'), [
        'items' => [
            ['product_id' => $laptop->id, 'quantity' => 2],
        ],
    ]);

    $response->assertOk();

    expect($response->json('items'))->toBe([(string) $laptop->id => 2])
        ->and($user->cartItems()->count())->toBe(1)
        ->and($user->cartItems()->first()->product_id)->toBe($laptop->id);
});

test('carts are scoped to the authenticated user', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $product = Product::factory()->create();

    $otherUser->cartItems()->create([
        'product_id' => $product->id,
        'quantity' => 7,
    ]);

    $response = $this->actingAs($user)->postJson(route('cart.sync'), [
        'items' => [
            ['product_id' => $product->id, 'quantity' => 1],
        ],
    ]);

    $response->assertOk();

    expect($response->json('items'))->toBe([(string) $product->id => 1])
        ->and($otherUser->cartItems()->value('quantity'))->toBe(7);
});

test('the cart payload is validated with Spanish messages', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson(route('cart.sync'), [
        'items' => [
            ['product_id' => 999999, 'quantity' => 0],
        ],
    ]);

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['items.0.product_id', 'items.0.quantity']);

    expect($response->json('errors')['items.0.product_id'][0])
        ->toBe('Uno de los productos del carrito ya no está disponible.');
});
