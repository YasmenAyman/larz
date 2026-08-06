<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_assets', function (Blueprint $table) {
            $table->id();
            $table->string('disk', 40)->default('public');
            $table->string('path', 500)->unique();
            $table->string('original_name', 255);
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('size_bytes');
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->string('alt_text')->nullable();
            $table->text('caption')->nullable();
            $table->decimal('focal_x', 5, 2)->nullable();
            $table->decimal('focal_y', 5, 2)->nullable();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            $table->index('mime_type');
        });

        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key', 120)->unique();
            $table->text('value')->nullable();
            $table->string('value_type', 30)->default('string');
            $table->string('group_name', 80)->index();
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create('navigation_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('navigation_items')->nullOnDelete();
            $table->string('label', 100);
            $table->string('url', 500);
            $table->string('location', 30)->index();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->string('target', 20)->default('_self');
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['location', 'is_active', 'sort_order']);
        });

        Schema::create('page_sections', function (Blueprint $table) {
            $table->id();
            $table->string('page_key', 80);
            $table->string('section_key', 100);
            $table->string('section_type', 80);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->string('status', 20)->default('draft')->index();
            $table->timestamp('published_at')->nullable();
            $table->json('content_snapshot')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['page_key', 'section_key']);
            $table->index(['page_key', 'status', 'sort_order']);
        });

        Schema::create('project_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('slug', 140)->unique();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title', 180);
            $table->string('slug', 180)->unique();
            $table->text('description')->nullable();
            $table->text('short_description')->nullable();
            $table->string('location', 180)->nullable();
            $table->text('address')->nullable();
            $table->string('status', 80)->nullable();
            $table->string('project_type', 80)->nullable();
            $table->date('completion_date')->nullable();
            $table->decimal('price_from', 14, 2)->nullable();
            $table->decimal('price_to', 14, 2)->nullable();
            $table->string('currency', 10)->default('EGP');
            $table->text('installment_information')->nullable();
            $table->decimal('area_min', 10, 2)->nullable();
            $table->decimal('area_max', 10, 2)->nullable();
            $table->string('area_unit', 20)->default('m2');
            $table->string('hero_heading', 255)->nullable();
            $table->text('hero_description')->nullable();
            $table->foreignId('hero_image_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->foreignId('logo_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->foreignId('brochure_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->string('video_url', 500)->nullable();
            $table->string('virtual_tour_url', 500)->nullable();
            $table->foreignId('map_image_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_published')->default(false)->index();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamp('published_at')->nullable()->index();
            $table->string('seo_title', 180)->nullable();
            $table->string('seo_description', 320)->nullable();
            $table->string('canonical_url', 500)->nullable();
            $table->string('robots', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['is_published', 'is_featured', 'sort_order']);
        });

        Schema::create('project_galleries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('media_asset_id')->constrained('media_assets')->restrictOnDelete();
            $table->string('alt_text')->nullable();
            $table->string('caption')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['project_id', 'sort_order']);
        });

        Schema::create('project_statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('value', 100);
            $table->string('label', 100);
            $table->string('note')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['project_id', 'sort_order']);
        });

        Schema::create('project_unit_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('tag', 80);
            $table->string('name', 120);
            $table->decimal('size_min', 10, 2)->nullable();
            $table->decimal('size_max', 10, 2)->nullable();
            $table->string('size_unit', 10)->default('m2');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['project_id', 'tag']);
            $table->index(['project_id', 'sort_order']);
        });

        Schema::create('project_amenities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('group_name', 140);
            $table->string('icon_key', 60);
            $table->string('title', 140);
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['project_id', 'group_name', 'sort_order']);
        });

        Schema::create('project_updates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('media_asset_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->string('tag', 100)->nullable();
            $table->string('title', 180);
            $table->text('body')->nullable();
            $table->date('published_on')->nullable()->index();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('nearby_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('place', 180);
            $table->string('time_label', 40);
            $table->decimal('distance_km', 8, 2)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['project_id', 'sort_order']);
        });

        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name', 140);
            $table->string('role', 140)->nullable();
            $table->text('quote');
            $table->foreignId('media_asset_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('name', 180);
            $table->string('role', 180)->nullable();
            $table->text('description')->nullable();
            $table->foreignId('logo_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->string('url', 500)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('awards', function (Blueprint $table) {
            $table->id();
            $table->string('title', 180);
            $table->unsignedSmallInteger('year')->nullable();
            $table->text('description')->nullable();
            $table->string('icon_key', 60)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('media_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 120)->unique();
            $table->string('type', 30)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('media_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('media_category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type', 30)->index();
            $table->string('title', 220);
            $table->string('slug', 220)->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable();
            $table->foreignId('featured_image_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('event_date')->nullable()->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_published')->default(false)->index();
            $table->string('seo_title', 180)->nullable();
            $table->string('seo_description', 320)->nullable();
            $table->string('canonical_url', 500)->nullable();
            $table->string('robots', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['type', 'is_published', 'published_at']);
        });

        Schema::create('photo_gallery_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('media_asset_id')->constrained('media_assets')->restrictOnDelete();
            $table->string('title', 180)->nullable();
            $table->string('alt_text')->nullable();
            $table->text('caption')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['is_published', 'sort_order']);
        });

        Schema::create('company_values', function (Blueprint $table) {
            $table->id();
            $table->string('title', 140);
            $table->text('description')->nullable();
            $table->string('icon_key', 60);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('job_positions', function (Blueprint $table) {
            $table->id();
            $table->string('title', 180);
            $table->string('slug', 180)->unique();
            $table->string('department', 100);
            $table->string('location', 140);
            $table->string('employment_type', 60);
            $table->string('experience_level', 80)->nullable();
            $table->text('summary')->nullable();
            $table->longText('description')->nullable();
            $table->longText('requirements')->nullable();
            $table->longText('responsibilities')->nullable();
            $table->longText('benefits')->nullable();
            $table->date('deadline')->nullable()->index();
            $table->boolean('is_published')->default(false)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['is_published', 'is_featured', 'deadline']);
        });

        Schema::create('internship_programs', function (Blueprint $table) {
            $table->id();
            $table->string('title', 180);
            $table->text('description');
            $table->string('cta_label', 100)->nullable();
            $table->boolean('is_published')->default(false)->index();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_position_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name', 160);
            $table->string('email');
            $table->string('phone', 40)->nullable();
            $table->foreignId('resume_media_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->text('cover_note')->nullable();
            $table->string('status', 30)->default('new')->index();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('consent_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['job_position_id', 'status']);
        });

        Schema::create('internship_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('internship_program_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name', 160);
            $table->string('email');
            $table->string('phone', 40)->nullable();
            $table->string('university', 180)->nullable();
            $table->unsignedSmallInteger('graduation_year')->nullable();
            $table->foreignId('resume_media_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->text('message')->nullable();
            $table->string('status', 30)->default('new')->index();
            $table->timestamp('consent_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('general_cv_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('name', 160);
            $table->string('email');
            $table->string('phone', 40)->nullable();
            $table->foreignId('resume_media_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->text('message')->nullable();
            $table->string('status', 30)->default('new')->index();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('consent_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('contact_inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name', 160);
            $table->string('email')->nullable();
            $table->string('phone', 40);
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->text('message')->nullable();
            $table->string('source', 40)->index();
            $table->string('status', 30)->default('new')->index();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('consent_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['status', 'created_at']);
        });

        Schema::create('project_inquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->restrictOnDelete();
            $table->foreignId('project_unit_type_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name', 160);
            $table->string('email')->nullable();
            $table->string('phone', 40);
            $table->string('preferred_contact_method', 30)->nullable();
            $table->text('message')->nullable();
            $table->string('source', 40)->index();
            $table->string('status', 30)->default('new')->index();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('consent_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('brochure_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->restrictOnDelete();
            $table->string('name', 160);
            $table->string('email')->nullable();
            $table->string('phone', 40);
            $table->string('source', 40);
            $table->string('status', 30)->default('new')->index();
            $table->timestamp('downloaded_at')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('source', 40)->nullable();
            $table->string('status', 30)->default('active')->index();
            $table->timestamp('consent_at')->nullable();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        foreach ([
            'newsletter_subscribers',
            'brochure_requests',
            'project_inquiries',
            'contact_inquiries',
            'general_cv_submissions',
            'internship_applications',
            'job_applications',
            'internship_programs',
            'job_positions',
            'company_values',
            'photo_gallery_items',
            'media_posts',
            'media_categories',
            'awards',
            'partners',
            'testimonials',
            'nearby_locations',
            'project_updates',
            'project_amenities',
            'project_unit_types',
            'project_statistics',
            'project_galleries',
            'projects',
            'project_categories',
            'page_sections',
            'navigation_items',
            'site_settings',
            'media_assets',
        ] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
