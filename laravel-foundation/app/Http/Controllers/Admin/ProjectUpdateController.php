<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectUpdateRequest;
use App\Http\Requests\Admin\UpdateProjectUpdateRequest;
use App\Models\Project;
use App\Models\ProjectUpdate;
use App\Services\MediaUploadService;
use App\Services\RichTextSanitizer;
use App\Support\WebsiteCache;
use App\Support\WebsiteContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProjectUpdateController extends Controller
{
    public function index(Request $request): Response
    {
        $projectId = $request->integer('project');
        $items = ProjectUpdate::with(['project', 'media'])->when($projectId, fn ($q) => $q->where('project_id', $projectId))->orderBy('project_id')->orderByDesc('published_on')->orderBy('sort_order')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Projects/Updates/Index', [
            'items' => $items->through(fn ($item) => [
                'id' => $item->id,
                'project_id' => $item->project_id,
                'project' => $item->project?->title,
                'tag' => $item->tag,
                'title' => $item->title,
                'body' => $item->body,
                'published_on' => $item->published_on?->format('Y-m-d'),
                'sort_order' => $item->sort_order,
                'is_published' => $item->is_published,
                'image' => WebsiteContent::assetUrl($item->media),
            ])->values(),
            'projects' => Project::query()->orderBy('title')->get(['id', 'title']),
            'filters' => $request->only(['project']),
        ]);
    }

    public function store(StoreProjectUpdateRequest $request, MediaUploadService $uploads): RedirectResponse
    {
        $newAsset = null;
        try {
            DB::transaction(function () use ($request, $uploads, &$newAsset) {
                $data = $request->safe()->except('image');
                if (array_key_exists('body', $data) && $data['body'] !== null) {
                    $data['body'] = app(RichTextSanitizer::class)->sanitize($data['body']);
                }
                if ($request->hasFile('image')) {
                    $newAsset = $uploads->storePublicImage($request->file('image'), 'projects/updates');
                    $data['media_asset_id'] = $newAsset->id;
                }
                $data['is_published'] = $request->boolean('is_published');
                ProjectUpdate::create($data);
            });
        } catch (\Throwable $exception) {
            if ($newAsset) $uploads->delete($newAsset);
            throw $exception;
        }
        $this->flush($request->integer('project_id'));
        return back()->with('success', 'Update added.');
    }

    public function update(UpdateProjectUpdateRequest $request, ProjectUpdate $projectUpdate, MediaUploadService $uploads): RedirectResponse
    {
        $oldAsset = $projectUpdate->media;
        $newAsset = null;
        try {
            DB::transaction(function () use ($request, $uploads, $projectUpdate, &$newAsset) {
                $data = $request->safe()->except('image');
                if (array_key_exists('body', $data) && $data['body'] !== null) {
                    $data['body'] = app(RichTextSanitizer::class)->sanitize($data['body']);
                }
                if ($request->hasFile('image')) {
                    $newAsset = $uploads->storePublicImage($request->file('image'), 'projects/updates');
                    $data['media_asset_id'] = $newAsset->id;
                }
                $data['is_published'] = $request->boolean('is_published');
                $projectUpdate->update($data);
            });
        } catch (\Throwable $exception) {
            if ($newAsset) $uploads->delete($newAsset);
            throw $exception;
        }
        if ($request->hasFile('image') && $oldAsset) $uploads->deleteIfUnreferenced($oldAsset);
        $this->flush($projectUpdate->project_id);
        return back()->with('success', 'Update saved.');
    }

    public function destroy(ProjectUpdate $projectUpdate, MediaUploadService $uploads): RedirectResponse
    {
        $asset = $projectUpdate->media;
        $projectId = $projectUpdate->project_id;
        $projectUpdate->delete();
        if ($asset) $uploads->deleteIfUnreferenced($asset);
        $this->flush($projectId);
        return back()->with('success', 'Update removed.');
    }

    private function flush(int $projectId): void
    {
        $project = Project::find($projectId);
        if ($project) WebsiteCache::projectTree($project->slug);
        WebsiteCache::projectsIndex();
        WebsiteCache::sitemap();
    }
}
