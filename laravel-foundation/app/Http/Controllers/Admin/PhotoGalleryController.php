<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePhotoGalleryItemRequest;
use App\Http\Requests\Admin\UpdatePhotoGalleryItemRequest;
use App\Models\PhotoGalleryItem;
use App\Services\MediaUploadService;
use App\Support\WebsiteCache;
use App\Support\WebsiteContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class PhotoGalleryController extends Controller
{
    public function index(): Response { return Inertia::render('Admin/Media/Gallery/Index', ['items' => PhotoGalleryItem::with('media')->orderBy('sort_order')->paginate(20)->through(fn ($item) => ['id' => $item->id, 'title' => $item->title, 'alt_text' => $item->alt_text, 'location' => $item->location, 'event_date' => $item->event_date?->format('Y-m-d'), 'sort_order' => $item->sort_order, 'is_active' => $item->is_active, 'image' => WebsiteContent::assetUrl($item->media)])]); }
    public function store(StorePhotoGalleryItemRequest $request, MediaUploadService $uploads): RedirectResponse { $newAsset = null; try { DB::transaction(function () use ($request, $uploads, &$newAsset) { $data = $request->safe()->except('image'); $newAsset = $uploads->storePublicImage($request->file('image'), 'media/gallery'); $data['media_asset_id'] = $newAsset->id; $data['is_published'] = $request->boolean('is_published'); $data['is_active'] = $request->boolean('is_active'); PhotoGalleryItem::create($data); }); } catch (\Throwable $exception) { if ($newAsset) $uploads->delete($newAsset); throw $exception; } WebsiteCache::mediaGallery(); return back()->with('success', 'Photo added.'); }
    public function update(UpdatePhotoGalleryItemRequest $request, PhotoGalleryItem $photoGalleryItem, MediaUploadService $uploads): RedirectResponse { $oldAsset = $photoGalleryItem->media; $newAsset = null; try { DB::transaction(function () use ($request, $uploads, $photoGalleryItem, &$newAsset) { $data = $request->safe()->except('image'); if ($request->hasFile('image')) { $newAsset = $uploads->storePublicImage($request->file('image'), 'media/gallery'); $data['media_asset_id'] = $newAsset->id; } $data['is_published'] = $request->boolean('is_published'); $data['is_active'] = $request->boolean('is_active'); $photoGalleryItem->update($data); }); } catch (\Throwable $exception) { if ($newAsset) $uploads->delete($newAsset); throw $exception; } if ($request->hasFile('image') && $oldAsset) $uploads->deleteIfUnreferenced($oldAsset); WebsiteCache::mediaGallery(); return back()->with('success', 'Photo updated.'); }
    public function destroy(PhotoGalleryItem $photoGalleryItem, MediaUploadService $uploads): RedirectResponse { $asset = $photoGalleryItem->media; $photoGalleryItem->delete(); if ($asset) $uploads->deleteIfUnreferenced($asset); WebsiteCache::mediaGallery(); return back()->with('success', 'Photo moved to trash.'); }
}
