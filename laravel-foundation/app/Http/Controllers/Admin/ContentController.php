<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAdminContentRequest;
use App\Models\Award;
use App\Models\PageSection;
use App\Models\Partner;
use App\Models\Project;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use App\Services\RichTextSanitizer;
use Inertia\Inertia;
use Inertia\Response;

class ContentController extends Controller
{
    private const PAGES = ['home', 'about', 'media', 'contact', 'careers'];

    public function overview(string $page): Response
    {
        $configuration = $this->pageConfiguration($page);
        $sections = PageSection::query()->where('page_key', $page)->get()->keyBy('section_key');

        return Inertia::render('Admin/Pages/Overview', [
            'page' => $page,
            'label' => $configuration['label'],
            'sections' => collect($configuration['sections'])->map(fn ($label, $key) => [
                'key' => $key,
                'label' => $label,
                'description' => 'Edit the structured '.$label.' settings for this page.',
                'status' => $sections->get(str_replace('-', '_', $key))?->status ?? 'inactive',
                'updated_at' => $sections->get(str_replace('-', '_', $key))?->updated_at?->toDateTimeString(),
                'edit_url' => url('/admin/pages/'.$page.'/'.$key),
            ])->values()->all(),
        ]);
    }

    public function sectionEdit(string $page, string $section): Response
    {
        $configuration = $this->pageConfiguration($page);
        abort_unless(array_key_exists($section, $configuration['sections']), 404);
        $sectionKey = str_replace('-', '_', $section);
        $record = PageSection::query()->where('page_key', $page)->where('section_key', $sectionKey)->first();

        return $this->editorResponse($page, $configuration['label'], $section, $record);
    }

    public function updateSection(UpdateAdminContentRequest $request, string $page, string $section): RedirectResponse
    {
        $configuration = $this->pageConfiguration($page);
        abort_unless(array_key_exists($section, $configuration['sections']), 404);
        $sectionKey = str_replace('-', '_', $section);
        $content = app(RichTextSanitizer::class)->sanitizeArray($request->input('section', $request->input('sections.'.$sectionKey, [])));

        PageSection::updateOrCreate(
            ['page_key' => $page, 'section_key' => $sectionKey],
            ['section_type' => $page.'.'.$sectionKey, 'content_snapshot' => $content, 'status' => 'published', 'published_at' => now(), 'updated_by' => $request->user()->id],
        );
        Cache::forget('website.section.'.$page.'.'.$sectionKey);

        return back()->with('success', $configuration['label'].' / '.$configuration['sections'][$section].' updated.');
    }

    public function edit(string $page): Response
    {
        $configuration = $this->pageConfiguration($page);

        return Inertia::render('Admin/Content/Editor', [
            'page' => $page,
            'label' => $configuration['label'],
            'sections' => PageSection::query()->where('page_key', $page)->orderBy('sort_order')->get(['section_key', 'section_type', 'content_snapshot', 'status']),
            'projects' => Project::query()->where('is_published', true)->orderBy('sort_order')->get(['id', 'title']),
            'awards' => Award::query()->where('is_published', true)->orderBy('sort_order')->get(['id', 'title', 'year']),
            'partners' => Partner::query()->where('is_published', true)->orderBy('sort_order')->get(['id', 'name']),
            'testimonials' => Testimonial::query()->where('is_published', true)->orderBy('sort_order')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateAdminContentRequest $request, string $page): RedirectResponse
    {
        abort_unless(in_array($page, self::PAGES, true), 404);
        $sections = app(RichTextSanitizer::class)->sanitizeArray($request->input('sections', []));

        DB::transaction(function () use ($sections, $page, $request) {
            foreach ($sections as $sectionKey => $content) {
                PageSection::updateOrCreate(
                    ['page_key' => $page, 'section_key' => $sectionKey],
                    ['section_type' => $page.'.'.$sectionKey, 'content_snapshot' => $content, 'status' => 'published', 'published_at' => now(), 'updated_by' => $request->user()->id],
                );
            }
        });

        foreach (array_keys($sections) as $sectionKey) Cache::forget('website.section.'.$page.'.'.$sectionKey);
        return back()->with('success', ucfirst($page).' content updated.');
    }

    private function pageConfiguration(string $page): array
    {
        abort_unless(in_array($page, self::PAGES, true), 404);
        return config('admin_pages.'.$page);
    }

    private function editorResponse(string $page, string $label, string $section, ?PageSection $record): Response
    {
        return Inertia::render('Admin/Content/Editor', [
            'page' => $page,
            'label' => $label,
            'section' => $section,
            'sections' => [[
                'section_key' => str_replace('-', '_', $section),
                'section_type' => $record?->section_type ?? $page.'.'.str_replace('-', '_', $section),
                'content_snapshot' => $record?->content_snapshot ?? [],
                'status' => $record?->status ?? 'inactive',
            ]],
            'projects' => Project::query()->where('is_published', true)->orderBy('sort_order')->get(['id', 'title']),
            'awards' => Award::query()->where('is_published', true)->orderBy('sort_order')->get(['id', 'title', 'year']),
            'partners' => Partner::query()->where('is_published', true)->orderBy('sort_order')->get(['id', 'name']),
            'testimonials' => Testimonial::query()->where('is_published', true)->orderBy('sort_order')->get(['id', 'name']),
        ]);
    }
}
