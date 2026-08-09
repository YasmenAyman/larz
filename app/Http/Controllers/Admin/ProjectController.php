<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectRequest;
use App\Http\Requests\Admin\UpdateProjectRequest;
use App\Models\MediaAsset;
use App\Models\PageSection;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Services\MediaUploadService;
use App\Services\RichTextSanitizer;
use App\Support\WebsiteCache;
use App\Support\WebsiteContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $projects = Project::query()->with(['category', 'heroImage'])
            ->when($request->string('search')->isNotEmpty(), fn ($q) => $q->where('title', 'like', '%'.$request->string('search').'%'))
            ->when($request->filled('status'), fn ($q) => $q->where('is_published', $request->boolean('status')))
            ->when($request->filled('category'), fn ($q) => $q->where('project_category_id', $request->integer('category')))
            ->orderBy('sort_order')->orderByDesc('id')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects->through(fn (Project $project) => $this->present($project)),
            'categories' => ProjectCategory::query()->orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['search', 'status', 'category']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Projects/Form', [
            'project' => null,
            'categories' => ProjectCategory::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreProjectRequest $request, MediaUploadService $uploads): RedirectResponse
    {
        $rawTranslations = $request->input('translations', '[]');
        $rawSections = $request->input('sections', '[]');
        $translations = is_string($rawTranslations) ? json_decode($rawTranslations, true) ?? [] : $rawTranslations;
        $sections = is_string($rawSections) ? json_decode($rawSections, true) ?? [] : $rawSections;

        $data = [
            'project_category_id' => $request->input('project_category_id'),
            'title' => $request->input('title'),
            'slug' => $request->input('slug'),
            'description' => $request->input('description'),
            'short_description' => $request->input('short_description'),
            'location' => $request->input('location'),
            'address' => $request->input('address'),
            'status' => $request->input('status'),
            'project_type' => $request->input('project_type'),
            'completion_date' => $request->input('completion_date'),
            'price_from' => $request->input('price_from'),
            'price_to' => $request->input('price_to'),
            'currency' => $request->input('currency'),
            'installment_information' => $request->input('installment_information'),
            'area_min' => $request->input('area_min'),
            'area_max' => $request->input('area_max'),
            'area_unit' => $request->input('area_unit'),
            'hero_heading' => $request->input('hero_heading'),
            'hero_description' => $request->input('hero_description'),
            'video_url' => $request->input('video_url'),
            'virtual_tour_url' => $request->input('virtual_tour_url'),
            'latitude' => $request->input('latitude'),
            'longitude' => $request->input('longitude'),
            'is_published' => $request->boolean('is_published'),
            'is_featured' => $request->boolean('is_featured'),
            'sort_order' => $request->input('sort_order'),
            'seo_title' => $request->input('seo_title'),
            'seo_description' => $request->input('seo_description'),
            'canonical_url' => $request->input('canonical_url'),
            'robots' => $request->input('robots'),
            'translations' => $this->sanitizeTranslations($translations),
            'sections' => $this->sanitizeSections($sections),
        ];
        if (array_key_exists('description', $data) && $data['description'] !== null) {
            $data['description'] = app(RichTextSanitizer::class)->sanitize($data['description']);
        }
        if (array_key_exists('installment_information', $data) && $data['installment_information'] !== null) {
            $data['installment_information'] = app(RichTextSanitizer::class)->sanitize($data['installment_information']);
        }
        $newAssets = [];
        try {
            DB::transaction(function () use ($request, $uploads, &$data, &$newAssets) {
                $data['hero_image_id'] = $this->uploadImage($request, $uploads, 'hero_image', 'projects/hero', $newAssets, $data['hero_image_id'] ?? null);
                $data['logo_id'] = $this->uploadImage($request, $uploads, 'logo', 'projects/logos', $newAssets, $data['logo_id'] ?? null);
                $data['brochure_id'] = $this->uploadBrochure($request, $uploads, 'brochure', 'projects/brochures', $newAssets, $data['brochure_id'] ?? null);
                $data['map_image_id'] = $this->uploadImage($request, $uploads, 'map_image', 'projects/maps', $newAssets, $data['map_image_id'] ?? null);
                $data['overview_image_id'] = $this->uploadImage($request, $uploads, 'overview_image', 'projects/overview', $newAssets, $data['overview_image_id'] ?? null);
                $data['masterplan_image_id'] = $this->uploadImage($request, $uploads, 'masterplan_image', 'projects/masterplan', $newAssets, $data['masterplan_image_id'] ?? null);
                $data['sections'] = $this->uploadConstructionImages($request, $uploads, $data['sections'], $newAssets);
                $data['sections'] = $this->uploadAmenityIcons($request, $uploads, $data['sections'], $newAssets);
                $data['sections'] = $this->uploadLocationImage($request, $uploads, $data['sections'], $newAssets);
                if ($data['is_published'] && empty($data['published_at'])) {
                    $data['published_at'] = now();
                }
                Project::create($data);
            });
        } catch (\Throwable $exception) {
            foreach ($newAssets as $asset) $uploads->delete($asset);
            throw $exception;
        }
        WebsiteCache::projectsIndex();
        WebsiteCache::sitemap();
        WebsiteCache::homepage();

        return to_route('admin.projects.index')->with('success', 'Project created.');
    }

    public function edit(Project $project): Response
    {
        $project->load(['category', 'heroImage', 'logo', 'brochure', 'mapImage', 'overviewImage', 'masterplanImage', 'statistics']);

        $hasSavedSections = ! empty($project->sections['en'] ?? []) || ! empty($project->sections['ar'] ?? []);

        if (! $hasSavedSections) {
            $sections = $this->legacySections($project->slug);
            $sections['stats'] = $project->statistics->map(fn ($stat) => [
                'value' => $stat->value,
                'label' => $stat->label,
                'note' => $stat->note ?? '',
            ])->values()->all();
            $project->sections = [
                'en' => $sections,
                'ar' => [],
            ];
        }

        return Inertia::render('Admin/Projects/Form', [
            'project' => $this->present($project, true),
            'categories' => ProjectCategory::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    private function legacySections(string $slug): array
    {
        $raw = PageSection::query()
            ->where('page_key', 'project-'.$slug)
            ->where('status', 'published')
            ->pluck('content_snapshot', 'section_key')
            ->all();

        return [
            'heroSlides' => array_map(fn (array $slide) => [
                ...$slide,
                'cta1Label' => $slide['cta1Label'] ?? 'Request pricing & payment plan',
                'cta1Url' => $slide['cta1Url'] ?? '#brochure',
                'cta2Label' => $slide['cta2Label'] ?? 'Download brochure',
                'cta2Url' => $slide['cta2Url'] ?? '#brochure',
            ], $raw['hero_slides']['items'] ?? []),
            'stats' => [],
            'overview' => $raw['overview'] ?? ['heading' => '', 'body' => ''],
            'masterplan' => $raw['masterplan'] ?? ['heading' => '', 'description' => '', 'brochureHeading' => '', 'brochureDescription' => ''],
            'virtualTour' => $raw['virtual_tour'] ?? ['heading' => '', 'description' => '', 'videoUrl' => ''],
            'cta' => $raw['cta'] ?? ['eyebrow' => '', 'heading' => '', 'whatsappNumber' => '', 'primaryCtaLabel' => '', 'secondaryCtaLabel' => ''],
            'homes3d' => $raw['homes3d'] ?? ['heading' => '', 'description' => '', 'note' => '', 'items' => []],
            'construction' => $raw['construction'] ?? ['heading' => '', 'description' => '', 'items' => []],
            'amenities' => $raw['amenities'] ?? ['heading' => '', 'categories' => []],
            'location' => $raw['location'] ?? ['heading' => '', 'description' => '', 'gateNote' => '', 'driveNote' => '', 'image' => null, 'nearbyLocations' => []],
        ];
    }

    public function update(UpdateProjectRequest $request, Project $project, MediaUploadService $uploads): RedirectResponse
    {
        $data = $request->validated();
        unset($data['hero_image'], $data['logo'], $data['brochure'], $data['map_image'], $data['overview_image'], $data['masterplan_image']);
        $data['translations'] = $this->sanitizeTranslations($data['translations'] ?? []);
        $data['sections'] = $this->sanitizeSections($data['sections'] ?? []);
        $data['is_published'] = $request->boolean('is_published');
        $data['is_featured'] = $request->boolean('is_featured');

        if (array_key_exists('description', $data) && $data['description'] !== null) {
            $data['description'] = app(RichTextSanitizer::class)->sanitize($data['description']);
        }
        if (array_key_exists('installment_information', $data) && $data['installment_information'] !== null) {
            $data['installment_information'] = app(RichTextSanitizer::class)->sanitize($data['installment_information']);
        }
        $oldHero = $project->heroImage;
        $oldLogo = $project->logo;
        $oldBrochure = $project->brochure;
        $oldMap = $project->mapImage;
        $oldOverview = $project->overviewImage;
        $oldMasterplan = $project->masterplanImage;
        $newAssets = [];
        try {
            DB::transaction(function () use ($request, $uploads, $project, &$data, &$newAssets) {
                $data['hero_image_id'] = $this->uploadImage($request, $uploads, 'hero_image', 'projects/hero', $newAssets, $project->hero_image_id);
                $data['logo_id'] = $this->uploadImage($request, $uploads, 'logo', 'projects/logos', $newAssets, $project->logo_id);
                $data['brochure_id'] = $this->uploadBrochure($request, $uploads, 'brochure', 'projects/brochures', $newAssets, $project->brochure_id);
                $data['map_image_id'] = $this->uploadImage($request, $uploads, 'map_image', 'projects/maps', $newAssets, $project->map_image_id);
                $data['overview_image_id'] = $this->uploadImage($request, $uploads, 'overview_image', 'projects/overview', $newAssets, $project->overview_image_id);
                $data['masterplan_image_id'] = $this->uploadImage($request, $uploads, 'masterplan_image', 'projects/masterplan', $newAssets, $project->masterplan_image_id);
                $data['sections'] = $this->uploadConstructionImages($request, $uploads, $data['sections'], $newAssets);
                $data['sections'] = $this->uploadAmenityIcons($request, $uploads, $data['sections'], $newAssets);
                $data['sections'] = $this->uploadLocationImage($request, $uploads, $data['sections'], $newAssets);
                if ($data['is_published'] && empty($project->published_at)) {
                    $data['published_at'] = now();
                }
                $project->update($data);
            });
        } catch (\Throwable $exception) {
            foreach ($newAssets as $asset) $uploads->delete($asset);
            throw $exception;
        }
        if ($request->hasFile('hero_image') && $oldHero) $uploads->deleteIfUnreferenced($oldHero);
        if ($request->hasFile('logo') && $oldLogo) $uploads->deleteIfUnreferenced($oldLogo);
        if ($request->hasFile('brochure') && $oldBrochure) $uploads->deleteIfUnreferenced($oldBrochure);
        if ($request->hasFile('map_image') && $oldMap) $uploads->deleteIfUnreferenced($oldMap);
        if ($request->hasFile('overview_image') && $oldOverview) $uploads->deleteIfUnreferenced($oldOverview);
        if ($request->hasFile('masterplan_image') && $oldMasterplan) $uploads->deleteIfUnreferenced($oldMasterplan);

        WebsiteCache::projectTree($project->slug);
        WebsiteCache::sitemap();
        WebsiteCache::homepage();

        return back()->with('success', 'Project updated.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $slug = $project->slug;
        $project->delete();
        WebsiteCache::projectTree($slug);
        WebsiteCache::sitemap();
        WebsiteCache::homepage();
        return back()->with('success', 'Project moved to trash.');
    }

    public function restore(int $project): RedirectResponse
    {
        $record = Project::withTrashed()->findOrFail($project);
        $record->restore();
        WebsiteCache::projectTree($record->slug);
        WebsiteCache::sitemap();
        WebsiteCache::homepage();
        return back()->with('success', 'Project restored.');
    }

    public function togglePublished(Project $project): RedirectResponse
    {
        $project->update([
            'is_published' => ! $project->is_published,
            'published_at' => ! $project->is_published ? now() : null,
        ]);
        WebsiteCache::projectTree($project->slug);
        WebsiteCache::sitemap();
        WebsiteCache::homepage();
        return back();
    }

    public function toggleFeatured(Project $project): RedirectResponse
    {
        $project->update(['is_featured' => ! $project->is_featured]);
        WebsiteCache::homepage();
        return back();
    }

    private function uploadImage(Request $request, MediaUploadService $uploads, string $field, string $folder, array &$newAssets, ?int $currentId): ?int
    {
        if ($request->hasFile($field)) {
            $asset = $uploads->storePublicImage($request->file($field), $folder);
            $newAssets[] = $asset;
            return $asset->id;
        }
        return $currentId;
    }

    private function sanitizeTranslations(array $translations): array
    {
        $sanitizer = app(RichTextSanitizer::class);
        foreach (['en', 'ar'] as $locale) {
            if (! isset($translations[$locale]) || ! is_array($translations[$locale])) {
                $translations[$locale] = [];
                continue;
            }
            foreach (['description', 'hero_description', 'installment_information'] as $key) {
                if (isset($translations[$locale][$key])) {
                    $translations[$locale][$key] = $sanitizer->sanitize($translations[$locale][$key]);
                }
            }
        }
        return $translations;
    }

    private function sanitizeSections(array $sections): array
    {
        $sanitizer = app(RichTextSanitizer::class);
        foreach (['en', 'ar'] as $locale) {
            if (! isset($sections[$locale]) || ! is_array($sections[$locale])) {
                $sections[$locale] = [];
                continue;
            }
            foreach (['overview.body', 'masterplan.description', 'virtualTour.description', 'homes3d.description', 'construction.description', 'location.description'] as $dot) {
                $parts = explode('.', $dot);
                if (isset($sections[$locale][$parts[0]][$parts[1]]) && is_string($sections[$locale][$parts[0]][$parts[1]])) {
                    $sections[$locale][$parts[0]][$parts[1]] = $sanitizer->sanitize($sections[$locale][$parts[0]][$parts[1]]);
                }
            }
        }
        return $sections;
    }

    private function uploadFile(Request $request, MediaUploadService $uploads, string $field, string $folder, array &$newAssets, ?int $currentId): ?int
    {
        if ($request->hasFile($field)) {
            $asset = $uploads->storePublicBrochure($request->file($field), $folder);
            $newAssets[] = $asset;
            return $asset->id;
        }
        return $currentId;
    }

    private function uploadBrochure(Request $request, MediaUploadService $uploads, string $field, string $folder, array &$newAssets, ?int $currentId): ?int
    {
        return $this->uploadFile($request, $uploads, $field, $folder, $newAssets, $currentId);
    }

    private function uploadConstructionImages(Request $request, MediaUploadService $uploads, ?array $sections, array &$newAssets): ?array
    {
        if (! is_array($sections)) {
            return $sections;
        }
        foreach (['en', 'ar'] as $locale) {
            if (! isset($sections[$locale]['construction']['items']) || ! is_array($sections[$locale]['construction']['items'])) {
                continue;
            }
            foreach ($sections[$locale]['construction']['items'] as $idx => &$item) {
                $field = "construction_image_{$idx}";
                if ($request->hasFile($field)) {
                    $asset = $uploads->storePublicImage($request->file($field), 'projects/construction');
                    $newAssets[] = $asset;
                    $item['image'] = $uploads->publicUrl($asset);
                }
            }
        }
        return $sections;
    }

    private function uploadAmenityIcons(Request $request, MediaUploadService $uploads, ?array $sections, array &$newAssets): ?array
    {
        if (! is_array($sections)) {
            return $sections;
        }
        foreach (['en', 'ar'] as $locale) {
            if (! isset($sections[$locale]['amenities']['categories']) || ! is_array($sections[$locale]['amenities']['categories'])) {
                continue;
            }
            foreach ($sections[$locale]['amenities']['categories'] as $ci => &$cat) {
                if (! isset($cat['items']) || ! is_array($cat['items'])) {
                    continue;
                }
                foreach ($cat['items'] as $ii => &$item) {
                    $field = "amenity_icon_{$ci}_{$ii}";
                    if ($request->hasFile($field)) {
                        $asset = $uploads->storePublicImage($request->file($field), 'projects/amenities');
                        $newAssets[] = $asset;
                        $item['icon'] = $uploads->publicUrl($asset);
                    }
                }
            }
        }
        return $sections;
    }

    private function uploadLocationImage(Request $request, MediaUploadService $uploads, ?array $sections, array &$newAssets): ?array
    {
        if (! is_array($sections)) {
            return $sections;
        }
        foreach (['en', 'ar'] as $locale) {
            if (! isset($sections[$locale]['location'])) {
                continue;
            }
            if ($request->hasFile('location_image')) {
                $asset = $uploads->storePublicImage($request->file('location_image'), 'projects/location');
                $newAssets[] = $asset;
                $sections[$locale]['location']['image'] = $uploads->publicUrl($asset);
            }
        }
        return $sections;
    }

    private function present(Project $project, bool $full = false): array
    {
        $base = [
            'id' => $project->id,
            'title' => $project->title,
            'slug' => $project->slug,
            'location' => $project->location,
            'project_type' => $project->project_type,
            'status' => $project->status,
            'is_published' => $project->is_published,
            'is_featured' => $project->is_featured,
            'sort_order' => $project->sort_order,
            'category' => $project->category?->name,
            'categoryId' => $project->project_category_id,
            'image' => WebsiteContent::assetUrl($project->heroImage),
            'published_at' => $project->published_at?->toDateTimeString(),
        ];
        if ($full) {
            $base['description'] = $project->description;
            $base['short_description'] = $project->short_description;
            $base['address'] = $project->address;
            $base['completion_date'] = $project->completion_date?->format('Y-m-d');
            $base['price_from'] = $project->price_from;
            $base['price_to'] = $project->price_to;
            $base['currency'] = $project->currency;
            $base['installment_information'] = $project->installment_information;
            $base['area_min'] = $project->area_min;
            $base['area_max'] = $project->area_max;
            $base['area_unit'] = $project->area_unit;
            $base['hero_heading'] = $project->hero_heading;
            $base['hero_description'] = $project->hero_description;
            $base['hero_image_id'] = $project->hero_image_id;
            $base['hero_image'] = WebsiteContent::assetUrl($project->heroImage);
            $base['logo_id'] = $project->logo_id;
            $base['logo'] = WebsiteContent::assetUrl($project->logo);
            $base['brochure_id'] = $project->brochure_id;
            $base['brochure'] = WebsiteContent::assetUrl($project->brochure);
            $base['video_url'] = $project->video_url;
            $base['virtual_tour_url'] = $project->virtual_tour_url;
            $base['map_image_id'] = $project->map_image_id;
            $base['map_image'] = WebsiteContent::assetUrl($project->mapImage);
            $base['overview_image_id'] = $project->overview_image_id;
            $base['overview_image'] = WebsiteContent::assetUrl($project->overviewImage);
            $base['masterplan_image_id'] = $project->masterplan_image_id;
            $base['masterplan_image'] = WebsiteContent::assetUrl($project->masterplanImage);
            $base['latitude'] = $project->latitude;
            $base['longitude'] = $project->longitude;
            $base['seo_title'] = $project->seo_title;
            $base['seo_description'] = $project->seo_description;
            $base['canonical_url'] = $project->canonical_url;
            $base['robots'] = $project->robots;
            $base['translations'] = $project->translations ?? ['en' => [], 'ar' => []];
            $base['sections'] = $project->sections ?? ['en' => [], 'ar' => []];
        }
        return $base;
    }
}
