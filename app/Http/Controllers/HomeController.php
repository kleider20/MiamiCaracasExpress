<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the Miami Caracas Express storefront.
     */
    public function index(): Response
    {
        return Inertia::render('home', [
            'products' => Product::query()
                ->orderBy('id')
                ->get()
                ->map(fn (Product $product): array => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category,
                    'price' => $product->price,
                    'old_price' => $product->old_price,
                    'discount_percent' => $product->discount_percent,
                    'rating' => $product->rating,
                    'reviews_count' => $product->reviews_count,
                    'emoji' => $product->emoji,
                    'gradient' => $product->gradient,
                    'is_prime' => $product->is_prime,
                    'is_deal' => $product->is_deal,
                    'description' => $product->description,
                ])
                ->all(),
        ]);
    }
}
