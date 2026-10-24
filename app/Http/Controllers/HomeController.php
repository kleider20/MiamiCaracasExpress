<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
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
            'products' => ProductResource::collection(
                Product::query()->orderBy('id')->get(),
            )->resolve(),
        ]);
    }
}
