<?php

namespace App\Http\Requests\Auth;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the registration request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
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
            'name.required' => 'Escribe tu nombre para crear la cuenta.',
            'name.max' => 'Tu nombre no puede tener más de 255 caracteres.',
            'email.required' => 'Necesitamos un correo para crear tu cuenta.',
            'email.email' => 'Ese correo no parece válido. Usa el formato nombre@dominio.com.',
            'email.unique' => 'Ya existe una cuenta de Miami Caracas Express con ese correo.',
            'password.required' => 'Elige una contraseña para tu cuenta.',
            'password.min' => 'Tu contraseña debe tener al menos :min caracteres.',
            'password.confirmed' => 'Las contraseñas no coinciden. Vuelve a escribirlas.',
        ];
    }

    /**
     * Get the custom attribute names for validation errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'nombre',
            'email' => 'correo electrónico',
            'password' => 'contraseña',
        ];
    }
}
