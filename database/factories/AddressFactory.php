<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Address>
 */
class AddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->randomElement(['Casa', 'Oficina', 'Apartamento']),
            'person' => fake()->name(),
            'street' => fake()->streetAddress(),
            'city' => fake()->randomElement(['Caracas', 'Maracaibo', 'Valencia']).', Venezuela',
            'zip' => fake()->numerify('####'),
            'phone' => '+58 412-'.fake()->numerify('#######'),
            'is_default' => false,
        ];
    }
}
