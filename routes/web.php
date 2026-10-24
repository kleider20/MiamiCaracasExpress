<?php

use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Dashboard\AddressController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\OrderController;
use App\Http\Controllers\Dashboard\PaymentMethodController;
use App\Http\Controllers\Dashboard\ProfileController;
use App\Http\Controllers\Dashboard\WishlistController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware('auth')->group(function () {
    Route::get('api/cart', [CartController::class, 'show'])->name('cart.show');
    Route::post('api/cart/sync', [CartController::class, 'sync'])->name('cart.sync');
    Route::put('api/cart', [CartController::class, 'replace'])->name('cart.replace');
});

Route::middleware(['auth', 'verified'])->prefix('dashboard')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Pedidos
    Route::get('/orders', [OrderController::class, 'index'])->name('dashboard.orders.index');
    Route::post('/orders/{order}/reorder', [OrderController::class, 'reorder'])->name('dashboard.orders.reorder');
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('dashboard.orders.cancel');

    // Direcciones
    Route::post('/addresses', [AddressController::class, 'store'])->name('dashboard.addresses.store');
    Route::put('/addresses/{address}', [AddressController::class, 'update'])->name('dashboard.addresses.update');
    Route::delete('/addresses/{address}', [AddressController::class, 'destroy'])->name('dashboard.addresses.destroy');
    Route::post('/addresses/{address}/default', [AddressController::class, 'setDefault'])->name('dashboard.addresses.setDefault');

    // Lista de deseos
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('dashboard.wishlist.index');
    Route::post('/wishlist/{product}', [WishlistController::class, 'toggle'])->name('dashboard.wishlist.toggle');
    Route::delete('/wishlist/{item}', [WishlistController::class, 'destroy'])->name('dashboard.wishlist.destroy');

    // Métodos de pago
    Route::post('/payment-methods', [PaymentMethodController::class, 'store'])->name('dashboard.payment-methods.store');
    Route::delete('/payment-methods/{method}', [PaymentMethodController::class, 'destroy'])->name('dashboard.payment-methods.destroy');
    Route::post('/payment-methods/{method}/default', [PaymentMethodController::class, 'setDefault'])->name('dashboard.payment-methods.setDefault');

    // Perfil
    Route::put('/profile', [ProfileController::class, 'update'])->name('dashboard.profile.update');
    Route::post('/profile/password-reset', [ProfileController::class, 'sendPasswordReset'])->name('dashboard.profile.password-reset');
});

require __DIR__.'/settings.php';
