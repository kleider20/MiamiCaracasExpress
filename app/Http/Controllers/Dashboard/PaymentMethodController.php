<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\StorePaymentMethodRequest;
use App\Models\PaymentMethod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentMethodController extends Controller
{
    /**
     * Brand colors used by the virtual credit cards.
     *
     * @var array<string, string>
     */
    private const BRAND_COLORS = [
        'Visa' => 'from-blue-600 to-indigo-800',
        'Mastercard' => 'from-red-600 to-orange-700',
        'Amex' => 'from-gray-600 to-slate-800',
    ];

    /**
     * Store a new payment method for the authenticated user.
     */
    public function store(StorePaymentMethodRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validated();
        $isFirstCard = ! $user->paymentMethods()->exists();
        $makeDefault = (bool) ($data['is_default'] ?? false) || $isFirstCard;

        DB::transaction(function () use ($user, $data, $makeDefault): void {
            if ($makeDefault) {
                $user->paymentMethods()->update(['is_default' => false]);
            }

            $user->paymentMethods()->create([
                ...$data,
                'color' => self::BRAND_COLORS[$data['brand']] ?? 'from-slate-600 to-slate-800',
                'is_default' => $makeDefault,
            ]);
        });

        return to_route('dashboard', ['section' => 'pagos'])->with('success', 'Método de pago agregado correctamente.');
    }

    /**
     * Delete a payment method owned by the authenticated user.
     */
    public function destroy(Request $request, PaymentMethod $method): RedirectResponse
    {
        abort_unless($method->user_id === $request->user()->id, 403);

        $wasDefault = $method->is_default;
        $userId = $method->user_id;

        $method->delete();

        if ($wasDefault) {
            PaymentMethod::query()
                ->where('user_id', $userId)
                ->orderBy('id')
                ->first()
                ?->update(['is_default' => true]);
        }

        return to_route('dashboard', ['section' => 'pagos'])->with('success', 'Método de pago eliminado.');
    }

    /**
     * Mark a payment method as the default one.
     */
    public function setDefault(Request $request, PaymentMethod $method): RedirectResponse
    {
        abort_unless($method->user_id === $request->user()->id, 403);

        DB::transaction(function () use ($request, $method): void {
            $request->user()->paymentMethods()->update(['is_default' => false]);

            $method->update(['is_default' => true]);
        });

        return to_route('dashboard', ['section' => 'pagos'])->with('success', 'Método de pago predeterminado actualizado.');
    }
}
