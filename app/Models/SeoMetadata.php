<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SeoMetadata extends Model
{
    protected $fillable = [
        'page_key', 'seo_title', 'meta_description', 'canonical_url',
        'og_title', 'og_description', 'og_image_id', 'indexable', 'followable', 'translations',
    ];

    protected $casts = ['indexable' => 'boolean', 'followable' => 'boolean', 'translations' => 'array'];

    public function ogImage(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'og_image_id');
    }
}
