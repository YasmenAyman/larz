<?php

namespace Tests\Feature;

use App\Models\SiteSetting;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(RolePermissionSeeder::class);
        $user = User::factory()->create(['email_verified_at' => now()]);
        $user->givePermissionTo([
            Permission::findByName('dashboard.view', 'web'),
            Permission::findByName('settings.view', 'web'),
            Permission::findByName('settings.update', 'web'),
        ]);
        $this->actingAs($user);
    }

    public function test_settings_can_be_updated_with_spoofed_method_and_file(): void
    {
        Storage::fake('public');

        $this->post('/admin/settings', [
            '_method' => 'put',
            'settings' => [
                'brand.name' => 'LARZ Developments',
                'contact.address' => 'New address line',
            ],
            'logo' => UploadedFile::fake()->image('logo.png'),
            'favicon' => UploadedFile::fake()->image('favicon.png'),
        ])->assertRedirect();

        $this->assertDatabaseHas('site_settings', ['key' => 'brand.name', 'value' => 'LARZ Developments']);
        $this->assertDatabaseHas('site_settings', ['key' => 'contact.address', 'value' => 'New address line']);

        $logo = SiteSetting::where('key', 'brand.logo')->value('value');
        $favicon = SiteSetting::where('key', 'brand.favicon')->value('value');

        $this->assertNotNull($logo);
        $this->assertNotNull($favicon);
        $this->assertStringContainsString('/storage/', $logo);
        $this->assertStringContainsString('/storage/', $favicon);
        $this->assertNotNull(SiteSetting::where('key', 'brand.name')->value('value'));
    }

    public function test_settings_can_be_updated_via_native_put(): void
    {
        Storage::fake('public');

        $this->put('/admin/settings', [
            'settings' => [
                'brand.name' => 'Via Native Put',
            ],
            'logo' => UploadedFile::fake()->image('logo.png'),
        ])->assertRedirect();

        $this->assertDatabaseHas('site_settings', ['key' => 'brand.name', 'value' => 'Via Native Put']);
        $this->assertNotNull(SiteSetting::where('key', 'brand.logo')->value('value'));
    }
}
