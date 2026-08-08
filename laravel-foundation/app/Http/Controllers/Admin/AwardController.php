<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAwardRequest;
use App\Http\Requests\Admin\UpdateAwardRequest;
use App\Http\Requests\UpdateAdminContentRequest;
use App\Models\Award;
use App\Models\PageSection;
use App\Services\RichTextSanitizer;
use App\Support\WebsiteCache;
use App\Support\WebsiteContent;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AwardController extends Controller
{
    public function index(): Response
    {
        $section = PageSection::query()->where('page_key', 'about')->where('section_key', 'awards')->first();
        $settings = $section?->content_snapshot ?? [];
        $rawTranslations = $settings['translations'] ?? [];
        $enCopy = $rawTranslations['en'] ?? [];
        $arCopy = $rawTranslations['ar'] ?? [];

        return Inertia::render('Admin/Content/Awards/Index', [
            'settings' => [
                'eyebrow' => $settings['eyebrow'] ?? 'Awards & achievements',
                'heading' => $settings['heading'] ?? 'Recognised for building things that last.',
                'translations' => [
                    'en' => [
                        'eyebrow' => $enCopy['eyebrow'] ?? ($settings['eyebrow'] ?? 'Awards & achievements'),
                        'heading' => $enCopy['heading'] ?? ($settings['heading'] ?? 'Recognised for building things that last.'),
                    ],
                    'ar' => [
                        'eyebrow' => $arCopy['eyebrow'] ?? '',
                        'heading' => $arCopy['heading'] ?? '',
                    ],
                ],
            ],
            'awards' => Award::query()->orderBy('sort_order')->orderBy('id')->get()->map(fn (Award $award) => $this->present($award))->values()->all(),
        ]);
    }

    public function updateSettings(UpdateAdminContentRequest $request): RedirectResponse
    {
        $content = app(RichTextSanitizer::class)->sanitizeArray($request->input('section', $request->input('sections.awards', [])));
        $translationsInput = $request->input('translations', []);
        $translations = [
            'en' => app(RichTextSanitizer::class)->sanitizeArray($translationsInput['en'] ?? []),
            'ar' => app(RichTextSanitizer::class)->sanitizeArray($translationsInput['ar'] ?? []),
        ];
        $content['translations'] = $translations;
        PageSection::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'awards'],
            ['section_type' => 'about.awards', 'content_snapshot' => $content, 'status' => 'published', 'published_at' => now(), 'updated_by' => $request->user()->id],
        );
        WebsiteCache::section('about', 'awards');

        return back()->with('success', 'Awards section settings updated.');
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Content/Awards/Form', ['award' => null]);
    }

    public function store(StoreAwardRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['translations']);
        $data['is_published'] = $request->boolean('is_published');
        $data['translations'] = $this->sanitizeTranslations($request->input('translations', []));
        Award::create($data);
        WebsiteCache::section('about', 'awards');

        return to_route('admin.pages.about.awards.edit')->with('success', 'Award created.');
    }

    public function edit(Award $award): Response
    {
        return Inertia::render('Admin/Content/Awards/Form', [
            'award' => $this->present($award),
        ]);
    }

    public function update(UpdateAwardRequest $request, Award $award): RedirectResponse
    {
        $data = $request->safe()->except(['translations']);
        $data['is_published'] = $request->boolean('is_published');
        $data['translations'] = $this->sanitizeTranslations($request->input('translations', []));
        $award->update($data);
        WebsiteCache::section('about', 'awards');

        return to_route('admin.pages.about.awards.edit')->with('success', 'Award updated.');
    }

    public function destroy(Award $award): RedirectResponse
    {
        $award->delete();
        WebsiteCache::section('about', 'awards');

        return back()->with('success', 'Award deleted.');
    }

    public function togglePublished(Award $award): RedirectResponse
    {
        $award->update(['is_published' => ! $award->is_published]);
        WebsiteCache::section('about', 'awards');

        return back()->with('success', 'Award visibility updated.');
    }

    private function present(Award $award): array
    {
        return [
            'id' => $award->id,
            'title' => $award->title,
            'year' => $award->year,
            'description' => $award->description,
            'icon_key' => $award->icon_key,
            'sort_order' => $award->sort_order,
            'is_published' => $award->is_published,
            'translations' => $award->translations ?? ['en' => ['title' => '', 'description' => ''], 'ar' => ['title' => '', 'description' => '']],
        ];
    }

    private function sanitizeTranslations(array $translations): array
    {
        $sanitizer = app(RichTextSanitizer::class);
        $allowedKeys = ['title', 'description'];
        foreach (['en', 'ar'] as $locale) {
            if (! isset($translations[$locale]) || ! is_array($translations[$locale])) {
                $translations[$locale] = [];
            }
            $values = $translations[$locale];
            $translations[$locale] = [];
            foreach ($allowedKeys as $key) {
                if (isset($values[$key]) && $values[$key] !== '') {
                    $translations[$locale][$key] = $sanitizer->sanitize((string) $values[$key]);
                }
            }
        }
        return $translations;
    }
}