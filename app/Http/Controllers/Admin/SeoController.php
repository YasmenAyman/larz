<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSeoMetadataRequest;
use App\Models\MediaPost;
use App\Models\Project;
use App\Models\SeoMetadata;
use App\Services\MediaUploadService;
use App\Services\SeoMetadataService;
use App\Support\WebsiteCache;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SeoController extends Controller
{
    public function index(SeoMetadataService $seo): Response
    {
        $entries = collect([
            ['target' => 'page-home', 'label' => 'Home', 'path' => '/'],
            ['target' => 'page-about', 'label' => 'About Us', 'path' => '/about-us'],
            ['target' => 'page-projects', 'label' => 'Projects listing', 'path' => '/projects'],
            ['target' => 'page-media', 'label' => 'Media page', 'path' => '/media'],
            ['target' => 'page-careers', 'label' => 'Careers', 'path' => '/careers'],
            ['target' => 'page-contact', 'label' => 'Contact Us', 'path' => '/contact-us'],
        ])->map(fn ($entry) => $this->entry($entry['target'], $entry['label'], $entry['path'], $seo));

        $entries = $entries->concat(Project::query()->orderBy('title')->get()->map(fn ($project) => $this->entry('project-'.$project->id, 'Project: '.$project->title, '/projects/'.$project->slug, $seo)));
        $entries = $entries->concat(MediaPost::query()->orderBy('title')->get()->map(fn ($post) => $this->entry('media-'.$post->id, 'Media: '.$post->title, '/media/'.$post->slug, $seo)));

        return Inertia::render('Admin/Seo/Index', ['entries' => $entries->values()->all()]);
    }

    public function update(UpdateSeoMetadataRequest $request, string $target, MediaUploadService $uploads): RedirectResponse
    {
        $pageKey = $this->pageKey($target);
        $data = $request->safe()->except('og_image');
        $data['indexable'] = $request->boolean('indexable');
        $data['followable'] = $request->boolean('followable');
        $record = SeoMetadata::query()->firstOrNew(['page_key' => $pageKey]);
        $oldImage = $record->ogImage;
        $newImage = null;

        try {
            DB::transaction(function () use ($request, $uploads, $data, $record, &$newImage) {
                if ($request->hasFile('og_image')) {
                    $newImage = $uploads->storePublicImage($request->file('og_image'), 'media/seo');
                    $data['og_image_id'] = $newImage->id;
                }
                $record->fill($data)->save();
            });
        } catch (\Throwable $exception) {
            if ($newImage) $uploads->delete($newImage);
            throw $exception;
        }

        if ($request->hasFile('og_image') && $oldImage) $uploads->deleteIfUnreferenced($oldImage);

        WebsiteCache::sitemap();
        if (str_starts_with($pageKey, 'project:')) {
            $projectId = (int) str_replace('project:', '', $pageKey);
            $project = Project::find($projectId);
            if ($project) WebsiteCache::project($project->slug);
        }
        if (str_starts_with($pageKey, 'media:')) {
            WebsiteCache::sitemap();
        }
        if (in_array($pageKey, ['home', 'about', 'media', 'careers', 'contact', 'projects'], true)) {
            WebsiteCache::sitemap();
        }

        return back()->with('success', 'SEO metadata updated.');
    }

    private function pageKey(string $target): string
    {
        if (str_starts_with($target, 'page-')) {
            $page = str_replace('page-', '', $target);
            abort_unless(in_array($page, app(SeoMetadataService::class)->staticPageKeys(), true), 404);
            return $page;
        }

        if (str_starts_with($target, 'project-')) {
            abort_unless(Project::query()->whereKey((int) str_replace('project-', '', $target))->exists(), 404);
            return 'project:'.(int) str_replace('project-', '', $target);
        }

        if (str_starts_with($target, 'media-')) {
            abort_unless(MediaPost::query()->whereKey((int) str_replace('media-', '', $target))->exists(), 404);
            return 'media:'.(int) str_replace('media-', '', $target);
        }

        abort(404);
    }

    private function entry(string $target, string $label, string $path, SeoMetadataService $seo): array
    {
        $metadata = SeoMetadata::query()->where('page_key', $this->pageKey($target))->first();
        $resolved = $seo->forPage($metadata?->page_key ?? $target, $path);

        return [
            'target' => $target,
            'label' => $label,
            'path' => $path,
            'seo_title' => $metadata?->seo_title ?? $resolved['title'],
            'meta_description' => $metadata?->meta_description ?? $resolved['description'],
            'canonical_url' => $metadata?->canonical_url ?? $resolved['canonical'],
            'og_title' => $metadata?->og_title ?? $resolved['og_title'],
            'og_description' => $metadata?->og_description ?? $resolved['og_description'],
            'og_image' => $metadata?->ogImage ? $seo->forPage($metadata->page_key, $path)['og_image'] : $resolved['og_image'],
            'indexable' => $metadata?->indexable ?? true,
            'followable' => $metadata?->followable ?? true,
        ];
    }
}
