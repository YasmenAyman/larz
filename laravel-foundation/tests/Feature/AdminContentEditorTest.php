<?php

namespace Tests\Feature;

use App\Models\NavigationItem;
use App\Models\PageSection;
use App\Models\SiteSetting;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;
use App\Models\User;

class AdminContentEditorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_user_with_page_permission_can_update_typed_sections(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $user->givePermissionTo(Permission::findByName('pages.update', 'web'));
        $user->givePermissionTo(Permission::findByName('dashboard.view', 'web'));

        $response = $this->actingAs($user)->put('/admin/content/home', [
            'sections' => [
                'hero' => [
                    'heading' => 'Updated heading',
                    'description' => 'Updated description',
                    'cta_label' => 'Explore',
                    'cta_url' => '/projects',
                ],
            ],
        ]);
        $response->assertStatus(302);

        $this->assertSame('Updated heading', PageSection::where('page_key', 'home')->where('section_key', 'hero')->firstOrFail()->content_snapshot['heading']);
    }

    public function test_user_without_page_permission_cannot_update_content(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);

        $this->actingAs($user)->put('/admin/content/home', ['sections' => ['hero' => ['heading' => 'Blocked']]])->assertForbidden();
    }

    public function test_settings_and_navigation_updates_are_authorized_and_persisted(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $user->givePermissionTo(Permission::findByName('settings.update', 'web'));
        $user->givePermissionTo(Permission::findByName('navigation.update', 'web'));
        $user->givePermissionTo(Permission::findByName('dashboard.view', 'web'));
        SiteSetting::create(['key' => 'contact.phone', 'value' => '15813', 'value_type' => 'string', 'group_name' => 'contact']);
        $item = NavigationItem::create(['label' => 'Home', 'url' => '/', 'location' => 'header', 'sort_order' => 1]);

        $settingsResponse = $this->actingAs($user)->put('/admin/settings', ['settings' => ['contact.phone' => '16000']]);
        $settingsResponse->assertStatus(302);
        $navigationResponse = $this->actingAs($user)->put('/admin/navigation', ['items' => [['id' => $item->id, 'label' => 'Start', 'url' => '/', 'location' => 'header', 'sort_order' => 2, 'is_active' => true]]]);
        $navigationResponse->assertStatus(302);

        $this->assertSame('16000', SiteSetting::where('key', 'contact.phone')->value('value'));
        $this->assertSame('Start', $item->fresh()->label);
        $this->assertSame(2, $item->fresh()->sort_order);
    }
}
