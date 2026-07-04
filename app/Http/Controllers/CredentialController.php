<?php

namespace App\Http\Controllers;

use App\Models\Credential;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CredentialController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $credentials = $request->user()->credentials()->latest()->get();

        return Inertia::render("Credentials/Index", [
            "credentials" => $credentials,
            "categories" => Credential::CATEGORIES,
        ]);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            "title" => "required|string|max:255",
            "category" => [
                "nullable",
                "string",
                Rule::in(Credential::CATEGORIES),
            ],
            "username" => "nullable|string|max:255",
            "password" => "required|string",
            "url_or_ip" => "nullable|string",
            "notes" => "nullable|string",
        ]);

        $request->user()->credentials()->create($validated);

        return redirect()
            ->route("dashboard")
            ->with("message", "Credencial salva com sucesso!");
    }
}
