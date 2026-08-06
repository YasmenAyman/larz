<?php

namespace Tests\Feature;

use App\Models\MediaCategory;
use App\Models\MediaPost;
use App\Models\NewsletterSubscriber;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class MediaCmsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    private function mediaUser(): User
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $user->givePermissionTo([
            Permission::findByName('dashboard.view', 'web'),
            Permission::findByName('media.view', 'web'),
            Permission::findByName('media.create', 'web'),
            Permission::findByName('media.update', 'web'),
            Permission::findByName('media.delete', 'web'),
            Permission::findByName('newsletter.view', 'web'),
            Permission::findByName('newsletter.update', 'web'),
        ]);
        return $user;
    }

    public function test_media_post_can_be_created_and_updated_with_an_image(): void
    {
        Storage::fake('public');
        $user = $this->mediaUser();
        $category = MediaCategory::create(['name' => 'Blog', 'slug' => 'blog', 'type' => 'blog']);

        $response = $this->actingAs($user)->withSession(['_token' => 'test'])->post('/admin/media/posts', [
            'type' => 'blog', 'media_category_id' => $category->id, 'title' => 'CMS post', 'slug' => 'cms-post',
            'excerpt' => 'Excerpt', 'content' => 'Content', 'featured_image' => UploadedFile::fake()->image('post.jpg'),
            'is_published' => true, 'is_featured' => false, 'sort_order' => 1,
            '_token' => 'test',
        ]);

        $response->assertRedirect('/admin/media/posts');
        $post = MediaPost::where('slug', 'cms-post')->firstOrFail();
        $this->assertNotNull($post->featured_image_id);

        $this->actingAs($user)->withSession(['_token' => 'test'])->put("/admin/media/posts/{$post->id}", [
            'type' => 'press', 'media_category_id' => $category->id, 'title' => 'Updated post', 'slug' => 'cms-post',
            'excerpt' => 'Updated excerpt', 'content' => 'Updated content', 'is_published' => false, 'is_featured' => true, 'sort_order' => 2,
            '_token' => 'test',
        ])->assertRedirect();

        $this->assertSame('Updated post', $post->fresh()->title);
        $this->assertFalse($post->fresh()->is_published);
        $this->assertTrue($post->fresh()->is_featured);
    }

    public function test_media_post_slug_must_be_unique(): void
    {
        $user = $this->mediaUser();
        MediaPost::factory()->create(['slug' => 'duplicate-slug']);

        $this->actingAs($user)->withSession(['_token' => 'test'])->post('/admin/media/posts', [
            'type' => 'blog', 'title' => 'Duplicate', 'slug' => 'duplicate-slug', 'is_published' => false, '_token' => 'test',
        ])->assertSessionHasErrors('slug');
    }

    public function test_media_post_lifecycle_and_super_admin_force_delete(): void
    {
        $user = $this->mediaUser();
        $post = MediaPost::factory()->create(['is_published' => false, 'is_featured' => false]);

        $this->actingAs($user)->withSession(['_token' => 'test'])->post("/admin/media/posts/{$post->id}/publish", ['_token' => 'test'])->assertRedirect();
        $this->assertTrue($post->fresh()->is_published);
        $this->actingAs($user)->withSession(['_token' => 'test'])->post("/admin/media/posts/{$post->id}/feature", ['_token' => 'test'])->assertRedirect();
        $this->assertTrue($post->fresh()->is_featured);
        $this->actingAs($user)->withSession(['_token' => 'test'])->delete("/admin/media/posts/{$post->id}", ['_token' => 'test'])->assertRedirect();
        $this->assertSoftDeleted($post);
        $this->actingAs($user)->withSession(['_token' => 'test'])->post("/admin/media/posts/{$post->id}/restore", ['_token' => 'test'])->assertRedirect();
        $this->assertNotSoftDeleted($post->fresh());
    }

    public function test_user_without_media_permission_is_forbidden(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $this->actingAs($user)->get('/admin/media/posts')->assertForbidden();
    }

    public function test_newsletter_status_can_be_updated_and_exported(): void
    {
        $user = $this->mediaUser();
        $subscriber = NewsletterSubscriber::create(['email' => 'subscriber@example.test', 'status' => 'active', 'subscribed_at' => now()]);
        $this->actingAs($user)->withSession(['_token' => 'test'])->put("/admin/newsletter-subscribers/{$subscriber->id}", ['status' => 'unsubscribed', '_token' => 'test'])->assertRedirect();
        $this->assertSame('unsubscribed', $subscriber->fresh()->status);
        $this->actingAs($user)->get('/admin/newsletter-subscribers/export')->assertOk()->assertHeader('content-type', 'text/csv; charset=UTF-8');
    }
}
