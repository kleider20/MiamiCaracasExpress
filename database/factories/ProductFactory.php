<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $price = fake()->randomFloat(2, 199, 18999);
        $oldPrice = $price * fake()->randomFloat(2, 1.15, 1.8);

        return [
            'name' => fake()->sentence(6),
            'category' => fake()->randomElement(['Electrónica', 'Hogar', 'Moda', 'Deportes', 'Juguetes']),
            'price' => $price,
            'old_price' => round($oldPrice, 2),
            'discount_percent' => (int) round((1 - $price / $oldPrice) * 100),
            'rating' => fake()->randomFloat(1, 3.5, 5),
            'reviews_count' => fake()->numberBetween(50, 25000),
            'emoji' => fake()->randomElement(['🎧', '⌚', '💻', '📱', '☕', '🎮', '👟', '🎒']),
            'gradient' => 'from-slate-700 to-slate-900',
            'is_prime' => fake()->boolean(70),
            'is_deal' => fake()->boolean(50),
            'description' => fake()->paragraph(),
        ];
    }
}
