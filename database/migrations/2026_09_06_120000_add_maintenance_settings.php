<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $settings = [
            ['key' => 'maintenance.enabled', 'value' => '0', 'value_type' => 'boolean', 'group_name' => 'maintenance', 'description' => 'Enable maintenance mode.'],
            ['key' => 'maintenance.title_en', 'value' => 'We’ll be back soon.', 'value_type' => 'string', 'group_name' => 'maintenance', 'description' => 'Maintenance page title (English).'],
            ['key' => 'maintenance.message_en', 'value' => 'We are making a few improvements to serve you better. Please check back shortly.', 'value_type' => 'string', 'group_name' => 'maintenance', 'description' => 'Maintenance page message (English).'],
            ['key' => 'maintenance.title_ar', 'value' => 'سنعود قريبًا.', 'value_type' => 'string', 'group_name' => 'maintenance', 'description' => 'Maintenance page title (Arabic).'],
            ['key' => 'maintenance.message_ar', 'value' => 'نعمل على بعض التحسينات لنقدم لك تجربة أفضل. يرجى العودة بعد قليل.', 'value_type' => 'string', 'group_name' => 'maintenance', 'description' => 'Maintenance page message (Arabic).'],
        ];

        foreach ($settings as $setting) {
            DB::table('site_settings')->updateOrInsert(
                ['key' => $setting['key']],
                [...$setting, 'created_at' => $now, 'updated_at' => $now],
            );
        }
    }

    public function down(): void
    {
        DB::table('site_settings')->where('group_name', 'maintenance')->delete();
    }
};
