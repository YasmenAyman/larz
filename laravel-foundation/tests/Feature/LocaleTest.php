<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

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
}
