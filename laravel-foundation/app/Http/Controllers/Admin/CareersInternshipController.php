<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateCareersInternshipRequest;
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

class CareersInternshipController extends Controller
{
    public function edit(): Response
    {
        $snapshot = PageSection::query()->where('page_key', 'careers')->where('section_key', 'internship')->value('content_snapshot') ?? [];
        $translations = $snapshot['translations'] ?? ['en' => [], 'ar' => []];
        $image = null;
        if (! empty($snapshot['image_id'])) {
            $image = WebsiteContent::assetUrl(MediaAsset::find($snapshot['image_id']));
        } elseif (! empty($snapshot['image'])) {
            $image = asset($snapshot['image']);
        }

        return Inertia::render('Admin/Pages/CareersInternship', [
            'translations' => $translations,
            'image' => $image,
        ]);
    }

    public function update(UpdateCareersInternshipRequest $request, MediaUploadService $uploads): RedirectResponse
    {
        $section = PageSection::query()->where('page_key', 'careers')->where('section_key', 'internship')->first();
        $snapshot = $section?->content_snapshot ?? [];
        $oldAsset = ! empty($snapshot['image_id']) ? MediaAsset::find($snapshot['image_id']) : null;
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
                $sanitizer = app(RichTextSanitizer::class);
                $translations['en'] = $sanitizer->sanitizeArray($translations['en']);
                $translations['ar'] = $sanitizer->sanitizeArray($translations['ar']);

                $content = ['translations' => $translations];

                if ($request->hasFile('image')) {
                    $newAsset = $uploads->storePublicImage($request->file('image'), 'careers/internship');
                    $content['image_id'] = $newAsset->id;
                } elseif (! empty($snapshot['image_id'])) {
                    $content['image_id'] = $snapshot['image_id'];
                } elseif (! empty($snapshot['image'])) {
                    $content['image'] = $snapshot['image'];
                }

                PageSection::updateOrCreate(
                    ['page_key' => 'careers', 'section_key' => 'internship'],
                    [
                        'section_type' => 'careers.internship',
                        'content_snapshot' => $content,
                        'status' => 'published',
                        'published_at' => now(),
                        'updated_by' => $request->user()->id,
                    ],
                );
            });
        } catch (\Throwable $exception) {
            if ($newAsset) {
                $uploads->delete($newAsset);
            }
            throw $exception;
        }

        if ($request->hasFile('image') && $oldAsset) {
            $uploads->deleteIfUnreferenced($oldAsset);
        }

        WebsiteCache::section('careers', 'internship');

        return back()->with('success', 'Internship section updated.');
    }

    private function cleanCopy(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }
        $allowed = ['eyebrow', 'heading', 'description', 'cta_label'];
        $clean = [];
        foreach ($allowed as $key) {
            if (isset($value[$key]) && $value[$key] !== '') {
                $clean[$key] = (string) $value[$key];
            }
        }
        return $clean;
    }
}
