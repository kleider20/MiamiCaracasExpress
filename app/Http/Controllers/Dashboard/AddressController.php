<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\StoreAddressRequest;
use App\Models\Address;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    /**
     * Store a new shipping address for the authenticated user.
     */
    public function store(StoreAddressRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validated();
        $isDefault = (bool) ($data['is_default'] ?? false);
        $isFirstAddress = ! $user->addresses()->exists();

        DB::transaction(function () use ($user, $data, $isDefault, $isFirstAddress): void {
            $makeDefault = $isDefault || $isFirstAddress;

            if ($makeDefault) {
                $user->addresses()->update(['is_default' => false]);
            }

            $user->addresses()->create([
                ...$data,
                'is_default' => $makeDefault,
            ]);
        });

        return to_route('dashboard', ['section' => 'direcciones'])->with('success', 'Dirección agregada correctamente.');
    }

    /**
     * Update an existing shipping address.
     */
    public function update(StoreAddressRequest $request, Address $address): RedirectResponse
    {
        abort_unless($address->user_id === $request->user()->id, 403);

        $data = $request->validated();
        $makeDefault = (bool) ($data['is_default'] ?? false);

        DB::transaction(function () use ($request, $address, $data, $makeDefault): void {
            if ($makeDefault) {
                $request->user()->addresses()->update(['is_default' => false]);
            }

            $address->update([
                ...$data,
                'is_default' => $makeDefault || $address->is_default,
            ]);
        });

        return to_route('dashboard', ['section' => 'direcciones'])->with('success', 'Dirección actualizada correctamente.');
    }

    /**
     * Delete a shipping address owned by the authenticated user.
     */
    public function destroy(Address $address): RedirectResponse
    {
        abort_unless($address->user_id === request()->user()->id, 403);

        $wasDefault = $address->is_default;
        $userId = $address->user_id;

        $address->delete();

        if ($wasDefault) {
            Address::query()
                ->where('user_id', $userId)
                ->orderBy('id')
                ->first()
                ?->update(['is_default' => true]);
        }

        return to_route('dashboard', ['section' => 'direcciones'])->with('success', 'Dirección eliminada.');
    }

    /**
     * Mark an address as the default one.
     */
    public function setDefault(Address $address): RedirectResponse
    {
        abort_unless($address->user_id === request()->user()->id, 403);

        DB::transaction(function () use ($address): void {
            Address::query()
                ->where('user_id', $address->user_id)
                ->update(['is_default' => false]);

            $address->update(['is_default' => true]);
        });

        return to_route('dashboard', ['section' => 'direcciones'])->with('success', 'Dirección predeterminada actualizada.');
    }
}
