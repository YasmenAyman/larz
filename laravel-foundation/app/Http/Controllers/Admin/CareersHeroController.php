<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateCareersHeroRequest;
use App\Models\MediaAsset;
use App\Models\PageSection;
use App\Services\MediaUploadService;
use App\Support\WebsiteCache;
use App\Support\WebsiteContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CareersHeroController extends Controller
{
    public function edit(): Response
    {
        $snapshot = PageSection::query()->where('page_key', 'careers')->where('section_key', 'hero')->value('content_snapshot') ?? [];
        $current = WebsiteContent::section('careers', 'hero');
        $translations = $snapshot['translations'] ?? ['en' => $current, 'ar' => []];
        $background = null;
        if (! empty($snapshot['background_image_id'])) {
            $background = WebsiteContent::assetUrl(MediaAsset::find($snapshot['background_image_id']));
        } elseif (! empty($snapshot['background_image'])) {
            $background = asset($snapshot['background_image']);
        }

        return Inertia::render('Admin/Pages/CareersHero', [
            'translations' => $translations,
            'background' => $background,
        ]);
    }

    public function update(UpdateCareersHeroRequest $request, MediaUploadService $uploads): RedirectResponse
    {
        $section = PageSection::query()->where('page_key', 'careers')->where('section_key', 'hero')->first();
        $snapshot = $section?->content_snapshot ?? [];
        $oldAsset = ! empty($snapshot['background_image_id']) ? MediaAsset::find($snapshot['background_image_id']) : null;
        $newAsset = null;
        try {
            DB::transaction(function () use ($request, $uploads, $snapshot, &$newAsset): void {
                $translationsInput = $request->input('translations');
                $translationsInput = is_array($translationsInput) ? $translationsInput : [];
                $previousTranslations = is_array($snapshot['translations'] ?? null) ? $snapshot['translations'] : [];
                $translations = [
                    'en' => $this->cleanCopy($translationsInput['en'] ?? $previousTranslations['en'] ?? []),
                    'ar' => $this->cleanCopy($translationsInput['ar'] ?? $previousTranslations['ar'] ?? []),
                ];
                $content = ['translations' => $translations];
                if ($request->hasFile('background_image')) {
                    $newAsset = $uploads->storePublicImage($request->file('background_image'), 'careers/hero');
                    $content['background_image_id'] = $newAsset->id;
                } elseif (! empty($snapshot['background_image_id'])) {
                    $content['background_image_id'] = $snapshot['background_image_id'];
                } elseif (! empty($snapshot['background_image'])) {
                    $content['background_image'] = $snapshot['background_image'];
                }
                PageSection::updateOrCreate(
                    ['page_key' => 'careers', 'section_key' => 'hero'],
                    ['section_type' => 'careers.hero', 'content_snapshot' => $content, 'status' => 'published', 'published_at' => now(), 'updated_by' => $request->user()->id],
                );
            });
        } catch (\Throwable $exception) {
            if ($newAsset) $uploads->delete($newAsset);
            throw $exception;
        }
        if ($request->hasFile('background_image') && $oldAsset) $uploads->deleteIfUnreferenced($oldAsset);
        WebsiteCache::section('careers', 'hero');
        WebsiteCache::sitemap();
        return back()->with('success', 'Careers hero updated.');
    }

    private function cleanCopy(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }
        $allowed = ['eyebrow', 'heading', 'description'];
        $clean = [];
        foreach ($allowed as $key) {
            if (isset($value[$key]) && $value[$key] !== '') {
                $clean[$key] = (string) $value[$key];
            }
        }
        return $clean;
    }
}
