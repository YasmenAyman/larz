<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageSection;
use App\Services\MediaUploadService;
use App\Support\WebsiteCache;
use App\Support\WebsiteContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LocationMapController extends Controller
{
    public function edit(): Response
    {
        $snapshot = PageSection::query()->where('page_key', 'contact')->where('section_key', 'location_map')->value('content_snapshot') ?? [];
        $defaults = [
            'eyebrow' => 'Location & map',
            'heading' => 'Find us.',
            'description' => 'Visit our sales office in New Cairo, or find each community on the map. We\'ll be glad to walk you through it in person.',
            'cta_label' => 'Get directions',
            'cta_url' => '#directions',
        ];
        $translations = $snapshot['translations'] ?? ['en' => $defaults, 'ar' => []];
        $image = null;
        if (! empty($snapshot['image_id'])) {
            $image = WebsiteContent::assetUrl(\App\Models\MediaAsset::find($snapshot['image_id']));
        }

        $addressSetting = \App\Models\SiteSetting::query()->where('key', 'contact.address')->value('value');

        return Inertia::render('Admin/Pages/ContactLocationMap', [
            'translations' => $translations,
            'image' => $image,
            'address' => $addressSetting ?? '',
        ]);
    }

    public function update(Request $request, MediaUploadService $uploads): RedirectResponse
    {
        $request->validate([
            'translations.en.eyebrow' => ['nullable', 'string', 'max:200'],
            'translations.en.heading' => ['nullable', 'string', 'max:200'],
            'translations.en.description' => ['nullable', 'string', 'max:1000'],
            'translations.en.cta_label' => ['nullable', 'string', 'max:100'],
            'translations.en.cta_url' => ['nullable', 'string', 'max:500'],
            'translations.ar.eyebrow' => ['nullable', 'string', 'max:200'],
            'translations.ar.heading' => ['nullable', 'string', 'max:200'],
            'translations.ar.description' => ['nullable', 'string', 'max:1000'],
            'translations.ar.cta_label' => ['nullable', 'string', 'max:100'],
            'translations.ar.cta_url' => ['nullable', 'string', 'max:500'],
            'image' => ['nullable', 'file', 'image', 'max:10240'],
            'address' => ['nullable', 'string', 'max:500'],
        ]);

        $section = PageSection::query()->where('page_key', 'contact')->where('section_key', 'location_map')->first();
        $snapshot = $section?->content_snapshot ?? [];
        $oldAsset = ! empty($snapshot['image_id']) ? \App\Models\MediaAsset::find($snapshot['image_id']) : null;
        $newAsset = null;

        try {
            DB::transaction(function () use ($request, $uploads, $snapshot, &$newAsset): void {
                $content = ['translations' => $request->input('translations')];
                if ($request->hasFile('image')) {
                    $newAsset = $uploads->storePublicImage($request->file('image'), 'contact/location-map');
                    $content['image_id'] = $newAsset->id;
                } elseif (! empty($snapshot['image_id'])) {
                    $content['image_id'] = $snapshot['image_id'];
                }

                PageSection::updateOrCreate(
                    ['page_key' => 'contact', 'section_key' => 'location_map'],
                    ['section_type' => 'contact.location_map', 'content_snapshot' => $content, 'status' => 'published', 'published_at' => now(), 'updated_by' => $request->user()->id],
                );
            });
        } catch (\Throwable $exception) {
            if ($newAsset) $uploads->delete($newAsset);
            throw $exception;
        }

        if ($request->hasFile('image') && $oldAsset) $uploads->deleteIfUnreferenced($oldAsset);

        if ($request->has('address')) {
            \App\Models\SiteSetting::where('key', 'contact.address')->update(['value' => $request->input('address')]);
        }

        WebsiteCache::section('contact', 'location_map');
        WebsiteCache::sitemap();

        return back()->with('success', 'Location & map updated.');
    }
}
