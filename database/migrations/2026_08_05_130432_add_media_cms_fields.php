<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('media_posts', function (Blueprint $table) {
            $table->unsignedSmallInteger('sort_order')->default(0)->after('is_published');
            $table->foreignId('open_graph_image_id')->nullable()->after('featured_image_id')->constrained('media_assets')->nullOnDelete();
            $table->index(['is_published', 'sort_order']);
        });
        Schema::table('photo_gallery_items', function (Blueprint $table) {
            $table->string('location', 180)->nullable()->after('caption');
            $table->date('event_date')->nullable()->after('location');
            $table->boolean('is_active')->default(true)->after('is_published');
            $table->index(['is_active', 'sort_order']);
        });
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->timestamp('subscribed_at')->nullable()->after('consent_at');
            $table->index('subscribed_at');
        });
    }

    public function down(): void
    {
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->dropIndex(['subscribed_at']);
            $table->dropColumn('subscribed_at');
        });
        Schema::table('photo_gallery_items', function (Blueprint $table) {
            $table->dropIndex(['is_active', 'sort_order']);
            $table->dropColumn(['location', 'event_date', 'is_active']);
        });
        Schema::table('media_posts', function (Blueprint $table) {
            $table->dropForeign(['open_graph_image_id']);
            $table->dropIndex(['is_published', 'sort_order']);
            $table->dropColumn(['sort_order', 'open_graph_image_id']);
        });
    }
};
