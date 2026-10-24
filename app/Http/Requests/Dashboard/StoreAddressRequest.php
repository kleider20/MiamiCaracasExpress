<?php

namespace App\Http\Requests\Dashboard;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, string>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:50'],
            'person' => ['required', 'string', 'max:120'],
            'street' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:120'],
            'zip' => ['required', 'string', 'regex:/^\d{3,6}$/'],
            'phone' => ['required', 'string', 'max:30'],
            'is_default' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'zip.regex' => 'El código postal debe contener entre 3 y 6 dígitos.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'etiqueta',
            'person' => 'nombre completo',
            'street' => 'calle y número',
            'city' => 'colonia, ciudad o estado',
            'zip' => 'código postal',
            'phone' => 'teléfono',
        ];
    }
}
