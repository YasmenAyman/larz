<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePartnerRequest;
use App\Http\Requests\Admin\UpdatePartnerRequest;
use App\Http\Requests\UpdateAdminContentRequest;
use App\Models\PageSection;
use App\Models\Partner;
use App\Services\MediaUploadService;
use App\Services\RichTextSanitizer;
use App\Support\WebsiteCache;
use App\Support\WebsiteContent;
use App\Support\LocalizedContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PartnerController extends Controller
{
    public function index(): Response
    {
        $section = PageSection::query()->where('page_key', 'about')->where('section_key', 'partners')->first();

        return Inertia::render('Admin/Content/Partners/Index', [
            'settings' => $section?->content_snapshot ?? [],
            'partners' => Partner::query()->with('logo')->orderBy('sort_order')->orderBy('id')->get()->map(fn (Partner $item) => $this->present($item))->values()->all(),
        ]);
    }

    public function updateSettings(UpdateAdminContentRequest $request): RedirectResponse
    {
        $content = app(RichTextSanitizer::class)->sanitizeArray($request->input('section', $request->input('sections.partners', [])));
        PageSection::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'partners'],
            ['section_type' => 'about.partners', 'content_snapshot' => $content, 'status' => 'published', 'published_at' => now(), 'updated_by' => $request->user()->id],
        );
        WebsiteCache::section('about', 'partners');

        return back()->with('success', 'Partners section settings updated.');
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Content/Partners/Form', ['partner' => null]);
    }

    public function store(StorePartnerRequest $request, MediaUploadService $uploads): RedirectResponse
    {
        $data = $request->safe()->except('logo');
        $data['translations'] = $this->sanitizeTranslations($data['translations'] ?? []);
        $data['is_published'] = $request->boolean('is_published');
        $newAsset = null;
        $partner = null;

        try {
            DB::transaction(function () use ($request, $uploads, &$newAsset, &$data, &$partner): void {
                if ($request->hasFile('logo')) {
                    $newAsset = $uploads->storePublicImage($request->file('logo'), 'media/partners');
                    $data['logo_id'] = $newAsset->id;
                }
                if (!isset($data['sort_order']) || $data['sort_order'] === null) {
                    $data['sort_order'] = (int) Partner::query()->max('sort_order') + 1;
                }
                $partner = Partner::create($data);
            });
        } catch (\Throwable $exception) {
            if ($newAsset) $uploads->delete($newAsset);
            throw $exception;
        }
        WebsiteCache::section('about', 'partners');

        return to_route('admin.pages.about.partners.item.edit', $partner)->with('success', 'Partner created.');
    }

    public function edit(Partner $partner): Response
    {
        $partner->load('logo');

        return Inertia::render('Admin/Content/Partners/Form', [
            'partner' => $this->present($partner),
        ]);
    }

    public function update(UpdatePartnerRequest $request, Partner $partner, MediaUploadService $uploads): RedirectResponse
    {
        $data = $request->safe()->except('logo');
        $data['translations'] = $this->sanitizeTranslations($data['translations'] ?? []);
        $data['is_published'] = $request->boolean('is_published');
        $oldAsset = $partner->logo;
        $newAsset = null;

        try {
            DB::transaction(function () use ($request, $uploads, $partner, &$newAsset, &$data): void {
                if ($request->hasFile('logo')) {
                    $newAsset = $uploads->storePublicImage($request->file('logo'), 'media/partners');
                    $data['logo_id'] = $newAsset->id;
                }
                $partner->update($data);
            });
        } catch (\Throwable $exception) {
            if ($newAsset) $uploads->delete($newAsset);
            throw $exception;
        }

        if ($request->hasFile('logo') && $oldAsset) $uploads->deleteIfUnreferenced($oldAsset);
        WebsiteCache::section('about', 'partners');

        return to_route('admin.pages.about.partners.item.edit', $partner)->with('success', 'Partner updated.');
    }

    public function destroy(Partner $partner, MediaUploadService $uploads): RedirectResponse
    {
        $asset = $partner->logo;
        $partner->delete();
        if ($asset) $uploads->deleteIfUnreferenced($asset);
        WebsiteCache::section('about', 'partners');

        return back()->with('success', 'Partner deleted.');
    }

    public function togglePublished(Partner $partner): RedirectResponse
    {
        $partner->update(['is_published' => ! $partner->is_published]);
        WebsiteCache::section('about', 'partners');

        return back()->with('success', 'Partner visibility updated.');
    }

    private function present(Partner $partner): array
    {
        return [
            'id' => $partner->id,
            'name' => $partner->name,
            'role' => $partner->role,
            'description' => $partner->description,
            'url' => $partner->url,
            'sort_order' => $partner->sort_order,
            'is_published' => $partner->is_published,
            'logo' => WebsiteContent::assetUrl($partner->logo),
            'translations' => $partner->translations ?? ['en' => [], 'ar' => []],
        ];
    }

    private function sanitizeTranslations(array $translations): array
    {
        $sanitizer = app(RichTextSanitizer::class);
        foreach (['en', 'ar'] as $locale) {
            $translations[$locale] ??= [];
            $translations[$locale]['description'] = $sanitizer->sanitize($translations[$locale]['description'] ?? '');
        }
        return $translations;
    }
}
