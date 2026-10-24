<?php

namespace App\Http\Resources;

use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin PaymentMethod
 */
class PaymentMethodResource extends JsonResource
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
            'brand' => $this->brand,
            'last4' => $this->last4,
            'holder' => $this->holder,
            'exp_month' => $this->exp_month,
            'exp_year' => $this->exp_year,
            'exp_label' => str_pad((string) $this->exp_month, 2, '0', STR_PAD_LEFT)
                .'/'.str_pad((string) $this->exp_year, 2, '0', STR_PAD_LEFT),
            'is_default' => $this->is_default,
            'color' => $this->color,
        ];
    }
}
