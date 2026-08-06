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
            ->assertInertia(fn ($page) => $page->component('Admin/Content/Editor')->where('page', 'about')->where('section', 'story'));
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

    public function test_page_editor_without_pages_permission_is_forbidden(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $user->givePermissionTo(Permission::findByName('dashboard.view', 'web'));

        $this->actingAs($user)->get('/admin/pages/home')->assertForbidden();
        $this->actingAs($user)->get('/admin/pages/home/hero')->assertForbidden();
        $this->actingAs($user)->put('/admin/pages/home/hero', ['sections' => ['hero' => ['heading' => 'Blocked']]])->assertForbidden();
    }
}
