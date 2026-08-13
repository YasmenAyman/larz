<?php

namespace Database\Seeders;

use App\Models\SeoMetadata;
use Illuminate\Database\Seeder;

class ArabicSeoMetadataSeeder extends Seeder
{
    /** Populate Arabic SEO copy for the static public pages. */
    public function run(): void
    {
        $metadata = [
            'home' => [
                'seo_title' => 'لارز للتطوير العقاري | مصمم ليناسب أسلوب حياتك',
                'meta_description' => 'تطور لارز مجتمعات ومنازل ووجهات مدروسة بعناية تناسب أسلوب حياتك.',
                'og_title' => 'لارز للتطوير العقاري',
                'og_description' => 'مجتمعات ومنازل ووجهات مدروسة بعناية من لارز للتطوير العقاري.',
            ],
            'about' => [
                'seo_title' => 'من نحن | لارز للتطوير العقاري',
                'meta_description' => 'تعرّف على لارز للتطوير العقاري ورؤيتنا لبناء مجتمعات مدروسة بعناية تدوم قيمتها.',
                'og_title' => 'من نحن | لارز للتطوير العقاري',
                'og_description' => 'نبني مجتمعات مدروسة بعناية لتناسب أسلوب الحياة اليوم وللمستقبل.',
            ],
            'projects' => [
                'seo_title' => 'مشروعاتنا | لارز للتطوير العقاري',
                'meta_description' => 'اكتشف مشروعات لارز السكنية والتجارية المصممة بعناية في القاهرة الجديدة.',
                'og_title' => 'مشروعات لارز',
                'og_description' => 'مشروعات سكنية وتجارية مدروسة بعناية من لارز للتطوير العقاري.',
            ],
            'media' => [
                'seo_title' => 'إعلام لارز | لارز للتطوير العقاري',
                'meta_description' => 'تابع أحدث أخبار وبيانات ومدونات لارز للتطوير العقاري.',
                'og_title' => 'إعلام لارز',
                'og_description' => 'أحدث أخبار وقصص ورؤى لارز للتطوير العقاري.',
            ],
            'careers' => [
                'seo_title' => 'وظائف في لارز | لارز للتطوير العقاري',
                'meta_description' => 'انضم إلى فريق لارز للتطوير العقاري واكتشف فرص العمل والتدريب المتاحة.',
                'og_title' => 'وظائف في لارز',
                'og_description' => 'ابنِ مستقبلك المهني مع فريق لارز للتطوير العقاري.',
            ],
            'contact' => [
                'seo_title' => 'تواصل معنا | لارز للتطوير العقاري',
                'meta_description' => 'تواصل مع فريق لارز للتطوير العقاري للاستفسار عن مشروعاتنا أو طلب زيارة.',
                'og_title' => 'تواصل مع لارز',
                'og_description' => 'تواصل مع فريق لارز للتطوير العقاري.',
            ],
        ];

        foreach ($metadata as $pageKey => $arabic) {
            $record = SeoMetadata::query()->firstOrNew(['page_key' => $pageKey]);
            $record->translations = array_replace($record->translations ?? [], ['ar' => $arabic]);
            $record->save();
        }
    }
}