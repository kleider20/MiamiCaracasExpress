<?php

use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Support\Facades\Hash;

test('the demo accounts are seeded with the documented password', function () {
    $this->seed(UserSeeder::class);

    $admin = User::where('email', 'admin@mce.com')->first();

    expect($admin)->not->toBeNull()
        ->and($admin->name)->toBe('Administrador MCE')
        ->and(Hash::check('password', $admin->password))->toBeTrue()
        ->and($admin->hasVerifiedEmail())->toBeTrue();

    expect(User::whereIn('email', [
        'user@mce.com',
        'maria@mce.com',
    ])->count())->toBe(2);
});
