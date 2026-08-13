<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAboutHeroRequest;
use App\Models\PageSection;
use App\Services\MediaUploadService;
use App\Support\LocalizedContent;
use App\Support\WebsiteCache;
use App\Support\WebsiteContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AboutHeroController extends Controller
{
    public function edit(): Response
    {
        $snapshot = PageSection::query()->where('page_key', 'about')->where('section_key', 'hero')->value('content_snapshot') ?? [];
        $translations = LocalizedContent::adminTranslations($snapshot, ['eyebrow', 'heading', 'description', 'cta_label', 'cta_url', 'primary_cta_label', 'primary_cta_url', 'secondary_cta_label', 'secondary_cta_url']);
        $background = null;
        if (! empty($snapshot['background_image_id'])) {
            $background = WebsiteContent::assetUrl(\App\Models\MediaAsset::find($snapshot['background_image_id']));
        }

        return Inertia::render('Admin/Pages/AboutHero', [
            'translations' => $translations,
            'background' => $background,
        ]);
    }

    public function update(UpdateAboutHeroRequest $request, MediaUploadService $uploads): RedirectResponse
    {
        $data = $request->validated();
        $section = PageSection::query()->where('page_key', 'about')->where('section_key', 'hero')->first();
        $snapshot = $section?->content_snapshot ?? [];
        $oldAsset = ! empty($snapshot['background_image_id']) ? \App\Models\MediaAsset::find($snapshot['background_image_id']) : null;
        $newAsset = null;
        try {
            DB::transaction(function () use ($request, $data, $uploads, $section, $snapshot, &$newAsset): void {
                $content = ['translations' => $data['translations']];
                if ($request->hasFile('background_image')) {
                    $newAsset = $uploads->storePublicImage($request->file('background_image'), 'about/hero');
                    $content['background_image_id'] = $newAsset->id;
                } elseif (! empty($snapshot['background_image_id'])) {
                    $content['background_image_id'] = $snapshot['background_image_id'];
                } elseif (! empty($snapshot['background_image'])) {
                    $content['background_image'] = $snapshot['background_image'];
                }
                PageSection::updateOrCreate(
                    ['page_key' => 'about', 'section_key' => 'hero'],
                    ['section_type' => 'about.hero', 'content_snapshot' => $content, 'status' => 'published', 'published_at' => now(), 'updated_by' => $request->user()->id],
                );
            });
        } catch (\Throwable $exception) {
            if ($newAsset) $uploads->delete($newAsset);
            throw $exception;
        }
        if ($request->hasFile('background_image') && $oldAsset) $uploads->deleteIfUnreferenced($oldAsset);
        WebsiteCache::section('about', 'hero');
        WebsiteCache::sitemap();
        return back()->with('success', 'About hero updated.');
    }
}
