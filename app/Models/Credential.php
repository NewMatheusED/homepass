<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @mixin \Illuminate\Database\Eloquent\Builder
 *
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Credential[] latest(string $column = 'created_at')
 */
class Credential extends Model
{
    use HasFactory;

    public const CATEGORIES = [
        "Redes Sociais",
        "E-mail",
        "Bancos",
        "Trabalho",
        "Servidores",
        "Wi-Fi",
        "Aplicativos",
        "Outros",
    ];

    protected $fillable = [
        "user_id",
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

    /**
     * @return BelongsTo<User, Credential>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
