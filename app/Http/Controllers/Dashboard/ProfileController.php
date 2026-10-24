<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\UpdateProfileRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class ProfileController extends Controller
{
    /**
     * Update the authenticated user's profile information.
     */
    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $user = $request->user();

        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return to_route('dashboard', ['section' => 'configuracion'])->with('success', 'Tus datos se actualizaron correctamente.');
    }

    /**
     * Send a password reset link to the authenticated user.
     */
    public function sendPasswordReset(Request $request): RedirectResponse
    {
        $status = Password::sendResetLink([
            'email' => $request->user()->email,
        ]);

        if ($status !== Password::RESET_LINK_SENT) {
            return to_route('dashboard', ['section' => 'configuracion'])->with('error', 'No pudimos enviar el enlace de restablecimiento. Intenta de nuevo.');
        }

        return to_route('dashboard', ['section' => 'configuracion'])->with(
            'success',
            'Te enviamos un enlace para cambiar tu contraseña a tu correo.',
        );
    }
}
