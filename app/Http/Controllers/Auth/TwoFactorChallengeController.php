<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class TwoFactorChallengeController extends Controller
{
    /**
     * Show the two factor authentication challenge.
     */
    public function create(): Response
    {
        return Inertia::render('auth/two-factor-challenge');
    }
}
