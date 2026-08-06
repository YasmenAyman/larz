<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PhotoGalleryItem extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['media_asset_id', 'title', 'alt_text', 'caption', 'location', 'event_date', 'sort_order', 'is_published', 'is_active'];
    protected $casts = ['event_date' => 'date', 'is_published' => 'boolean', 'is_active' => 'boolean'];
    public function media(): BelongsTo { return $this->belongsTo(MediaAsset::class, 'media_asset_id'); }
}
