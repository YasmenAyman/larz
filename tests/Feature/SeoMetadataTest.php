<?php

namespace Tests\Feature;

use App\Models\MediaPost;
use App\Models\Project;
use App\Models\SeoMetadata;
use App\Services\SeoMetadataService;
use App\Models\User;
use Database\Seeders\ArabicSeoMetadataSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class SeoMetadataTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(SiteSettingsSeeder::class);
    }

    public function test_home_metadata_uses_page_override_and_default_og_values(): void
    {
        SeoMetadata::create([
            'page_key' => 'home',
            'seo_title' => 'Custom Home Title',
            'meta_description' => 'Custom home description.',
            'canonical_url' => 'https://example.test/home',
            'og_title' => 'Custom Home Share Title',
            'indexable' => true,
            'followable' => false,
        ]);

        $this->get('/')->assertSuccessful()->assertInertia(fn ($page) => $page
            ->component('Website/Home/Index')
            ->where('seo.title', 'Custom Home Title')
            ->where('seo.description', 'Custom home description.')
            ->where('seo.canonical', 'https://example.test/home')
            ->where('seo.og_title', 'Custom Home Share Title')
            ->where('seo.robots', 'index, nofollow')
        );
    }

    public function test_arabic_seo_metadata_is_resolved_for_the_active_locale(): void
    {
        SeoMetadata::create([
            'page_key' => 'about',
            'seo_title' => 'About LARZ',
            'meta_description' => 'Learn about LARZ.',
            'og_title' => 'About LARZ',
            'og_description' => 'Learn about LARZ.',
            'translations' => [
                'ar' => [
                    'seo_title' => 'من نحن | لارز',
                    'meta_description' => 'تعرّف على لارز للتطوير العقاري.',
                    'og_title' => 'من نحن | لارز',
                    'og_description' => 'تعرّف على لارز للتطوير العقاري.',
                ],
            ],
        ]);

        $this->withSession(['locale' => 'ar'])->get('/about-us')->assertSuccessful()->assertInertia(fn ($page) => $page
            ->where('seo.title', 'من نحن | لارز')
            ->where('seo.description', 'تعرّف على لارز للتطوير العقاري.')
            ->where('seo.og_title', 'من نحن | لارز')
        );
    }

    public function test_arabic_seo_metadata_seeder_populates_static_pages(): void
    {
        $this->seed(ArabicSeoMetadataSeeder::class);

        $this->assertDatabaseHas('seo_metadata', ['page_key' => 'home']);
        $this->assertSame('لارز للتطوير العقاري | مصمم ليناسب أسلوب حياتك', SeoMetadata::query()->where('page_key', 'home')->firstOrFail()->translations['ar']['seo_title']);
    }

    public function test_media_article_metadata_contains_article_and_breadcrumb_schema(): void
    {
        $post = MediaPost::create([
            'type' => 'blog',
            'title' => 'A Published Story',
            'slug' => 'published-story',
            'excerpt' => 'A useful story.',
            'content' => 'Story body.',
            'is_published' => true,
            'published_at' => now(),
        ]);

        $this->get('/media/published-story')->assertSuccessful()->assertInertia(fn ($page) => $page
            ->component('Website/Media/Show')
            ->where('seo.title', 'A Published Story | LARZ Developments')
            ->has('seo.structured_data', 2)
            ->where('seo.structured_data.0.@type', 'BreadcrumbList')
            ->where('seo.structured_data.1.@type', 'Article')
        );
    }

    public function test_unpublished_media_post_is_not_public_or_in_sitemap(): void
    {
        MediaPost::create([
            'type' => 'blog',
            'title' => 'Unpublished Story',
            'slug' => 'unpublished-story',
            'is_published' => false,
        ]);

        $this->get('/media/unpublished-story')->assertNotFound();
        $this->get('/sitemap.xml')->assertOk()->assertDontSee('unpublished-story');
    }

    public function test_published_project_is_in_sitemap_but_unpublished_project_is_not(): void
    {
        Project::create(['title' => 'Published Project', 'slug' => 'published-project', 'location' => 'Cairo', 'is_published' => true]);
        Project::create(['title' => 'Hidden Project', 'slug' => 'hidden-project', 'location' => 'Cairo', 'is_published' => false]);

        $this->get('/projects/hidden-project')->assertNotFound();
        $this->get('/sitemap.xml')->assertOk()->assertSee('published-project')->assertDontSee('hidden-project');
    }

    public function test_robots_and_canonical_metadata_are_public(): void
    {
        $this->get('/robots.txt')->assertOk()->assertSee('Sitemap: '.url('/sitemap.xml'))->assertSee('Disallow: /admin');
        $this->get('/contact-us')->assertSuccessful()->assertInertia(fn ($page) => $page
            ->where('seo.canonical', url('/contact-us'))
            ->where('seo.robots', 'index, follow')
        );
    }

    public function test_project_schema_is_only_emitted_for_residential_projects(): void
    {
        $service = app(SeoMetadataService::class);
        $residential = Project::create(['title' => 'Residential', 'slug' => 'residential', 'project_type' => 'Residential', 'is_published' => true]);
        $commercial = Project::create(['title' => 'Commercial', 'slug' => 'commercial', 'project_type' => 'Commercial', 'is_published' => true]);

        $this->assertSame('Residence', $service->projectSchema($residential, url('/projects/residential'))['@type']);
        $this->assertNull($service->projectSchema($commercial, url('/projects/commercial')));
    }

    public function test_seo_metadata_can_be_updated_from_the_protected_editor(): void
    {
        $this->seed(RolePermissionSeeder::class);
        $user = User::factory()->create(['email_verified_at' => now()]);
        $user->givePermissionTo([
            Permission::findByName('dashboard.view', 'web'),
            Permission::findByName('seo.update', 'web'),
        ]);

        $this->actingAs($user)->put('/admin/seo/page-home', [
            'seo_title' => 'Editable SEO title',
            'meta_description' => 'Editable SEO description.',
            'canonical_url' => 'https://example.test/',
            'og_title' => 'Editable share title',
            'og_description' => 'Editable share description.',
            'indexable' => true,
            'followable' => false,
            'translations' => [
                'en' => [
                    'seo_title' => 'Editable SEO title',
                    'meta_description' => 'Editable SEO description.',
                    'og_title' => 'Editable share title',
                    'og_description' => 'Editable share description.',
                ],
                'ar' => [
                    'seo_title' => 'عنوان SEO قابل للتعديل',
                    'meta_description' => 'وصف SEO قابل للتعديل.',
                    'og_title' => 'عنوان مشاركة قابل للتعديل',
                    'og_description' => 'وصف مشاركة قابل للتعديل.',
                ],
            ],
        ])->assertRedirect();

        $this->assertDatabaseHas('seo_metadata', [
            'page_key' => 'home',
            'seo_title' => 'Editable SEO title',
            'canonical_url' => 'https://example.test/',
            'followable' => false,
        ]);

        $this->get('/')->assertSuccessful()->assertInertia(fn ($page) => $page
            ->where('seo.title', 'Editable SEO title')
        );

        $this->withSession(['locale' => 'ar'])->get('/')->assertSuccessful()->assertInertia(fn ($page) => $page
            ->where('seo.title', 'عنوان SEO قابل للتعديل')
        );
    }
}
