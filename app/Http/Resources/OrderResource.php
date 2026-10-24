<?php

namespace App\Http\Resources;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Order
 */
class OrderResource extends JsonResource
{
    /**
     * Map each order status to the shipping progress percentage.
     *
     * @var array<string, int>
     */
    private const PROGRESS = [
        'Preparando envío' => 33,
        'En camino' => 66,
        'Entregado' => 100,
        'Cancelado' => 0,
    ];

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date' => $this->date?->toDateString(),
            'date_label' => $this->date?->locale('es')->translatedFormat('j \d\e F \d\e Y'),
            'total' => $this->total,
            'status' => $this->status,
            'eta' => $this->eta,
            'progress' => self::PROGRESS[$this->status] ?? 0,
            'shipping_address' => $this->relationLoaded('shippingAddress') && $this->shippingAddress
                ? (new AddressResource($this->shippingAddress))->resolve()
                : null,
            'items' => $this->relationLoaded('items')
                ? $this->items->map(fn ($item): array => [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'name' => $item->name,
                    'emoji' => $item->emoji,
                    'qty' => $item->qty,
                    'price' => $item->price,
                    'color' => $item->color,
                    'line_total' => round($item->price * $item->qty, 2),
                ])->all()
                : [],
        ];
    }
}
