<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\ProjectStatistic;
use App\Models\ProjectGallery;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjectCmsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    private function projectManager(): User
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $user->givePermissionTo([
            'dashboard.view',
            'projects.view', 'projects.create', 'projects.update', 'projects.delete',
        ]);
        return $user;
    }

    public function test_project_can_be_created_and_updated(): void
    {
        Storage::fake('public');
        $user = $this->projectManager();
        $category = ProjectCategory::create(['name' => 'Residential', 'slug' => 'residential', 'is_active' => true]);

        $response = $this->actingAs($user)->post('/admin/projects', [
            'project_category_id' => $category->id,
            'title' => 'Cairo Heights',
            'slug' => 'cairo-heights',
            'short_description' => 'A new landmark in New Cairo.',
            'location' => 'New Cairo',
            'project_type' => 'residential',
            'status' => 'available',
            'is_published' => true,
            'is_featured' => true,
            'sort_order' => 1,
            'currency' => 'EGP',
            'area_unit' => 'm2',
        ]);

        $response->assertRedirect('/admin/projects');
        $project = Project::where('slug', 'cairo-heights')->firstOrFail();
        $this->assertSame('Cairo Heights', $project->title);
        $this->assertTrue($project->is_published);

        $this->actingAs($user)->put("/admin/projects/{$project->id}", [
            'title' => 'Cairo Heights Updated',
            'slug' => 'cairo-heights',
            'is_published' => false,
        ])->assertRedirect();

        $this->assertSame('Cairo Heights Updated', $project->fresh()->title);
        $this->assertFalse($project->fresh()->is_published);
    }

    public function test_project_can_be_published_and_featured_toggled(): void
    {
        $user = $this->projectManager();
        $project = Project::create(['title' => 'T', 'slug' => 't', 'is_published' => false, 'is_featured' => false]);

        $this->actingAs($user)->post("/admin/projects/{$project->id}/publish")->assertRedirect();
        $this->assertTrue($project->fresh()->is_published);
        $this->assertNotNull($project->fresh()->published_at);

        $this->actingAs($user)->post("/admin/projects/{$project->id}/feature")->assertRedirect();
        $this->assertTrue($project->fresh()->is_featured);
    }

    public function test_project_can_be_soft_deleted_and_restored(): void
    {
        $user = $this->projectManager();
        $project = Project::create(['title' => 'Trashed', 'slug' => 'trashed']);

        $this->actingAs($user)->delete("/admin/projects/{$project->id}")->assertRedirect();
        $this->assertSoftDeleted($project);

        $this->actingAs($user)->post("/admin/projects/{$project->id}/restore")->assertRedirect();
        $this->assertNotSoftDeleted($project->fresh());
    }

    public function test_project_categories_can_be_managed(): void
    {
        $user = $this->projectManager();
        $this->actingAs($user)->post('/admin/project-categories', [
            'name' => 'Commercial',
            'slug' => 'commercial',
            'is_active' => true,
        ])->assertRedirect();

        $category = ProjectCategory::where('slug', 'commercial')->firstOrFail();
        $this->assertSame('Commercial', $category->name);

        $this->actingAs($user)->put("/admin/project-categories/{$category->id}", [
            'name' => 'Commercial Updated',
            'slug' => 'commercial',
            'is_active' => false,
        ])->assertRedirect();

        $this->assertSame('Commercial Updated', $category->fresh()->name);
        $this->assertFalse($category->fresh()->is_active);
    }

    public function test_project_statistics_can_be_added_and_removed(): void
    {
        $user = $this->projectManager();
        $project = Project::create(['title' => 'P', 'slug' => 'p']);
        $this->actingAs($user)->post('/admin/project-statistics', [
            'project_id' => $project->id,
            'value' => '10+',
            'label' => 'Years',
            'is_active' => true,
        ])->assertRedirect();

        $stat = ProjectStatistic::firstOrFail();
        $this->assertSame('10+', $stat->value);

        $this->actingAs($user)->delete("/admin/project-statistics/{$stat->id}")->assertRedirect();
        $this->assertNotNull(ProjectStatistic::withTrashed()->find($stat->id)?->deleted_at);
    }

    public function test_project_gallery_can_be_added_with_image_and_removed(): void
    {
        Storage::fake('public');
        $user = $this->projectManager();
        $project = Project::create(['title' => 'P', 'slug' => 'p']);

        $this->actingAs($user)->post('/admin/project-galleries', [
            'project_id' => $project->id,
            'image' => UploadedFile::fake()->image('gallery.jpg'),
            'alt_text' => 'Gallery photo',
            'sort_order' => 1,
            'is_published' => true,
        ])->assertRedirect();

        $gallery = ProjectGallery::firstOrFail();
        $this->assertNotNull($gallery->media_asset_id);

        $this->actingAs($user)->delete("/admin/project-galleries/{$gallery->id}")->assertRedirect();
        $this->assertNotNull(ProjectGallery::withTrashed()->find($gallery->id)?->deleted_at);
    }

    public function test_admin_projects_route_requires_permission(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $this->actingAs($user)->get('/admin/projects')->assertForbidden();
    }
}
