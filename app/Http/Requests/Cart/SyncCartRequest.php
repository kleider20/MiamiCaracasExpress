<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class SyncCartRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'items' => ['present', 'array', 'max:100'],
            'items.*.product_id' => ['required', 'integer', 'distinct', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ];
    }

    /**
     * Get the friendly Spanish validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'items.present' => 'No recibimos los productos del carrito.',
            'items.array' => 'El carrito tiene un formato inválido.',
            'items.max' => 'El carrito no puede tener más de 100 productos distintos.',
            'items.*.product_id.required' => 'Uno de los productos del carrito no es válido.',
            'items.*.product_id.exists' => 'Uno de los productos del carrito ya no está disponible.',
            'items.*.product_id.distinct' => 'Hay un producto repetido en el carrito.',
            'items.*.quantity.required' => 'Falta la cantidad de uno de los productos.',
            'items.*.quantity.min' => 'La cantidad mínima por producto es 1.',
            'items.*.quantity.max' => 'La cantidad máxima por producto es 99.',
        ];
    }
}
