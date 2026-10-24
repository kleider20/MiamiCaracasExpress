<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Product
 */
class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => $this->category,
            'price' => $this->price,
            'old_price' => $this->old_price,
            'discount_percent' => $this->discount_percent,
            'rating' => $this->rating,
            'reviews_count' => $this->reviews_count,
            'emoji' => $this->emoji,
            'gradient' => $this->gradient,
            'is_prime' => $this->is_prime,
            'is_deal' => $this->is_deal,
            'in_stock' => $this->in_stock,
            'description' => $this->description,
        ];
    }
}
