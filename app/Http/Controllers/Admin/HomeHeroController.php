<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateHomeHeroRequest;
use App\Models\MediaAsset;
use App\Models\PageSection;
use App\Services\MediaUploadService;
use App\Support\LocalizedContent;
use App\Support\WebsiteCache;
use App\Support\WebsiteContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class HomeHeroController extends Controller
{
    private const COPY_KEYS = ['eyebrow', 'heading', 'description', 'primary_cta_label', 'primary_cta_url'];

    public function edit(): Response
    {
        $snapshot = PageSection::query()
            ->where('page_key', 'home')
            ->where('section_key', 'hero')
            ->value('content_snapshot') ?? [];

        return Inertia::render('Admin/Pages/HomeHero', [
            'translations' => $this->adminTranslations($snapshot),
            'video' => ! empty($snapshot['hero_video_id'])
                ? WebsiteContent::assetUrl(MediaAsset::find($snapshot['hero_video_id']))
                : (! empty($snapshot['hero_video']) ? asset($snapshot['hero_video']) : null),
        ]);
    }

    public function update(UpdateHomeHeroRequest $request, MediaUploadService $uploads): RedirectResponse
    {
        $section = PageSection::query()->where('page_key', 'home')->where('section_key', 'hero')->first();
        $snapshot = $section?->content_snapshot ?? [];
        $newAsset = null;

        try {
            DB::transaction(function () use ($request, $uploads, $snapshot, &$newAsset): void {
                $translationsInput = $request->input('translations');
                $translationsInput = is_array($translationsInput) ? $translationsInput : [];
                $previousTranslations = is_array($snapshot['translations'] ?? null) ? $snapshot['translations'] : [];

                $content = $snapshot;
                $content['translations'] = [
                    'en' => $this->cleanCopy($translationsInput['en'] ?? $previousTranslations['en'] ?? []),
                    'ar' => $this->cleanCopy($translationsInput['ar'] ?? $previousTranslations['ar'] ?? []),
                ];

                if ($request->hasFile('hero_video')) {
                    $newAsset = $uploads->storePublicVideo($request->file('hero_video'), 'home/hero');
                    $content['hero_video_id'] = $newAsset->id;
                    unset($content['hero_video']);
                }

                PageSection::updateOrCreate(
                    ['page_key' => 'home', 'section_key' => 'hero'],
                    ['section_type' => 'home.hero', 'content_snapshot' => $content, 'status' => 'published', 'published_at' => now(), 'updated_by' => $request->user()->id],
                );
            });
        } catch (\Throwable $exception) {
            if ($newAsset) {
                $uploads->delete($newAsset);
            }

            throw $exception;
        }

        WebsiteCache::section('home', 'hero');

        return back()->with('success', 'Home hero updated.');
    }

    private function cleanCopy(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        $copy = [];
        foreach (self::COPY_KEYS as $key) {
            if (isset($value[$key]) && $value[$key] !== '') {
                $copy[$key] = (string) $value[$key];
            }
        }

        return $copy;
    }

    private function adminTranslations(array $snapshot): array
    {
        $translations = LocalizedContent::adminTranslations($snapshot, [
            ...self::COPY_KEYS,
            'cta_label',
            'cta_url',
        ]);

        foreach (['en', 'ar'] as $locale) {
            $copy = $translations[$locale] ?? [];
            $copy['primary_cta_label'] = $copy['primary_cta_label'] ?? $copy['cta_label'] ?? '';
            $copy['primary_cta_url'] = $copy['primary_cta_url'] ?? $copy['cta_url'] ?? '';
            unset($copy['cta_label'], $copy['cta_url']);
            $translations[$locale] = $copy;
        }

        return $translations;
    }
}
