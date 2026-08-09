<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seo_metadata', function (Blueprint $table) {
            $table->id();
            $table->string('page_key', 180)->unique();
            $table->string('seo_title', 180)->nullable();
            $table->text('meta_description')->nullable();
            $table->string('canonical_url', 500)->nullable();
            $table->string('og_title', 180)->nullable();
            $table->text('og_description')->nullable();
            $table->foreignId('og_image_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->boolean('indexable')->default(true);
            $table->boolean('followable')->default(true);
            $table->timestamps();
        });

        foreach ([
            ['seo.default_title', 'LARZ Developments | Designed for the Way You Live'],
            ['seo.default_description', 'LARZ Developments builds considered communities, homes and destinations for the way you live.'],
            ['seo.default_og_title', 'LARZ Developments'],
            ['seo.default_og_description', 'Considered communities and places to live by LARZ Developments.'],
            ['seo.default_og_image', 'assets/herobg.png'],
            ['seo.default_robots', 'index, follow'],
        ] as [$key, $value]) {
            DB::table('site_settings')->updateOrInsert(['key' => $key], ['value' => $value, 'value_type' => 'string', 'group_name' => 'seo']);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('seo_metadata');
        DB::table('site_settings')->whereIn('key', ['seo.default_title', 'seo.default_description', 'seo.default_og_title', 'seo.default_og_description', 'seo.default_og_image', 'seo.default_robots'])->delete();
    }
};
