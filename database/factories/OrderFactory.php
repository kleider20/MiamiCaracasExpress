<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => fake()->unique()->numerify('712-#######-#######'),
            'user_id' => User::factory(),
            'date' => fake()->dateTimeBetween('-6 months')->format('Y-m-d'),
            'total' => 0,
            'status' => fake()->randomElement([
                'Preparando envío',
                'En camino',
                'Entregado',
                'Cancelado',
            ]),
            'eta' => null,
            'shipping_address_id' => null,
        ];
    }
}
