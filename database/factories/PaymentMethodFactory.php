<?php

namespace Database\Factories;

use App\Models\PaymentMethod;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PaymentMethod>
 */
class PaymentMethodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $brand = fake()->randomElement(['Visa', 'Mastercard', 'Amex']);

        return [
            'user_id' => User::factory(),
            'brand' => $brand,
            'last4' => fake()->numerify('####'),
            'holder' => mb_strtoupper(fake()->name()),
            'exp_month' => fake()->numberBetween(1, 12),
            'exp_year' => fake()->numberBetween(27, 33),
            'is_default' => false,
            'color' => match ($brand) {
                'Visa' => 'from-blue-600 to-indigo-800',
                'Mastercard' => 'from-red-600 to-orange-700',
                default => 'from-gray-600 to-slate-800',
            },
        ];
    }
}
