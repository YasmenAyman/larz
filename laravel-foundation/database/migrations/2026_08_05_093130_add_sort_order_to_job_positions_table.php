<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_positions', function (Blueprint $table) {
            $table->unsignedSmallInteger('sort_order')->default(0)->after('is_featured');
            $table->index(['is_published', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::table('job_positions', function (Blueprint $table) {
            $table->dropIndex(['is_published', 'sort_order']);
            $table->dropColumn('sort_order');
        });
    }
};
