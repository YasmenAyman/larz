<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePhotoGalleryItemRequest;
use App\Http\Requests\Admin\UpdateMediaGalleryRequest;
use App\Http\Requests\Admin\UpdatePhotoGalleryItemRequest;
use App\Models\PageSection;
use App\Models\PhotoGalleryItem;
use App\Services\MediaUploadService;
use App\Services\RichTextSanitizer;
use App\Support\WebsiteCache;
use App\Support\WebsiteContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MediaGalleryController extends Controller
{
    public function edit(): Response
    {
        $section = PageSection::query()->where('page_key', 'media')->where('section_key', 'gallery')->first();
        $raw = $section?->content_snapshot ?? [];
        $defaults = [
            'eyebrow' => 'Photo gallery',
            'heading' => 'Inside our communities.',
            'description' => 'A glimpse into the details, designs, and destinations that define the LARZ experience.',
        ];
        $settings = array_merge($defaults, $raw);
        $translations = $raw['translations'] ?? ['en' => $settings, 'ar' => ['eyebrow' => '', 'heading' => '', 'description' => '']];
        return Inertia::render('Admin/Pages/MediaGallery', [
            'settings' => [
                'eyebrow' => $settings['eyebrow'],
                'heading' => $settings['heading'],
                'description' => $settings['description'],
                'translations' => $translations,
            ],
            'items' => PhotoGalleryItem::query()->with('media')->orderBy('sort_order')->orderBy('id')->get()->map(fn (PhotoGalleryItem $item) => [
                'id' => $item->id,
                'title' => $item->title,
                'alt_text' => $item->alt_text,
                'caption' => $item->caption,
                'location' => $item->location,
                'event_date' => $item->event_date?->format('Y-m-d'),
                'sort_order' => $item->sort_order,
                'is_published' => $item->is_published,
                'is_active' => $item->is_active,
                'image' => WebsiteContent::assetUrl($item->media),
            ])->values()->all(),
        ]);
    }

    public function update(UpdateMediaGalleryRequest $request, MediaUploadService $uploads): RedirectResponse
    {
        $newAssets = [];
        $removedItems = [];
        try {
            DB::transaction(function () use ($request, $uploads, &$newAssets, &$removedItems) {
                $translationsInput = $request->input('translations', []);
                $translations = [
                    'en' => app(RichTextSanitizer::class)->sanitizeArray($translationsInput['en'] ?? []),
                    'ar' => app(RichTextSanitizer::class)->sanitizeArray($translationsInput['ar'] ?? []),
                ];
                $settings = [
                    'translations' => $translations,
                    'eyebrow' => $request->input('eyebrow', ''),
                    'heading' => $request->input('heading', ''),
                    'description' => $request->input('description', ''),
                ];
                PageSection::updateOrCreate(
                    ['page_key' => 'media', 'section_key' => 'gallery'],
                    ['section_type' => 'media.gallery', 'content_snapshot' => $settings, 'status' => 'published', 'published_at' => now(), 'updated_by' => $request->user()->id],
                );

                foreach ($request->input('remove_ids', []) as $id) {
                    $item = PhotoGalleryItem::query()->findOrFail((int) $id);
                    $removedItems[] = $item->media;
                    $item->delete();
                }

                foreach (array_values($request->input('gallery_ids', [])) as $order => $id) {
                    PhotoGalleryItem::query()->whereKey((int) $id)->update(['sort_order' => $order]);
                }

                $nextOrder = (int) PhotoGalleryItem::query()->max('sort_order') + 1;
                foreach ($request->file('images', []) as $file) {
                    $asset = $uploads->storePublicImage($file, 'media/gallery');
                    $newAssets[] = $asset;
                    PhotoGalleryItem::create([
                        'media_asset_id' => $asset->id,
                        'title' => null,
                        'alt_text' => 'LARZ gallery photo',
                        'sort_order' => $nextOrder++,
                        'is_published' => true,
                        'is_active' => true,
                    ]);
                }
            });
        } catch (\Throwable $exception) {
            foreach ($newAssets as $asset) $uploads->delete($asset);
            throw $exception;
        }

        foreach ($removedItems as $asset) if ($asset) $uploads->deleteIfUnreferenced($asset);
        WebsiteCache::section('media', 'gallery');
        WebsiteCache::mediaGallery();
        WebsiteCache::homepage();
        return back()->with('success', 'Media gallery updated.');
    }

    public function store(StorePhotoGalleryItemRequest $request, MediaUploadService $uploads): RedirectResponse
    {
        $newAsset = null;
        try {
            DB::transaction(function () use ($request, $uploads, &$newAsset): void {
                $data = $request->safe()->except('image');
                $newAsset = $uploads->storePublicImage($request->file('image'), 'media/gallery');
                $data['media_asset_id'] = $newAsset->id;
                $data['is_published'] = $request->boolean('is_published');
                $data['is_active'] = $request->boolean('is_active');
                PhotoGalleryItem::create($data);
            });
        } catch (\Throwable $exception) {
            if ($newAsset) $uploads->delete($newAsset);
            throw $exception;
        }
        WebsiteCache::mediaGallery();
        return back()->with('success', 'Photo added.');
    }

    public function updateItem(UpdatePhotoGalleryItemRequest $request, PhotoGalleryItem $photoGalleryItem, MediaUploadService $uploads): RedirectResponse
    {
        $oldAsset = $photoGalleryItem->media;
        $newAsset = null;
        try {
            DB::transaction(function () use ($request, $uploads, $photoGalleryItem, &$newAsset): void {
                $data = $request->safe()->except('image');
                if ($request->hasFile('image')) {
                    $newAsset = $uploads->storePublicImage($request->file('image'), 'media/gallery');
                    $data['media_asset_id'] = $newAsset->id;
                }
                $data['is_published'] = $request->boolean('is_published');
                $data['is_active'] = $request->boolean('is_active');
                $photoGalleryItem->update($data);
            });
        } catch (\Throwable $exception) {
            if ($newAsset) $uploads->delete($newAsset);
            throw $exception;
        }

        if ($request->hasFile('image') && $oldAsset) $uploads->deleteIfUnreferenced($oldAsset);
        WebsiteCache::mediaGallery();
        return back()->with('success', 'Photo updated.');
    }

    public function destroy(PhotoGalleryItem $photoGalleryItem, MediaUploadService $uploads): RedirectResponse
    {
        $asset = $photoGalleryItem->media;
        $photoGalleryItem->delete();
        if ($asset) $uploads->deleteIfUnreferenced($asset);
        WebsiteCache::mediaGallery();
        return back()->with('success', 'Photo moved to trash.');
    }
}