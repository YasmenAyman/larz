<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['project_category_id', 'title', 'slug', 'description', 'short_description', 'location', 'address', 'status', 'project_type', 'completion_date', 'price_from', 'price_to', 'currency', 'installment_information', 'area_min', 'area_max', 'area_unit', 'hero_heading', 'hero_description', 'hero_image_id', 'logo_id', 'brochure_id', 'video_url', 'virtual_tour_url', 'map_image_id', 'latitude', 'longitude', 'is_featured', 'is_published', 'sort_order', 'published_at', 'seo_title', 'seo_description', 'canonical_url', 'robots', 'translations', 'sections'];
    protected $casts = ['completion_date' => 'date', 'price_from' => 'decimal:2', 'price_to' => 'decimal:2', 'area_min' => 'decimal:2', 'area_max' => 'decimal:2', 'latitude' => 'decimal:7', 'longitude' => 'decimal:7', 'is_featured' => 'boolean', 'is_published' => 'boolean', 'published_at' => 'datetime', 'translations' => 'array', 'sections' => 'array'];
    public function category(): BelongsTo { return $this->belongsTo(ProjectCategory::class, 'project_category_id'); }
    public function heroImage(): BelongsTo { return $this->belongsTo(MediaAsset::class, 'hero_image_id'); }
    public function logo(): BelongsTo { return $this->belongsTo(MediaAsset::class, 'logo_id'); }
    public function brochure(): BelongsTo { return $this->belongsTo(MediaAsset::class, 'brochure_id'); }
    public function mapImage(): BelongsTo { return $this->belongsTo(MediaAsset::class, 'map_image_id'); }
    public function galleries(): HasMany { return $this->hasMany(ProjectGallery::class)->orderBy('sort_order'); }
    public function statistics(): HasMany { return $this->hasMany(ProjectStatistic::class)->orderBy('sort_order'); }
    public function unitTypes(): HasMany { return $this->hasMany(ProjectUnitType::class)->orderBy('sort_order'); }
    public function amenities(): HasMany { return $this->hasMany(ProjectAmenity::class)->orderBy('sort_order'); }
    public function updates(): HasMany { return $this->hasMany(ProjectUpdate::class)->orderBy('sort_order'); }
    public function nearbyLocations(): HasMany { return $this->hasMany(NearbyLocation::class)->orderBy('sort_order'); }
    public function contactInquiries(): HasMany { return $this->hasMany(ContactInquiry::class); }
    public function projectInquiries(): HasMany { return $this->hasMany(ProjectInquiry::class); }
    public function brochureRequests(): HasMany { return $this->hasMany(BrochureRequest::class); }
}
