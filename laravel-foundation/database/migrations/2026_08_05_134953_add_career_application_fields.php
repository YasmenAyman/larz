<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->string('city', 120)->nullable()->after('phone');
            $table->string('linkedin_url', 500)->nullable()->after('city');
            $table->string('portfolio_url', 500)->nullable()->after('linkedin_url');
            $table->text('admin_notes')->nullable()->after('cover_note');
            $table->timestamp('submission_date')->nullable()->after('consent_at');
        });
        Schema::table('internship_applications', function (Blueprint $table) {
            $table->string('city', 120)->nullable()->after('phone');
            $table->string('linkedin_url', 500)->nullable()->after('city');
            $table->string('portfolio_url', 500)->nullable()->after('linkedin_url');
            $table->text('cover_letter')->nullable()->after('message');
            $table->text('admin_notes')->nullable()->after('cover_letter');
            $table->foreignId('assigned_to')->nullable()->after('status')->constrained('users')->nullOnDelete();
            $table->timestamp('submission_date')->nullable()->after('consent_at');
        });
        Schema::table('general_cv_submissions', function (Blueprint $table) {
            $table->string('city', 120)->nullable()->after('phone');
            $table->string('linkedin_url', 500)->nullable()->after('city');
            $table->string('portfolio_url', 500)->nullable()->after('linkedin_url');
            $table->text('cover_letter')->nullable()->after('message');
            $table->text('admin_notes')->nullable()->after('cover_letter');
            $table->timestamp('submission_date')->nullable()->after('consent_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('general_cv_submissions', function (Blueprint $table) { $table->dropColumn(['city', 'linkedin_url', 'portfolio_url', 'cover_letter', 'admin_notes', 'submission_date']); });
        Schema::table('internship_applications', function (Blueprint $table) { $table->dropForeign(['assigned_to']); $table->dropColumn(['city', 'linkedin_url', 'portfolio_url', 'cover_letter', 'admin_notes', 'assigned_to', 'submission_date']); });
        Schema::table('job_applications', function (Blueprint $table) { $table->dropColumn(['city', 'linkedin_url', 'portfolio_url', 'admin_notes', 'submission_date']); });
    }
};
