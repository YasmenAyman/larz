<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectGalleryRequest;
use App\Http\Requests\Admin\UpdateProjectGalleryRequest;
use App\Models\MediaAsset;
use App\Models\Project;
use App\Models\ProjectGallery;
use App\Services\MediaUploadService;
use App\Support\WebsiteCache;
use App\Support\WebsiteContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProjectGalleryController extends Controller
{
    public function index(Request $request): Response
    {
        $projectId = $request->integer('project');
        $items = ProjectGallery::with(['project', 'media'])->when($projectId, fn ($q) => $q->where('project_id', $projectId))->orderBy('project_id')->orderBy('sort_order')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Projects/Galleries/Index', [
            'items' => $items->through(fn ($item) => [
                'id' => $item->id,
                'project_id' => $item->project_id,
                'project' => $item->project?->title,
                'alt_text' => $item->alt_text,
                'caption' => $item->caption,
                'sort_order' => $item->sort_order,
                'is_published' => $item->is_published,
                'image' => WebsiteContent::assetUrl($item->media),
            ]),
            'projects' => Project::query()->orderBy('title')->get(['id', 'title']),
            'media' => MediaAsset::query()->where('disk', 'public')->orderByDesc('id')->limit(50)->get(['id', 'path', 'original_name']),
            'filters' => $request->only(['project']),
        ]);
    }

    public function store(StoreProjectGalleryRequest $request, MediaUploadService $uploads): RedirectResponse
    {
        $newAsset = null;
        try {
            DB::transaction(function () use ($request, $uploads, &$newAsset) {
                $data = $request->safe()->except('image');
                if ($request->hasFile('image')) {
                    $newAsset = $uploads->storePublicImage($request->file('image'), 'projects/gallery');
                    $data['media_asset_id'] = $newAsset->id;
                }
                $data['is_published'] = $request->boolean('is_published');
                ProjectGallery::create($data);
            });
        } catch (\Throwable $exception) {
            if ($newAsset) $uploads->delete($newAsset);
            throw $exception;
        }
        $this->flush($request->integer('project_id'));
        return back()->with('success', 'Gallery image added.');
    }

    public function update(UpdateProjectGalleryRequest $request, ProjectGallery $projectGallery, MediaUploadService $uploads): RedirectResponse
    {
        $oldAsset = $projectGallery->media;
        $newAsset = null;
        try {
            DB::transaction(function () use ($request, $uploads, $projectGallery, &$newAsset) {
                $data = $request->safe()->except('image');
                if ($request->hasFile('image')) {
                    $newAsset = $uploads->storePublicImage($request->file('image'), 'projects/gallery');
                    $data['media_asset_id'] = $newAsset->id;
                }
                $data['is_published'] = $request->boolean('is_published');
                $projectGallery->update($data);
            });
        } catch (\Throwable $exception) {
            if ($newAsset) $uploads->delete($newAsset);
            throw $exception;
        }
        if ($request->hasFile('image') && $oldAsset) $uploads->deleteIfUnreferenced($oldAsset);
        $this->flush($projectGallery->project_id);
        return back()->with('success', 'Gallery image updated.');
    }

    public function destroy(ProjectGallery $projectGallery, MediaUploadService $uploads): RedirectResponse
    {
        $asset = $projectGallery->media;
        $projectId = $projectGallery->project_id;
        $projectGallery->delete();
        if ($asset) $uploads->deleteIfUnreferenced($asset);
        $this->flush($projectId);
        return back()->with('success', 'Gallery image removed.');
    }

    private function flush(int $projectId): void
    {
        $project = Project::find($projectId);
        if ($project) WebsiteCache::projectTree($project->slug);
        WebsiteCache::projectsIndex();
        WebsiteCache::sitemap();
    }
}
