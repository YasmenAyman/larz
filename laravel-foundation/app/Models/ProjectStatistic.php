<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectStatistic extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['project_id', 'value', 'label', 'note', 'sort_order', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];
    public function project(): BelongsTo { return $this->belongsTo(Project::class); }
}
