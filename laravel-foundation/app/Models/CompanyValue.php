<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompanyValue extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['title', 'description', 'icon_key', 'sort_order', 'is_published'];
    protected $casts = ['is_published' => 'boolean'];
}
