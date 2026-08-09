<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectUnitType extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['project_id', 'tag', 'name', 'size_min', 'size_max', 'size_unit', 'sort_order', 'is_published'];
    protected $casts = ['size_min' => 'decimal:2', 'size_max' => 'decimal:2', 'is_published' => 'boolean'];
    public function project(): BelongsTo { return $this->belongsTo(Project::class); }
}
