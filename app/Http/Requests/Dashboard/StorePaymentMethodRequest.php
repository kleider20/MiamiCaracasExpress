<?php

namespace App\Http\Requests\Dashboard;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentMethodRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normalize the card data before validating it.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'holder' => mb_strtoupper(trim((string) $this->input('holder'))),
            'last4' => preg_replace('/\D/', '', (string) $this->input('last4')),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, string>|string>
     */
    public function rules(): array
    {
        return [
            'brand' => ['required', 'string', 'in:Visa,Mastercard,Amex'],
            'last4' => ['required', 'digits:4'],
            'holder' => ['required', 'string', 'max:120'],
            'exp_month' => ['required', 'integer', 'between:1,12'],
            'exp_year' => ['required', 'integer', 'between:26,99'],
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
            'last4.digits' => 'Ingresa exactamente los últimos 4 dígitos de la tarjeta.',
            'exp_month.between' => 'El mes de vencimiento debe estar entre 01 y 12.',
            'exp_year.between' => 'El año de vencimiento debe tener dos dígitos (por ejemplo, 29).',
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
            'brand' => 'marca',
            'last4' => 'últimos 4 dígitos',
            'holder' => 'titular',
            'exp_month' => 'mes de vencimiento',
            'exp_year' => 'año de vencimiento',
        ];
    }
}
