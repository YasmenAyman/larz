<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobApplication extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['job_position_id', 'name', 'email', 'phone', 'city', 'linkedin_url', 'portfolio_url', 'resume_media_id', 'cover_note', 'admin_notes', 'status', 'assigned_to', 'consent_at', 'submission_date', 'source_url'];
    protected $casts = ['consent_at' => 'datetime', 'submission_date' => 'datetime'];
    public function job(): BelongsTo { return $this->belongsTo(Job::class, 'job_position_id'); }
    public function resume(): BelongsTo { return $this->belongsTo(MediaAsset::class, 'resume_media_id'); }
    public function assignee(): BelongsTo { return $this->belongsTo(User::class, 'assigned_to'); }
}
