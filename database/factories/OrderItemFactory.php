<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
            'name' => fake()->words(4, true),
            'emoji' => '📦',
            'qty' => fake()->numberBetween(1, 3),
            'price' => fake()->randomFloat(2, 100, 5000),
            'color' => 'from-slate-700 to-slate-900',
        ];
    }
}
