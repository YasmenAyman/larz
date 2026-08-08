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

class SocialMediaController extends Controller
{
    public function edit(): Response
    {
        $section = PageSection::query()->where('page_key', 'contact')->where('section_key', 'social_media')->first();
        $defaults = [
            'eyebrow' => 'Social media',
            'heading' => 'Follow LARZ.',
        ];
        $snapshot = $section?->content_snapshot ?? [];
        $settings = array_merge($defaults, $snapshot);
        $settings['translations'] = $snapshot['translations'] ?? ['en' => $settings, 'ar' => []];

        return Inertia::render('Admin/Pages/ContactSocialMedia', [
            'settings' => $settings,
            'status' => $section?->status ?? 'inactive',
            'updated_at' => $section?->updated_at?->toDateTimeString(),
        ]);
    }

    public function updateSettings(UpdateAdminContentRequest $request): RedirectResponse
    {
        $content = app(RichTextSanitizer::class)->sanitizeArray($request->input('section', $request->input('sections.social_media', [])));
        if (isset($content['translations'])) {
            $content = ['translations' => $content['translations']];
        }
        PageSection::updateOrCreate(
            ['page_key' => 'contact', 'section_key' => 'social_media'],
            ['section_type' => 'contact.social_media', 'content_snapshot' => $content, 'status' => 'published', 'published_at' => now(), 'updated_by' => $request->user()->id],
        );
        WebsiteCache::section('contact', 'social_media');
        WebsiteCache::sitemap();

        return back()->with('success', 'Social media section updated.');
    }
}
