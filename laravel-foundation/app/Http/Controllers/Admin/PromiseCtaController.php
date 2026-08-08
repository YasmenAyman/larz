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

class PromiseCtaController extends Controller
{
    public function index(): Response
    {
        return $this->edit();
    }

    public function edit(): Response
    {
        $section = PageSection::query()->where('page_key', 'about')->where('section_key', 'promise')->first();
        $defaults = [
            'eyebrow' => 'Our promise',
            'heading' => 'A promise that lasts long after handover.',
            'primary_cta_label' => 'Explore our projects',
            'primary_cta_url' => '/projects',
            'secondary_cta_label' => 'Talk to us',
            'secondary_cta_url' => '/contact',
        ];

        $snapshot = $section?->content_snapshot ?? [];
        $settings = array_merge($defaults, $snapshot);
        $settings['translations'] = $snapshot['translations'] ?? ['en' => $settings, 'ar' => []];
        return Inertia::render('Admin/Pages/PromiseCta', [
            'settings' => $settings,
            'status' => $section?->status ?? 'inactive',
            'updated_at' => $section?->updated_at?->toDateTimeString(),
        ]);
    }

    public function updateSettings(UpdateAdminContentRequest $request): RedirectResponse
    {
        $content = app(RichTextSanitizer::class)->sanitizeArray($request->input('section', $request->input('sections.promise', [])));
        if (isset($content['translations'])) {
            $content = ['translations' => $content['translations']];
        }
        PageSection::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'promise'],
            ['section_type' => 'about.promise', 'content_snapshot' => $content, 'status' => 'published', 'published_at' => now(), 'updated_by' => $request->user()->id],
        );
        WebsiteCache::section('about', 'promise');
        WebsiteCache::sitemap();

        return back()->with('success', 'Promise CTA updated.');
    }
}
