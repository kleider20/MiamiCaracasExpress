<?php

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'name',
    'category',
    'price',
    'old_price',
    'discount_percent',
    'rating',
    'reviews_count',
    'emoji',
    'gradient',
    'is_prime',
    'is_deal',
    'in_stock',
    'description',
])]
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'float',
            'old_price' => 'float',
            'rating' => 'float',
            'reviews_count' => 'integer',
            'discount_percent' => 'integer',
            'is_prime' => 'boolean',
            'is_deal' => 'boolean',
            'in_stock' => 'boolean',
        ];
    }
}
