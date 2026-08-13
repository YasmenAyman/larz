<?php

namespace Tests\Feature;

use App\Models\PageSection;
use App\Support\WebsiteCache;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class LocaleTest extends TestCase
{
    use RefreshDatabase;

    public function test_arabic_locale_is_saved_and_shared_with_inertia(): void
    {
        $this->get('/language/ar')->assertRedirect();

        $this->withSession(['locale' => 'ar'])
            ->get('/')
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page->where('locale', 'ar')->where('dir', 'rtl'));
    }

    public function test_invalid_locale_is_rejected(): void
    {
        $this->get('/language/fr')->assertNotFound();
    }

    public function test_contact_location_map_uses_arabic_heading_and_cta_when_arabic_is_active(): void
    {
        PageSection::create([
            'page_key' => 'contact',
            'section_key' => 'location_map',
            'section_type' => 'contact.location_map',
            'status' => 'published',
            'published_at' => now(),
            'content_snapshot' => [
                'translations' => [
                    'en' => [
                        'eyebrow' => 'Location & map',
                        'heading' => 'Find us.',
                        'description' => 'English location description.',
                        'cta_label' => 'Get directions',
                        'cta_url' => '#directions',
                    ],
                    'ar' => [
                        'eyebrow' => 'الموقع والخريطة',
                        'heading' => 'تجدنا.',
                        'description' => 'وصف الموقع باللغة العربية.',
                        'cta_label' => 'احصل على الاتجاهات',
                        'cta_url' => '#directions',
                    ],
                ],
            ],
        ]);

        $this->withSession(['locale' => 'ar'])
            ->get('/contact-us')
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page
                ->component('Website/Contact/Index')
                ->where('location_map.heading', 'تجدنا.')
                ->where('location_map.cta_label', 'احصل على الاتجاهات'));
    }

    public function test_location_map_cache_is_invalidated_when_its_dashboard_content_is_updated(): void
    {
        $section = PageSection::create([
            'page_key' => 'contact',
            'section_key' => 'location_map',
            'section_type' => 'contact.location_map',
            'status' => 'published',
            'published_at' => now(),
            'content_snapshot' => ['translations' => ['en' => ['heading' => 'Find us.']]],
        ]);
        $cacheKey = WebsiteCache::sectionKey('contact', 'location_map').'.'.$section->updated_at->timestamp;
        Cache::put($cacheKey, $section->content_snapshot, now()->addHour());

        WebsiteCache::section('contact', 'location_map');

        $this->assertFalse(Cache::has($cacheKey));
    }
}
