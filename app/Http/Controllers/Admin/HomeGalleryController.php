<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateHomeGalleryRequest;
use App\Models\PageSection;
use App\Models\PhotoGalleryItem;
use App\Services\MediaUploadService;
use App\Support\LocalizedContent;
use App\Support\WebsiteCache;
use App\Support\WebsiteContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class HomeGalleryController extends Controller
{
    public function edit(): Response
    {
        $settings = WebsiteContent::section('home', 'gallery');
        $raw = PageSection::query()->where('page_key', 'home')->where('section_key', 'gallery')->value('content_snapshot') ?? [];
        $copyKeys = ['eyebrow', 'heading', 'description', 'cta_label', 'cta_url'];
        $translations = LocalizedContent::adminTranslations($raw, $copyKeys);
        return Inertia::render('Admin/Pages/HomeGallery', [
            'settings' => [
                'eyebrow' => $settings['eyebrow'] ?? 'Our Gallery',
                'heading' => $settings['heading'] ?? 'Spaces That Inspire',
                'description' => $settings['description'] ?? 'A glimpse into the details, designs, and destinations that define the LARZ experience.',
                'cta_label' => $settings['cta_label'] ?? 'Explore All',
                'cta_url' => $settings['cta_url'] ?? '/projects',
                'translations' => $translations,
            ],
            'items' => PhotoGalleryItem::query()->with('media')->orderBy('sort_order')->get()->map(fn ($item) => [
                'id' => $item->id,
                'title' => $item->title,
                'image' => WebsiteContent::assetUrl($item->media),
                'is_published' => $item->is_published,
            ])->values()->all(),
        ]);
    }

    public function update(UpdateHomeGalleryRequest $request, MediaUploadService $uploads): RedirectResponse
    {
        $data = $request->validated();
        $newAssets = [];
        $removedAssets = [];
        try {
            DB::transaction(function () use ($request, $uploads, $data, &$newAssets, &$removedAssets) {
                $translations = $data['translations'] ?? [
                    'en' => ['eyebrow' => $data['eyebrow'] ?? '', 'heading' => $data['heading'] ?? '', 'description' => $data['description'] ?? '', 'cta_label' => $data['cta_label'] ?? '', 'cta_url' => $data['cta_url'] ?? ''],
                    'ar' => ['eyebrow' => '', 'heading' => '', 'description' => '', 'cta_label' => '', 'cta_url' => ''],
                ];
                $settings = [
                    'translations' => $translations,
                    'eyebrow' => $data['eyebrow'] ?? '',
                    'heading' => $data['heading'] ?? '',
                    'description' => $data['description'] ?? '',
                    'cta_label' => $data['cta_label'] ?? '',
                    'cta_url' => $data['cta_url'] ?? '',
                ];
                PageSection::updateOrCreate(
                    ['page_key' => 'home', 'section_key' => 'gallery'],
                    ['section_type' => 'home.gallery', 'content_snapshot' => $settings, 'status' => 'published', 'published_at' => now(), 'updated_by' => $request->user()->id],
                );

                foreach ($data['remove_ids'] ?? [] as $id) {
                    $item = PhotoGalleryItem::query()->findOrFail($id);
                    $removedAssets[] = $item->media;
                    $item->delete();
                }

                foreach (array_values($data['gallery_ids'] ?? []) as $order => $id) {
                    PhotoGalleryItem::query()->whereKey($id)->update(['sort_order' => $order]);
                }

                $nextOrder = (int) PhotoGalleryItem::query()->max('sort_order') + 1;
                foreach ($request->file('images', []) as $file) {
                    $asset = $uploads->storePublicImage($file, 'media/gallery');
                    $newAssets[] = $asset;
                    PhotoGalleryItem::create(['media_asset_id' => $asset->id, 'title' => null, 'alt_text' => 'LARZ gallery photo', 'sort_order' => $nextOrder++, 'is_published' => true, 'is_active' => true]);
                }
            });
        } catch (\Throwable $exception) {
            foreach ($newAssets as $asset) $uploads->delete($asset);
            throw $exception;
        }

        foreach ($removedAssets as $asset) if ($asset) $uploads->deleteIfUnreferenced($asset);
        WebsiteCache::section('home', 'gallery');
        WebsiteCache::mediaGallery();
        return back()->with('success', 'Home gallery updated.');
    }
}
