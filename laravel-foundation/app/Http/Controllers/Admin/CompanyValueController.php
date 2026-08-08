<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCompanyValueRequest;
use App\Http\Requests\Admin\UpdateCompanyValueRequest;
use App\Http\Requests\UpdateAdminContentRequest;
use App\Models\CompanyValue;
use App\Models\PageSection;
use App\Services\RichTextSanitizer;
use App\Support\WebsiteCache;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CompanyValueController extends Controller
{
    public function index(): Response
    {
        $section = PageSection::query()->where('page_key', 'careers')->where('section_key', 'values')->first();
        $snapshot = $section?->content_snapshot ?? [];
        $translations = $snapshot['translations'] ?? [];

        return Inertia::render('Admin/Pages/CareersValues', [
            'settings' => [
                'translations' => [
                    'en' => $translations['en'] ?? ['eyebrow' => 'Why LARZ', 'heading' => 'Grow with a team that builds things that last.', 'description' => ''],
                    'ar' => $translations['ar'] ?? ['eyebrow' => '', 'heading' => '', 'description' => ''],
                ],
            ],
            'values' => CompanyValue::query()->orderBy('sort_order')->orderBy('id')->get()->map(fn (CompanyValue $value) => $this->present($value))->values()->all(),
        ]);
    }

    public function updateSettings(UpdateAdminContentRequest $request): RedirectResponse
    {
        $section = $request->input('sections.values', $request->input('section', []));
        $translations = $section['translations'] ?? $request->input('translations', []);
        $translations = app(RichTextSanitizer::class)->sanitizeArray($translations);

        PageSection::updateOrCreate(
            ['page_key' => 'careers', 'section_key' => 'values'],
            [
                'section_type' => 'careers.values',
                'content_snapshot' => ['translations' => $translations],
                'status' => 'published',
                'published_at' => now(),
                'updated_by' => $request->user()->id,
            ],
        );
        WebsiteCache::section('careers', 'values');

        return back()->with('success', 'Why LARZ section updated.');
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Pages/CareersValueForm', ['value' => null]);
    }

    public function store(StoreCompanyValueRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['is_published'] = $request->boolean('is_published');
        $data['translations'] = $this->cleanTranslations($data['translations'] ?? []);
        $this->syncBaseFromTranslations($data);
        CompanyValue::create($data);
        WebsiteCache::section('careers', 'values');

        return to_route('admin.pages.careers.values.edit')->with('success', 'Value created.');
    }

    public function edit(CompanyValue $companyValue): Response
    {
        return Inertia::render('Admin/Pages/CareersValueForm', ['value' => $this->present($companyValue)]);
    }

    public function update(UpdateCompanyValueRequest $request, CompanyValue $companyValue): RedirectResponse
    {
        $data = $request->validated();
        $data['is_published'] = $request->boolean('is_published');
        $data['translations'] = $this->cleanTranslations($data['translations'] ?? []);
        $this->syncBaseFromTranslations($data);
        $companyValue->update($data);
        WebsiteCache::section('careers', 'values');

        return to_route('admin.pages.careers.values.edit')->with('success', 'Value updated.');
    }

    public function destroy(CompanyValue $companyValue): RedirectResponse
    {
        $companyValue->delete();
        WebsiteCache::section('careers', 'values');

        return back()->with('success', 'Value deleted.');
    }

    public function togglePublished(CompanyValue $companyValue): RedirectResponse
    {
        $companyValue->update(['is_published' => ! $companyValue->is_published]);
        WebsiteCache::section('careers', 'values');

        return back()->with('success', 'Value visibility updated.');
    }

    private function present(CompanyValue $value): array
    {
        return [
            'id' => $value->id,
            'title' => $value->title,
            'description' => $value->description,
            'icon_key' => $value->icon_key,
            'sort_order' => $value->sort_order,
            'is_published' => $value->is_published,
            'translations' => $value->translations ?? ['en' => ['title' => '', 'description' => ''], 'ar' => ['title' => '', 'description' => '']],
        ];
    }

    private function cleanTranslations(array $translations): array
    {
        foreach (['en', 'ar'] as $locale) {
            $copy = is_array($translations[$locale] ?? null) ? $translations[$locale] : [];
            $translations[$locale] = array_filter([
                'title' => $copy['title'] ?? null,
                'description' => $copy['description'] ?? null,
            ], static fn ($value) => $value !== null && $value !== '');
        }

        return $translations;
    }

    private function syncBaseFromTranslations(array &$data): void
    {
        $en = $data['translations']['en'] ?? [];
        if (! empty($en['title'])) {
            $data['title'] = $en['title'];
        }
        if (array_key_exists('description', $en)) {
            $data['description'] = $en['description'] ?: null;
        }
    }
}
