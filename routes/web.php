<?php

use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware('auth')->group(function () {
    Route::get('api/cart', [CartController::class, 'show'])->name('cart.show');
    Route::post('api/cart/sync', [CartController::class, 'sync'])->name('cart.sync');
    Route::put('api/cart', [CartController::class, 'replace'])->name('cart.replace');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
