<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectRequest;
use App\Http\Requests\Admin\UpdateProjectRequest;
use App\Models\MediaAsset;
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
            'projects' => $projects->through(fn (Project $project) => $this->present($project))->values(),
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
        $data = $request->safe()->except(['hero_image', 'logo', 'brochure', 'map_image']);
        $data['is_published'] = $request->boolean('is_published');
        $data['is_featured'] = $request->boolean('is_featured');
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
        $project->load(['category', 'heroImage', 'logo', 'brochure', 'mapImage']);

        return Inertia::render('Admin/Projects/Form', [
            'project' => $this->present($project, true),
            'categories' => ProjectCategory::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project, MediaUploadService $uploads): RedirectResponse
    {
        $data = $request->safe()->except(['hero_image', 'logo', 'brochure', 'map_image']);
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
        $newAssets = [];
        try {
            DB::transaction(function () use ($request, $uploads, $project, &$data, &$newAssets) {
                $data['hero_image_id'] = $this->uploadImage($request, $uploads, 'hero_image', 'projects/hero', $newAssets, $project->hero_image_id);
                $data['logo_id'] = $this->uploadImage($request, $uploads, 'logo', 'projects/logos', $newAssets, $project->logo_id);
                $data['brochure_id'] = $this->uploadBrochure($request, $uploads, 'brochure', 'projects/brochures', $newAssets, $project->brochure_id);
                $data['map_image_id'] = $this->uploadImage($request, $uploads, 'map_image', 'projects/maps', $newAssets, $project->map_image_id);
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
            $base['latitude'] = $project->latitude;
            $base['longitude'] = $project->longitude;
            $base['seo_title'] = $project->seo_title;
            $base['seo_description'] = $project->seo_description;
            $base['canonical_url'] = $project->canonical_url;
            $base['robots'] = $project->robots;
        }
        return $base;
    }
}
