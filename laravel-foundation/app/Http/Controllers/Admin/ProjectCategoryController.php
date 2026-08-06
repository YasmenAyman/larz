<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectCategoryRequest;
use App\Http\Requests\Admin\UpdateProjectCategoryRequest;
use App\Models\ProjectCategory;
use App\Support\WebsiteCache;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProjectCategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Projects/Categories/Index', [
            'categories' => ProjectCategory::withCount('projects')->orderBy('name')->get(['id', 'name', 'slug', 'is_active', 'description']),
        ]);
    }

    public function store(StoreProjectCategoryRequest $request): RedirectResponse
    {
        DB::transaction(fn () => ProjectCategory::create($request->validated()));
        WebsiteCache::projectsIndex();
        WebsiteCache::sitemap();
        return back()->with('success', 'Category created.');
    }

    public function update(UpdateProjectCategoryRequest $request, ProjectCategory $projectCategory): RedirectResponse
    {
        DB::transaction(fn () => $projectCategory->update($request->validated()));
        WebsiteCache::projectsIndex();
        WebsiteCache::sitemap();
        return back()->with('success', 'Category updated.');
    }

    public function destroy(ProjectCategory $projectCategory): RedirectResponse
    {
        $projectCategory->delete();
        WebsiteCache::projectsIndex();
        WebsiteCache::sitemap();
        return back()->with('success', 'Category deleted.');
    }
}
