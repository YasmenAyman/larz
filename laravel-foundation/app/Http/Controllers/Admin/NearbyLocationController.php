<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreNearbyLocationRequest;
use App\Http\Requests\Admin\UpdateNearbyLocationRequest;
use App\Models\NearbyLocation;
use App\Models\Project;
use App\Support\WebsiteCache;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class NearbyLocationController extends Controller
{
    public function index(Request $request): Response
    {
        $projectId = $request->integer('project');
        $items = NearbyLocation::with('project')->when($projectId, fn ($q) => $q->where('project_id', $projectId))->orderBy('project_id')->orderBy('sort_order')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Projects/Nearby/Index', [
            'items' => $items->through(fn ($item) => [
                'id' => $item->id,
                'project_id' => $item->project_id,
                'project' => $item->project?->title,
                'place' => $item->place,
                'time_label' => $item->time_label,
                'distance_km' => $item->distance_km,
                'sort_order' => $item->sort_order,
                'is_active' => $item->is_active,
            ])->values(),
            'projects' => Project::query()->orderBy('title')->get(['id', 'title']),
            'filters' => $request->only(['project']),
        ]);
    }

    public function store(StoreNearbyLocationRequest $request): RedirectResponse
    {
        DB::transaction(fn () => NearbyLocation::create([...$request->validated(), 'is_active' => $request->boolean('is_active')]));
        $this->flush($request->integer('project_id'));
        return back()->with('success', 'Nearby location added.');
    }

    public function update(UpdateNearbyLocationRequest $request, NearbyLocation $nearbyLocation): RedirectResponse
    {
        DB::transaction(fn () => $nearbyLocation->update([...$request->validated(), 'is_active' => $request->boolean('is_active')]));
        $this->flush($nearbyLocation->project_id);
        return back()->with('success', 'Nearby location updated.');
    }

    public function destroy(NearbyLocation $nearbyLocation): RedirectResponse
    {
        $projectId = $nearbyLocation->project_id;
        $nearbyLocation->delete();
        $this->flush($projectId);
        return back()->with('success', 'Nearby location removed.');
    }

    private function flush(int $projectId): void
    {
        $project = Project::find($projectId);
        if ($project) WebsiteCache::projectTree($project->slug);
        WebsiteCache::projectsIndex();
        WebsiteCache::sitemap();
    }
}
