<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Award extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['title', 'year', 'description', 'icon_key', 'sort_order', 'is_published'];
    protected $casts = ['year' => 'integer', 'is_published' => 'boolean'];
}
