<?php

namespace App\Http\Resources;

use App\Models\WishlistItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin WishlistItem
 */
class WishlistResource extends JsonResource
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
            'product' => $this->product
                ? (new ProductResource($this->product))->resolve()
                : null,
            'in_stock' => (bool) $this->product?->in_stock,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
