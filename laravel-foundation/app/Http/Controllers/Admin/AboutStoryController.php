<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAboutStoryRequest;
use App\Models\MediaAsset;
use App\Models\PageSection;
use App\Services\MediaUploadService;
use App\Services\RichTextSanitizer;
use App\Support\WebsiteCache;
use App\Support\WebsiteContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AboutStoryController extends Controller
{
    public function edit(): Response
    {
        $snapshot = PageSection::query()->where('page_key', 'about')->where('section_key', 'story')->value('content_snapshot') ?? [];
        $current = WebsiteContent::section('about', 'story');
        $translations = $snapshot['translations'] ?? ['en' => $current, 'ar' => []];
        $image = ! empty($snapshot['image_id']) ? WebsiteContent::assetUrl(MediaAsset::find($snapshot['image_id'])) : asset($snapshot['image'] ?? 'assets/IMAGE-01-RENDERED-1.png');

        return Inertia::render('Admin/Pages/AboutStory', ['translations' => $translations, 'image' => $image]);
    }

    public function update(UpdateAboutStoryRequest $request, MediaUploadService $uploads): RedirectResponse
    {
        $data = $request->validated();
        $section = PageSection::query()->where('page_key', 'about')->where('section_key', 'story')->first();
        $snapshot = $section?->content_snapshot ?? [];
        $oldAsset = ! empty($snapshot['image_id']) ? MediaAsset::find($snapshot['image_id']) : null;
        $newAsset = null;
        try {
            DB::transaction(function () use ($request, $data, $uploads, $snapshot, &$newAsset): void {
                $translations = $data['translations'];
                $sanitizer = app(RichTextSanitizer::class);
                foreach (['en', 'ar'] as $locale) {
                    $translations[$locale]['body'] = $sanitizer->sanitize($translations[$locale]['body'] ?? '');
                }
                $content = ['translations' => $translations];
                if ($request->hasFile('image')) {
                    $newAsset = $uploads->storePublicImage($request->file('image'), 'about/story');
                    $content['image_id'] = $newAsset->id;
                } elseif (! empty($snapshot['image_id'])) {
                    $content['image_id'] = $snapshot['image_id'];
                } elseif (! empty($snapshot['image'])) {
                    $content['image'] = $snapshot['image'];
                }
                PageSection::updateOrCreate(['page_key' => 'about', 'section_key' => 'story'], ['section_type' => 'about.story', 'content_snapshot' => $content, 'status' => 'published', 'published_at' => now(), 'updated_by' => $request->user()->id]);
            });
        } catch (\Throwable $exception) {
            if ($newAsset) $uploads->delete($newAsset);
            throw $exception;
        }
        if ($request->hasFile('image') && $oldAsset) $uploads->deleteIfUnreferenced($oldAsset);
        WebsiteCache::section('about', 'story');
        WebsiteCache::sitemap();
        return back()->with('success', 'About story updated.');
    }
}
