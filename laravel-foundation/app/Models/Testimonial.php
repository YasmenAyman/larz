<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Testimonial extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['name', 'role', 'quote', 'translations', 'media_asset_id', 'sort_order', 'is_published'];
    protected $casts = ['is_published' => 'boolean', 'translations' => 'array'];
    public function media(): BelongsTo { return $this->belongsTo(MediaAsset::class, 'media_asset_id'); }
}
