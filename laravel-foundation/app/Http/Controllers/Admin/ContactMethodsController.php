<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAdminContentRequest;
use App\Models\PageSection;
use App\Support\WebsiteCache;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactMethodsController extends Controller
{
    public function edit(): Response
    {
        $section = PageSection::query()->where('page_key', 'contact')->where('section_key', 'contact_methods')->first();
        $snapshot = $section?->content_snapshot ?? [];

        $defaults = [
            'eyebrow' => 'Get in touch',
            'heading' => 'However suits you best.',
            'description' => 'Reach the team through whichever channel works best for you.',
            'items' => [
                ['key' => 'hotline', 'icon' => 'phone', 'title' => 'Hotline', 'value' => '15813', 'note' => 'Sat–Thu, 9am–6pm'],
                ['key' => 'whatsapp', 'icon' => 'message-circle', 'title' => 'WhatsApp', 'value' => '+20 15813', 'note' => 'Fast replies, every day'],
                ['key' => 'email', 'icon' => 'mail', 'title' => 'Email', 'value' => 'info@larzdevelopments.com', 'note' => 'larzdevelopments.com'],
                ['key' => 'sales_office', 'icon' => 'map-pin', 'title' => 'Sales office', 'value' => 'New Cairo', 'note' => '[Full address]'],
            ],
        ];

        $translations = $snapshot['translations'] ?? ['en' => $defaults, 'ar' => []];
        $en = array_replace_recursive($defaults, $translations['en'] ?? []);
        $ar = array_replace_recursive($defaults, $translations['ar'] ?? []);

        return Inertia::render('Admin/Pages/ContactMethods', [
            'settings' => [
                'translations' => ['en' => $en, 'ar' => $ar],
            ],
        ]);
    }

    public function update(UpdateAdminContentRequest $request): RedirectResponse
    {
        $content = $request->input('sections.contact_methods', []);

        if (isset($content['translations'])) {
            $content = ['translations' => $content['translations']];
        }

        PageSection::updateOrCreate(
            ['page_key' => 'contact', 'section_key' => 'contact_methods'],
            [
                'section_type' => 'contact.contact_methods',
                'content_snapshot' => $content,
                'status' => 'published',
                'published_at' => now(),
                'updated_by' => $request->user()->id,
            ],
        );

        WebsiteCache::section('contact', 'contact_methods');
        WebsiteCache::sitemap();

        return back()->with('success', 'Contact methods updated.');
    }
}
