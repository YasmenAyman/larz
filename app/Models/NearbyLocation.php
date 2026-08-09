<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NearbyLocation extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['project_id', 'place', 'time_label', 'distance_km', 'sort_order', 'is_active'];
    protected $casts = ['distance_km' => 'decimal:2', 'is_active' => 'boolean'];
    public function project(): BelongsTo { return $this->belongsTo(Project::class); }
}
