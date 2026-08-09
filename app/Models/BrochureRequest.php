<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BrochureRequest extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['project_id', 'name', 'email', 'phone', 'source', 'source_url', 'status', 'admin_notes', 'downloaded_at', 'assigned_to'];
    protected $casts = ['downloaded_at' => 'datetime'];
    public function project(): BelongsTo { return $this->belongsTo(Project::class); }
    public function assignee(): BelongsTo { return $this->belongsTo(User::class, 'assigned_to'); }
}
