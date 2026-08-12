<?php

namespace Tests\Feature;

use App\Models\MediaAsset;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use App\Models\MediaPost;
use App\Services\MediaUploadService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class MediaUploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    private MediaUploadService $uploads;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
        Storage::fake('local');
        $this->uploads = app(MediaUploadService::class);
    }

    public function test_valid_public_image_upload_uses_a_unique_safe_storage_path(): void
    {
        $first = $this->uploads->storePublicImage(UploadedFile::fake()->image('hero.jpg', 320, 180), 'media/posts');
        $second = $this->uploads->storePublicImage(UploadedFile::fake()->image('hero.jpg', 320, 180), 'media/posts');

        $this->assertNotSame($first->path, $second->path);
        $this->assertMatchesRegularExpression('/^media\/posts\/[a-f0-9-]+\.webp$/', $first->path);
        $this->assertSame('image/webp', $first->mime_type);
        $this->assertSame(320, $first->width);
        $this->assertSame(180, $first->height);
        Storage::disk('public')->assertExists($first->path);
        Storage::disk('public')->assertExists($second->path);
    }

    public function test_invalid_mime_and_extension_are_rejected(): void
    {
        $this->expectException(InvalidArgumentException::class);

        $this->uploads->storePublicImage(
            UploadedFile::fake()->create('payload.php', 20, 'text/x-php'),
            'media/posts',
        );
    }

    public function test_oversized_brochure_is_rejected(): void
    {
        $this->expectException(InvalidArgumentException::class);

        $this->uploads->storePublicBrochure(
            UploadedFile::fake()->create('brochure.pdf', 21 * 1024, 'application/pdf'),
        );
    }

    public function test_path_traversal_directory_is_rejected(): void
    {
        $this->expectException(InvalidArgumentException::class);

        $this->uploads->storePublicImage(
            UploadedFile::fake()->image('hero.png'),
            '../outside',
        );
    }

    public function test_replacement_deletes_old_unreferenced_asset_after_reference_update(): void
    {
        $old = $this->uploads->storePublicImage(UploadedFile::fake()->image('old.png', 100, 100), 'media/gallery');
        $post = MediaPost::create([
            'type' => 'blog',
            'title' => 'Replacement test',
            'slug' => 'replacement-test',
            'featured_image_id' => $old->id,
        ]);

        $new = $this->uploads->replace(
            $old,
            UploadedFile::fake()->image('new.webp', 240, 120),
            'media/gallery',
            'public_image',
            fn (MediaAsset $asset) => $post->update(['featured_image_id' => $asset->id]),
        );

        $this->assertSame($new->id, $post->fresh()->featured_image_id);
        $this->assertSoftDeleted('media_assets', ['id' => $old->id]);
        Storage::disk('public')->assertMissing($old->path);
        Storage::disk('public')->assertExists($new->path);
    }

    public function test_referenced_asset_is_not_deleted_until_all_references_are_removed(): void
    {
        $asset = $this->uploads->storePublicImage(UploadedFile::fake()->image('shared.png'), 'media/gallery');
        $first = MediaPost::create(['type' => 'blog', 'title' => 'One', 'slug' => 'one', 'featured_image_id' => $asset->id]);
        $second = MediaPost::create(['type' => 'blog', 'title' => 'Two', 'slug' => 'two', 'featured_image_id' => $asset->id]);

        $this->assertFalse($this->uploads->deleteIfUnreferenced($asset));
        Storage::disk('public')->assertExists($asset->path);

        $first->delete();
        $this->assertFalse($this->uploads->deleteIfUnreferenced($asset));
        Storage::disk('public')->assertExists($asset->path);

        $second->delete();
        $this->assertTrue($this->uploads->deleteIfUnreferenced($asset));
        $this->assertSoftDeleted('media_assets', ['id' => $asset->id]);
        Storage::disk('public')->assertMissing($asset->path);
    }

    public function test_private_download_rejects_public_asset(): void
    {
        $asset = $this->uploads->storePublicImage(UploadedFile::fake()->image('public.png'), 'media/gallery');

        $this->expectException(\Symfony\Component\HttpKernel\Exception\NotFoundHttpException::class);
        $this->uploads->downloadPrivate($asset);
    }

    public function test_private_cv_download_requires_the_applications_permission(): void
    {
        $asset = $this->uploads->storePrivateCv(
            UploadedFile::fake()->create('resume.pdf', 100, 'application/pdf'),
        );
        $job = Job::create(['title' => 'Role', 'slug' => 'role', 'department' => 'HR', 'location' => 'Cairo', 'employment_type' => 'Full-time']);
        $application = JobApplication::create(['job_position_id' => $job->id, 'name' => 'Applicant', 'email' => 'applicant@example.test', 'resume_media_id' => $asset->id]);

        $this->get("/admin/job-applications/{$application->id}/cv")->assertRedirect('/login');

        $this->seed(RolePermissionSeeder::class);
        $user = User::factory()->create(['email_verified_at' => now()]);
        $user->givePermissionTo(Permission::findByName('dashboard.view', 'web'));
        $this->actingAs($user)->get("/admin/job-applications/{$application->id}/cv")->assertForbidden();
    }

    public function test_private_cv_upload_and_download_use_local_disk(): void
    {
        $asset = $this->uploads->storePrivateCv(
            UploadedFile::fake()->create('resume.pdf', 100, 'application/pdf'),
        );

        $this->assertSame('local', $asset->disk);
        $this->assertMatchesRegularExpression('/^private\/cvs\/[a-f0-9-]+\.pdf$/', $asset->path);
        Storage::disk('local')->assertExists($asset->path);
        $this->assertInstanceOf(\Symfony\Component\HttpFoundation\StreamedResponse::class, $this->uploads->downloadPrivate($asset));
    }
}
