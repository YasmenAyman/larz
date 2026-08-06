<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectStatisticRequest;
use App\Http\Requests\Admin\UpdateProjectStatisticRequest;
use App\Models\Project;
use App\Models\ProjectStatistic;
use App\Support\WebsiteCache;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProjectStatisticController extends Controller
{
    public function index(Request $request): Response
    {
        $projectId = $request->integer('project');
        $items = ProjectStatistic::with('project')->when($projectId, fn ($q) => $q->where('project_id', $projectId))->orderBy('project_id')->orderBy('sort_order')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Projects/Statistics/Index', [
            'items' => $items->through(fn ($item) => [
                'id' => $item->id,
                'project_id' => $item->project_id,
                'project' => $item->project?->title,
                'value' => $item->value,
                'label' => $item->label,
                'note' => $item->note,
                'sort_order' => $item->sort_order,
                'is_active' => $item->is_active,
            ])->values(),
            'projects' => Project::query()->orderBy('title')->get(['id', 'title']),
            'filters' => $request->only(['project']),
        ]);
    }

    public function store(StoreProjectStatisticRequest $request): RedirectResponse
    {
        DB::transaction(fn () => ProjectStatistic::create([...$request->validated(), 'is_active' => $request->boolean('is_active')]));
        $this->flush($request->integer('project_id'));
        return back()->with('success', 'Statistic added.');
    }

    public function update(UpdateProjectStatisticRequest $request, ProjectStatistic $projectStatistic): RedirectResponse
    {
        DB::transaction(fn () => $projectStatistic->update([...$request->validated(), 'is_active' => $request->boolean('is_active')]));
        $this->flush($projectStatistic->project_id);
        return back()->with('success', 'Statistic updated.');
    }

    public function destroy(ProjectStatistic $projectStatistic): RedirectResponse
    {
        $projectId = $projectStatistic->project_id;
        $projectStatistic->delete();
        $this->flush($projectId);
        return back()->with('success', 'Statistic removed.');
    }

    private function flush(int $projectId): void
    {
        $project = Project::find($projectId);
        if ($project) WebsiteCache::projectTree($project->slug);
        WebsiteCache::projectsIndex();
        WebsiteCache::sitemap();
    }
}
