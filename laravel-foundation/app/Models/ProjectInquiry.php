<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectInquiry extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['project_id', 'project_unit_type_id', 'name', 'email', 'phone', 'preferred_contact_method', 'message', 'source', 'source_url', 'status', 'admin_notes', 'assigned_to', 'consent_at'];
    protected $casts = ['consent_at' => 'datetime'];
    public function project(): BelongsTo { return $this->belongsTo(Project::class); }
    public function unitType(): BelongsTo { return $this->belongsTo(ProjectUnitType::class, 'project_unit_type_id'); }
    public function assignee(): BelongsTo { return $this->belongsTo(User::class, 'assigned_to'); }
}
