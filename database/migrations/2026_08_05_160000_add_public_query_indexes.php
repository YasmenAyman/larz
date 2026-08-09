<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_positions', fn (Blueprint $table) => $table->index(['is_published', 'is_featured', 'sort_order'], 'jobs_public_listing_index'));
        Schema::table('media_posts', fn (Blueprint $table) => $table->index(['is_published', 'published_at'], 'media_posts_public_listing_index'));
        Schema::table('job_applications', fn (Blueprint $table) => $table->index(['status', 'submission_date'], 'job_applications_workflow_index'));
        Schema::table('internship_applications', fn (Blueprint $table) => $table->index(['status', 'submission_date'], 'internship_applications_workflow_index'));
        Schema::table('general_cv_submissions', fn (Blueprint $table) => $table->index(['status', 'submission_date'], 'general_cv_workflow_index'));
        Schema::table('project_inquiries', fn (Blueprint $table) => $table->index(['status', 'created_at'], 'project_inquiries_workflow_index'));
        Schema::table('brochure_requests', fn (Blueprint $table) => $table->index(['status', 'created_at'], 'brochure_requests_workflow_index'));
    }

    public function down(): void
    {
        Schema::table('brochure_requests', fn (Blueprint $table) => $table->dropIndex('brochure_requests_workflow_index'));
        Schema::table('project_inquiries', fn (Blueprint $table) => $table->dropIndex('project_inquiries_workflow_index'));
        Schema::table('general_cv_submissions', fn (Blueprint $table) => $table->dropIndex('general_cv_workflow_index'));
        Schema::table('internship_applications', fn (Blueprint $table) => $table->dropIndex('internship_applications_workflow_index'));
        Schema::table('job_applications', fn (Blueprint $table) => $table->dropIndex('job_applications_workflow_index'));
        Schema::table('media_posts', fn (Blueprint $table) => $table->dropIndex('media_posts_public_listing_index'));
        Schema::table('job_positions', fn (Blueprint $table) => $table->dropIndex('jobs_public_listing_index'));
    }
};
