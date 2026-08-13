<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SiteSetting;

class SiteSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Baseline content extracted from src/data/site.ts and shared layout components.
        $settings = [
            ['key' => 'brand.name', 'value' => 'LARZ', 'value_type' => 'string', 'group_name' => 'brand'],
            ['key' => 'brand.tagline', 'value' => 'DEVELOPMENTS', 'value_type' => 'string', 'group_name' => 'brand'],
            ['key' => 'brand.logo', 'value' => null, 'value_type' => 'string', 'group_name' => 'brand', 'description' => 'Site logo shown in the header and footer.'],
            ['key' => 'brand.favicon', 'value' => null, 'value_type' => 'string', 'group_name' => 'brand', 'description' => 'Browser tab icon.'],
            ['key' => 'contact.address', 'value' => 'Kov mall, Beside Mivida gate 6, New Cairo 1, End of Road 90 Next to AUC N...', 'value_type' => 'string', 'group_name' => 'contact'],
            ['key' => 'contact.address_ar', 'value' => null, 'value_type' => 'string', 'group_name' => 'contact', 'description' => 'Address (Arabic).'],
            ['key' => 'contact.email', 'value' => 'info@larzdevelopments.com', 'value_type' => 'string', 'group_name' => 'contact'],
            ['key' => 'contact.phone', 'value' => '15813', 'value_type' => 'string', 'group_name' => 'contact'],
            ['key' => 'whatsapp.number', 'value' => '201128775744', 'value_type' => 'string', 'group_name' => 'contact'],
            ['key' => 'whatsapp.message', 'value' => 'Hello LARZ Developments, I would like to inquire about your projects.', 'value_type' => 'string', 'group_name' => 'contact'],
            ['key' => 'footer.cta_title', 'value' => "Let's Build The Future Together", 'value_type' => 'string', 'group_name' => 'footer'],
            ['key' => 'footer.cta_title_ar', 'value' => null, 'value_type' => 'string', 'group_name' => 'footer', 'description' => 'Footer CTA heading (Arabic).'],
            ['key' => 'footer.cta_button', 'value' => 'Get In Touch', 'value_type' => 'string', 'group_name' => 'footer'],
            ['key' => 'footer.cta_button_ar', 'value' => null, 'value_type' => 'string', 'group_name' => 'footer', 'description' => 'Footer CTA button label (Arabic).'],
            ['key' => 'social.facebook', 'value' => '#', 'value_type' => 'string', 'group_name' => 'social'],
            ['key' => 'social.instagram', 'value' => '#', 'value_type' => 'string', 'group_name' => 'social'],
            ['key' => 'social.linkedin', 'value' => '#', 'value_type' => 'string', 'group_name' => 'social'],
            ['key' => 'seo.default_title', 'value' => 'LARZ Developments | Designed for the Way You Live', 'value_type' => 'string', 'group_name' => 'seo'],
            ['key' => 'seo.default_description', 'value' => 'LARZ Developments builds considered communities, homes and destinations for the way you live.', 'value_type' => 'string', 'group_name' => 'seo'],
            ['key' => 'seo.default_og_title', 'value' => 'LARZ Developments', 'value_type' => 'string', 'group_name' => 'seo'],
            ['key' => 'seo.default_og_description', 'value' => 'Considered communities and places to live by LARZ Developments.', 'value_type' => 'string', 'group_name' => 'seo'],
            ['key' => 'seo.default_og_image', 'value' => 'assets/herobg.png', 'value_type' => 'string', 'group_name' => 'seo'],
            ['key' => 'seo.default_robots', 'value' => 'index, follow', 'value_type' => 'string', 'group_name' => 'seo'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
