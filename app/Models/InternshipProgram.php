<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InternshipProgram extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['title', 'description', 'cta_label', 'is_published', 'sort_order'];
    protected $casts = ['is_published' => 'boolean'];
    public function applications(): HasMany { return $this->hasMany(InternshipApplication::class); }
}
