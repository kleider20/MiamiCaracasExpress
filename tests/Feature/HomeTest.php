<?php

use App\Models\Product;
use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('the storefront renders the seeded catalog', function () {
    $this->seed(ProductSeeder::class);

    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('home')
        ->has('products', 18)
        ->where('products.0.category', 'Electrónica')
        ->where('products.0.is_deal', true)
    );
});

test('the product model casts catalog attributes', function () {
    $product = Product::factory()->create([
        'price' => 1299.5,
        'old_price' => 2199,
        'rating' => 4.5,
        'is_prime' => true,
        'is_deal' => false,
    ]);

    expect($product->price)->toBe(1299.5)
        ->and($product->old_price)->toBe(2199.0)
        ->and($product->rating)->toBe(4.5)
        ->and($product->is_prime)->toBeTrue()
        ->and($product->is_deal)->toBeFalse();
});
