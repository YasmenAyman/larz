<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_inquiries', function (Blueprint $table) {
            $table->string('source_url', 2000)->nullable()->after('source');
        });
        Schema::table('project_inquiries', function (Blueprint $table) {
            $table->string('source_url', 2000)->nullable()->after('source');
        });
        Schema::table('brochure_requests', function (Blueprint $table) {
            $table->string('source_url', 2000)->nullable()->after('source');
        });
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->string('source_url', 2000)->nullable()->after('source');
        });
        Schema::table('job_applications', function (Blueprint $table) {
            $table->string('source_url', 2000)->nullable()->after('consent_at');
        });
        Schema::table('internship_applications', function (Blueprint $table) {
            $table->string('source_url', 2000)->nullable()->after('consent_at');
        });
        Schema::table('general_cv_submissions', function (Blueprint $table) {
            $table->string('source_url', 2000)->nullable()->after('consent_at');
        });
    }

    public function down(): void
    {
        foreach ([
            'general_cv_submissions',
            'internship_applications',
            'job_applications',
            'newsletter_subscribers',
            'brochure_requests',
            'project_inquiries',
            'contact_inquiries',
        ] as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->dropColumn('source_url');
            });
        }
    }
};