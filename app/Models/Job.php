<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Job extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'job_positions';
    protected $fillable = ['title', 'slug', 'department', 'location', 'employment_type', 'experience_level', 'summary', 'description', 'requirements', 'responsibilities', 'benefits', 'deadline', 'is_published', 'is_featured', 'published_at', 'sort_order', 'translations'];
    protected $casts = ['deadline' => 'date', 'is_published' => 'boolean', 'is_featured' => 'boolean', 'published_at' => 'datetime', 'translations' => 'array'];
    public function applications(): HasMany { return $this->hasMany(JobApplication::class, 'job_position_id'); }
}
