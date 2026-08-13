<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAdminContentRequest;
use App\Models\PageSection;
use App\Services\RichTextSanitizer;
use App\Support\LocalizedContent;
use App\Support\WebsiteCache;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactRequestHeroController extends Controller
{
    public function edit(): Response
    {
        $snapshot = PageSection::query()->where('page_key', 'contact')->where('section_key', 'request_form')->value('content_snapshot') ?? [];
        $translations = LocalizedContent::adminTranslations($snapshot, ['eyebrow', 'heading', 'description']);
        $section = PageSection::query()->where('page_key', 'contact')->where('section_key', 'request_form')->first();

        return Inertia::render('Admin/Pages/ContactRequestHero', [
            'settings' => [
                'eyebrow' => $translations['en']['eyebrow'] ?? 'Request pricing / tour',
                'heading' => $translations['en']['heading'] ?? 'Book a visit or request pricing.',
                'description' => $translations['en']['description'] ?? '',
                'translations' => $translations,
            ],
            'status' => $section?->status ?? 'inactive',
            'updated_at' => $section?->updated_at?->toDateTimeString(),
        ]);
    }

    public function updateSettings(UpdateAdminContentRequest $request): RedirectResponse
    {
        $content = $request->input('sections.request_form', []);
        if (isset($content['translations']) && is_array($content['translations'])) {
            $content = ['translations' => app(RichTextSanitizer::class)->sanitizeArray($content['translations'])];
        } else {
            $content = app(RichTextSanitizer::class)->sanitizeArray($content);
            if (isset($content['translations'])) {
                $content = ['translations' => $content['translations']];
            }
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
