<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageSection extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['page_key', 'section_key', 'section_type', 'sort_order', 'status', 'published_at', 'content_snapshot', 'created_by', 'updated_by'];
    protected $casts = ['published_at' => 'datetime', 'content_snapshot' => 'array'];
    public function creator(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
    public function updater(): BelongsTo { return $this->belongsTo(User::class, 'updated_by'); }
}
