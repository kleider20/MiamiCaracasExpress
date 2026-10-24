<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Seed the demo accounts used across the documentation and tests.
     */
    public function run(): void
    {
        $accounts = [
            ['name' => 'Administrador MCE', 'email' => 'admin@mce.com'],
            ['name' => 'Cliente MCE', 'email' => 'user@mce.com'],
            ['name' => 'María Fernández', 'email' => 'maria@mce.com'],
        ];

        foreach ($accounts as $account) {
            User::updateOrCreate(
                ['email' => $account['email']],
                [
                    'name' => $account['name'],
                    'password' => 'password',
                    'email_verified_at' => now(),
                ],
            );
        }
    }
}
