<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InternshipApplication extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['internship_program_id', 'name', 'email', 'phone', 'city', 'linkedin_url', 'portfolio_url', 'university', 'graduation_year', 'resume_media_id', 'message', 'cover_letter', 'admin_notes', 'status', 'assigned_to', 'consent_at', 'submission_date', 'source_url'];
    protected $casts = ['graduation_year' => 'integer', 'consent_at' => 'datetime', 'submission_date' => 'datetime'];
    public function program(): BelongsTo { return $this->belongsTo(InternshipProgram::class, 'internship_program_id'); }
    public function resume(): BelongsTo { return $this->belongsTo(MediaAsset::class, 'resume_media_id'); }
    public function assignee(): BelongsTo { return $this->belongsTo(User::class, 'assigned_to'); }
}
