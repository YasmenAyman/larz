<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectAmenity extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['project_id', 'group_name', 'icon_key', 'title', 'description', 'sort_order', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];
    public function project(): BelongsTo { return $this->belongsTo(Project::class); }
}
