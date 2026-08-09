<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectUnitTypeRequest;
use App\Http\Requests\Admin\UpdateProjectUnitTypeRequest;
use App\Models\Project;
use App\Models\ProjectUnitType;
use App\Support\WebsiteCache;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProjectUnitTypeController extends Controller
{
    public function index(Request $request): Response
    {
        $projectId = $request->integer('project');
        $items = ProjectUnitType::with('project')->when($projectId, fn ($q) => $q->where('project_id', $projectId))->orderBy('project_id')->orderBy('sort_order')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Projects/UnitTypes/Index', [
            'items' => $items->through(fn ($item) => [
                'id' => $item->id,
                'project_id' => $item->project_id,
                'project' => $item->project?->title,
                'tag' => $item->tag,
                'name' => $item->name,
                'size_min' => $item->size_min,
                'size_max' => $item->size_max,
                'size_unit' => $item->size_unit,
                'sort_order' => $item->sort_order,
                'is_published' => $item->is_published,
            ]),
            'projects' => Project::query()->orderBy('title')->get(['id', 'title']),
            'filters' => $request->only(['project']),
        ]);
    }

    public function store(StoreProjectUnitTypeRequest $request): RedirectResponse
    {
        DB::transaction(fn () => ProjectUnitType::create([...$request->validated(), 'is_published' => $request->boolean('is_published')]));
        $this->flush($request->integer('project_id'));
        return back()->with('success', 'Unit type added.');
    }

    public function update(UpdateProjectUnitTypeRequest $request, ProjectUnitType $projectUnitType): RedirectResponse
    {
        DB::transaction(fn () => $projectUnitType->update([...$request->validated(), 'is_published' => $request->boolean('is_published')]));
        $this->flush($projectUnitType->project_id);
        return back()->with('success', 'Unit type updated.');
    }

    public function destroy(ProjectUnitType $projectUnitType): RedirectResponse
    {
        $projectId = $projectUnitType->project_id;
        $projectUnitType->delete();
        $this->flush($projectId);
        return back()->with('success', 'Unit type removed.');
    }

    private function flush(int $projectId): void
    {
        $project = Project::find($projectId);
        if ($project) WebsiteCache::projectTree($project->slug);
        WebsiteCache::projectsIndex();
        WebsiteCache::sitemap();
    }
}
