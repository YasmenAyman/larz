<?php

namespace Tests\Feature;

use App\Models\PageSection;
use App\Models\MediaAsset;
use App\Models\PhotoGalleryItem;
use App\Models\Project;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class AdminPageNavigationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    private function pageEditor(): User
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $user->givePermissionTo([
            Permission::findByName('dashboard.view', 'web'),
            Permission::findByName('pages.view', 'web'),
            Permission::findByName('pages.update', 'web'),
        ]);

        return $user;
    }

    public function test_page_overview_and_nested_section_routes_are_directly_accessible(): void
    {
        $user = $this->pageEditor();

        $this->actingAs($user)->get('/admin/pages/home')
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page->component('Admin/Pages/Overview')->where('label', 'Home Page')->has('sections', 6));

        $this->actingAs($user)->get('/admin/pages/home/hero')
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page->component('Admin/Content/Editor')->where('page', 'home')->where('section', 'hero'));

        $this->actingAs($user)->get('/admin/pages/about/story')
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page->component('Admin/Pages/AboutStory'));
    }

    public function test_nested_section_update_persists_structured_content(): void
    {
        $user = $this->pageEditor();

        $this->actingAs($user)->put('/admin/pages/home/hero', [
            'sections' => ['hero' => ['heading' => 'A controlled heading', 'description' => 'A controlled description.']],
        ])->assertRedirect();

        $this->assertDatabaseHas('page_sections', [
            'page_key' => 'home',
            'section_key' => 'hero',
            'status' => 'published',
        ]);
    }

    public function test_home_statistics_persist_four_value_and_label_pairs(): void
    {
        $user = $this->pageEditor();
        $items = [
            ['value' => '40+', 'label' => 'Experience'], ['value' => '60+', 'label' => 'Projects'],
            ['value' => '15k', 'label' => 'Clients'], ['value' => '2', 'label' => 'Countries'],
        ];

        $this->actingAs($user)->put('/admin/pages/home/stats', [
            'sections' => ['stats' => ['items' => $items]],
        ])->assertRedirect();

        $section = PageSection::query()->where('page_key', 'home')->where('section_key', 'stats')->firstOrFail();
        $this->assertSame($items, $section->content_snapshot['items']);
    }

    public function test_home_gallery_editor_manages_settings_and_images(): void
    {
        Storage::fake('public');
        $user = $this->pageEditor();
        $asset = MediaAsset::factory()->create(['disk' => 'public', 'path' => 'seed/gallery.jpg']);
        $item = PhotoGalleryItem::create(['media_asset_id' => $asset->id, 'sort_order' => 0, 'is_published' => true, 'is_active' => true]);

        $this->actingAs($user)->get('/admin/pages/home/gallery')
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page->component('Admin/Pages/HomeGallery'));

        $this->actingAs($user)->put('/admin/pages/home/gallery', [
            'eyebrow' => 'Dynamic Gallery',
            'heading' => 'Dynamic heading',
            'description' => 'Dynamic description',
            'cta_label' => 'Explore',
            'cta_url' => '/projects',
            'gallery_ids' => [$item->id],
            'images' => [UploadedFile::fake()->image('new-gallery.jpg')],
        ])->assertRedirect();

        $this->assertDatabaseHas('page_sections', ['page_key' => 'home', 'section_key' => 'gallery']);
        $this->assertSame(2, PhotoGalleryItem::query()->count());

        $this->get('/')->assertSuccessful()->assertInertia(fn ($page) => $page->where('gallerySettings.heading', 'Dynamic heading'));
    }

    public function test_home_gallery_multipart_post_persists_localized_copy_and_image(): void
    {
        Storage::fake('public');
        $user = $this->pageEditor();

        $this->actingAs($user)->post('/admin/pages/home/gallery', [
            '_method' => 'PUT',
            'translations' => [
                'en' => ['eyebrow' => 'Gallery', 'heading' => 'English heading', 'description' => 'English copy', 'cta_label' => 'Explore', 'cta_url' => '/projects'],
                'ar' => ['eyebrow' => 'المعرض', 'heading' => 'عنوان عربي', 'description' => 'وصف عربي', 'cta_label' => 'استكشف', 'cta_url' => '/projects'],
            ],
            'gallery_ids' => [],
            'images' => [UploadedFile::fake()->image('gallery-upload.jpg')],
        ])->assertRedirect();

        $section = PageSection::query()->where('page_key', 'home')->where('section_key', 'gallery')->firstOrFail();
        $this->assertSame('English heading', $section->content_snapshot['translations']['en']['heading']);
        $this->assertSame('عنوان عربي', $section->content_snapshot['translations']['ar']['heading']);
        $this->assertSame(1, PhotoGalleryItem::query()->count());
        $this->assertNotNull(PhotoGalleryItem::first()->media_asset_id);
    }

    public function test_media_gallery_multipart_post_uploads_and_removes_photos(): void
    {
        Storage::fake('public');
        $user = $this->pageEditor();
        $asset = MediaAsset::factory()->create(['disk' => 'public', 'path' => 'seed/gallery.jpg']);
        $item = PhotoGalleryItem::create(['media_asset_id' => $asset->id, 'sort_order' => 0, 'is_published' => true, 'is_active' => true]);

        $this->actingAs($user)->post('/admin/pages/media/gallery', [
            '_method' => 'PUT',
            'translations' => [
                'en' => ['eyebrow' => 'Gallery', 'heading' => 'English heading', 'description' => 'English copy'],
                'ar' => ['eyebrow' => 'المعرض', 'heading' => 'عنوان عربي', 'description' => 'وصف عربي'],
            ],
            'gallery_ids' => [$item->id],
            'remove_ids' => [$item->id],
            'images' => [UploadedFile::fake()->image('gallery-upload.jpg')],
        ])->assertRedirect();

        $this->assertSoftDeleted('photo_gallery_items', ['id' => $item->id]);
        $this->assertSame(1, PhotoGalleryItem::query()->count());
        $this->assertSame('English heading', PageSection::query()->where('page_key', 'media')->where('section_key', 'gallery')->firstOrFail()->content_snapshot['translations']['en']['heading']);
    }

    public function test_media_gallery_photo_can_be_deleted_without_saving_the_section(): void
    {
        Storage::fake('public');
        $user = $this->pageEditor();
        $asset = MediaAsset::factory()->create(['disk' => 'public', 'path' => 'media/gallery/photo.jpg']);
        $item = PhotoGalleryItem::create(['media_asset_id' => $asset->id, 'sort_order' => 0, 'is_published' => true, 'is_active' => true]);

        $this->actingAs($user)
            ->delete("/admin/pages/media/gallery/{$item->id}")
            ->assertRedirect();

        $this->assertSoftDeleted('photo_gallery_items', ['id' => $item->id]);
        $this->assertDatabaseMissing('media_assets', ['id' => $asset->id]);
    }

    public function test_home_featured_projects_editor_selects_and_orders_projects(): void
    {
        $user = $this->pageEditor();
        $first = Project::create(['title' => 'First Project', 'slug' => 'first-project', 'location' => 'Cairo', 'is_published' => true]);
        $second = Project::create(['title' => 'Second Project', 'slug' => 'second-project', 'location' => 'Cairo', 'is_published' => true]);

        $this->actingAs($user)->get('/admin/pages/home/featured-projects')->assertSuccessful()->assertInertia(fn ($page) => $page->component('Admin/Pages/HomeFeaturedProjects'));
        $this->actingAs($user)->put('/admin/pages/home/featured-projects', [
            'eyebrow' => 'Featured',
            'heading' => 'Selected developments',
            'description' => 'Selected description',
            'cta_label' => 'Explore',
            'cta_url' => '/projects',
            'project_ids' => [$second->id, $first->id],
        ])->assertRedirect();

        $section = PageSection::query()->where('page_key', 'home')->where('section_key', 'featured_projects')->firstOrFail();
        $this->assertSame([$second->id, $first->id], $section->content_snapshot['project_ids']);
        $this->get('/')->assertSuccessful()->assertInertia(fn ($page) => $page->where('featuredProjectsSettings.heading', 'Selected developments')->where('projects.0.title', 'Second Project'));
    }

    public function test_media_page_news_and_stories_sections_propagate_to_public_page(): void
    {
        $user = $this->pageEditor();

        $this->actingAs($user)->get('/admin/pages/media')->assertSuccessful()->assertInertia(fn ($page) => $page->component('Admin/Pages/Overview')->where('label', 'Media Page')->has('sections', 5));
        $this->actingAs($user)->get('/admin/pages/media/news')->assertSuccessful()->assertInertia(fn ($page) => $page->component('Admin/Pages/MediaNews'));

        $this->actingAs($user)->put('/admin/pages/media/news', [
            'sections' => ['news' => ['eyebrow' => 'Latest news', 'heading' => 'New from LARZ', 'description' => 'Dynamic news copy.']],
        ])->assertRedirect();

        $this->actingAs($user)->put('/admin/pages/media/stories', [
            'sections' => ['stories' => ['eyebrow' => 'Stories', 'heading' => 'Voices from LARZ', 'description' => 'Dynamic stories copy.']],
        ])->assertRedirect();

        $this->get('/media')->assertSuccessful()->assertInertia(fn ($page) => $page
            ->where('newsSettings.heading', 'New from LARZ')
            ->where('newsSettings.eyebrow', 'Latest news')
            ->where('storiesSettings.heading', 'Voices from LARZ')
        );
    }

    public function test_page_editor_without_pages_permission_is_forbidden(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $user->givePermissionTo(Permission::findByName('dashboard.view', 'web'));

        $this->actingAs($user)->get('/admin/pages/home')->assertForbidden();
        $this->actingAs($user)->get('/admin/pages/home/hero')->assertForbidden();
        $this->actingAs($user)->put('/admin/pages/home/hero', ['sections' => ['hero' => ['heading' => 'Blocked']]])->assertForbidden();
    }
}
