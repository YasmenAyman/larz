<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactInquiry extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['name', 'email', 'phone', 'project_id', 'message', 'source', 'source_url', 'status', 'admin_notes', 'assigned_to', 'consent_at'];
    protected $casts = ['consent_at' => 'datetime'];
    public function project(): BelongsTo { return $this->belongsTo(Project::class); }
    public function assignee(): BelongsTo { return $this->belongsTo(User::class, 'assigned_to'); }
}
