<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectAmenityRequest;
use App\Http\Requests\Admin\UpdateProjectAmenityRequest;
use App\Models\Project;
use App\Models\ProjectAmenity;
use App\Support\WebsiteCache;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProjectAmenityController extends Controller
{
    public function index(Request $request): Response
    {
        $projectId = $request->integer('project');
        $items = ProjectAmenity::with('project')->when($projectId, fn ($q) => $q->where('project_id', $projectId))->orderBy('project_id')->orderBy('sort_order')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Projects/Amenities/Index', [
            'items' => $items->through(fn ($item) => [
                'id' => $item->id,
                'project_id' => $item->project_id,
                'project' => $item->project?->title,
                'group_name' => $item->group_name,
                'icon_key' => $item->icon_key,
                'title' => $item->title,
                'description' => $item->description,
                'sort_order' => $item->sort_order,
                'is_active' => $item->is_active,
            ]),
            'projects' => Project::query()->orderBy('title')->get(['id', 'title']),
            'filters' => $request->only(['project']),
        ]);
    }

    public function store(StoreProjectAmenityRequest $request): RedirectResponse
    {
        DB::transaction(fn () => ProjectAmenity::create([...$request->validated(), 'is_active' => $request->boolean('is_active')]));
        $this->flush($request->integer('project_id'));
        return back()->with('success', 'Amenity added.');
    }

    public function update(UpdateProjectAmenityRequest $request, ProjectAmenity $projectAmenity): RedirectResponse
    {
        DB::transaction(fn () => $projectAmenity->update([...$request->validated(), 'is_active' => $request->boolean('is_active')]));
        $this->flush($projectAmenity->project_id);
        return back()->with('success', 'Amenity updated.');
    }

    public function destroy(ProjectAmenity $projectAmenity): RedirectResponse
    {
        $projectId = $projectAmenity->project_id;
        $projectAmenity->delete();
        $this->flush($projectId);
        return back()->with('success', 'Amenity removed.');
    }

    private function flush(int $projectId): void
    {
        $project = Project::find($projectId);
        if ($project) WebsiteCache::projectTree($project->slug);
        WebsiteCache::projectsIndex();
        WebsiteCache::sitemap();
    }
}
