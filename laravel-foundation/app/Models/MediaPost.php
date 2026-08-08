<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MediaPost extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['media_category_id', 'type', 'title', 'slug', 'excerpt', 'content', 'featured_image_id', 'open_graph_image_id', 'author_id', 'event_date', 'published_at', 'is_featured', 'is_published', 'sort_order', 'seo_title', 'seo_description', 'canonical_url', 'robots', 'translations'];
    protected $casts = ['event_date' => 'date', 'published_at' => 'datetime', 'is_featured' => 'boolean', 'is_published' => 'boolean', 'translations' => 'array'];
    public function category(): BelongsTo { return $this->belongsTo(MediaCategory::class, 'media_category_id'); }
    public function featuredImage(): BelongsTo { return $this->belongsTo(MediaAsset::class, 'featured_image_id'); }
    public function openGraphImage(): BelongsTo { return $this->belongsTo(MediaAsset::class, 'open_graph_image_id'); }
    public function author(): BelongsTo { return $this->belongsTo(User::class, 'author_id'); }
}
