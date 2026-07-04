<?php

use App\Http\Controllers\CredentialController;
use Illuminate\Support\Facades\Route;

Route::get("/", function () {
    return redirect()->route("login");
});

Route::middleware(["auth", "verified"])->group(function () {
    Route::get("/dashboard", [CredentialController::class, "index"])->name(
        "dashboard",
    );

    Route::post("/credentials", [CredentialController::class, "store"])->name(
        "credentials.store",
    );
});

require __DIR__ . "/auth.php";
