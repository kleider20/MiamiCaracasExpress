<?php

namespace App\Http\Resources;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Address
 */
class AddressResource extends JsonResource
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
            'person' => $this->person,
            'street' => $this->street,
            'city' => $this->city,
            'zip' => $this->zip,
            'phone' => $this->phone,
            'is_default' => $this->is_default,
        ];
    }
}
