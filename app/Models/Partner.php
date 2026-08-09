<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Partner extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['name', 'role', 'description', 'logo_id', 'url', 'sort_order', 'is_published', 'translations'];
    protected $casts = ['is_published' => 'boolean', 'translations' => 'array'];
    public function logo(): BelongsTo { return $this->belongsTo(MediaAsset::class, 'logo_id'); }
}
