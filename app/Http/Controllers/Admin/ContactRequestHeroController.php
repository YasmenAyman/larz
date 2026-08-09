<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAdminContentRequest;
use App\Models\PageSection;
use App\Services\RichTextSanitizer;
use App\Support\WebsiteCache;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactRequestHeroController extends Controller
{
    public function edit(): Response
    {
        $section = PageSection::query()->where('page_key', 'contact')->where('section_key', 'request_form')->first();
        $defaults = [
            'eyebrow' => 'Request pricing / tour',
            'heading' => 'Book a visit or request pricing.',
            'description' => 'Tell us which community you\'re interested in and how to reach you. Our team will follow up with pricing, payment plans and available units.',
        ];
        $snapshot = $section?->content_snapshot ?? [];
        $settings = array_merge($defaults, $snapshot);
        $settings['translations'] = $snapshot['translations'] ?? ['en' => $settings, 'ar' => []];

        return Inertia::render('Admin/Pages/ContactRequestHero', [
            'settings' => $settings,
            'status' => $section?->status ?? 'inactive',
            'updated_at' => $section?->updated_at?->toDateTimeString(),
        ]);
    }

    public function updateSettings(UpdateAdminContentRequest $request): RedirectResponse
    {
        $content = app(RichTextSanitizer::class)->sanitizeArray($request->input('section', $request->input('sections.request_form', [])));
        if (isset($content['translations'])) {
            $content = ['translations' => $content['translations']];
        }
        PageSection::updateOrCreate(
            ['page_key' => 'contact', 'section_key' => 'request_form'],
            ['section_type' => 'contact.request_form', 'content_snapshot' => $content, 'status' => 'published', 'published_at' => now(), 'updated_by' => $request->user()->id],
        );
        WebsiteCache::section('contact', 'request_form');
        WebsiteCache::sitemap();

        return back()->with('success', 'Request form hero updated.');
    }
}
