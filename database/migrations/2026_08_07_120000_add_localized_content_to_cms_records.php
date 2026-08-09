<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table): void {
            $table->json('translations')->nullable()->after('robots');
        });

        Schema::table('media_posts', function (Blueprint $table): void {
            $table->json('translations')->nullable()->after('robots');
        });
    }

    public function down(): void
    {
        Schema::table('projects', fn (Blueprint $table) => $table->dropColumn('translations'));
        Schema::table('media_posts', fn (Blueprint $table) => $table->dropColumn('translations'));
    }
};
