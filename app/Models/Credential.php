<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Credential extends Model
{
    use HasFactory;

    protected $fillable = [
        "title",
        "category",
        "username",
        "password",
        "url_or_ip",
        "notes",
    ];

    protected $casts = [
        "password" => "encrypted",
        "notes" => "encrypted",
    ];
}
