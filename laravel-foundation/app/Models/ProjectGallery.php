<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectGallery extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['project_id', 'media_asset_id', 'alt_text', 'caption', 'sort_order', 'is_published'];
    protected $casts = ['is_published' => 'boolean'];
    public function project(): BelongsTo { return $this->belongsTo(Project::class); }
    public function media(): BelongsTo { return $this->belongsTo(MediaAsset::class, 'media_asset_id'); }
}
