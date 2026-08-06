<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAwardRequest;
use App\Http\Requests\Admin\UpdateAwardRequest;
use App\Models\Award;
use App\Support\WebsiteCache;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AwardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Content/Awards/Index', [
            'awards' => Award::query()->orderBy('sort_order')->orderBy('id')->get()->map(fn (Award $award) => $this->present($award))->values()->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Content/Awards/Form', ['award' => null]);
    }

    public function store(StoreAwardRequest $request): RedirectResponse
    {
        $data = $request->safe()->all();
        $data['is_published'] = $request->boolean('is_published');
        Award::create($data);
        WebsiteCache::section('about', 'awards');

        return to_route('admin.pages.about.awards.edit')->with('success', 'Award created.');
    }

    public function edit(Award $award): Response
    {
        return Inertia::render('Admin/Content/Awards/Form', [
            'award' => $this->present($award),
        ]);
    }

    public function update(UpdateAwardRequest $request, Award $award): RedirectResponse
    {
        $data = $request->safe()->all();
        $data['is_published'] = $request->boolean('is_published');
        $award->update($data);
        WebsiteCache::section('about', 'awards');

        return to_route('admin.pages.about.awards.edit')->with('success', 'Award updated.');
    }

    public function destroy(Award $award): RedirectResponse
    {
        $award->delete();
        WebsiteCache::section('about', 'awards');

        return back()->with('success', 'Award deleted.');
    }

    public function togglePublished(Award $award): RedirectResponse
    {
        $award->update(['is_published' => ! $award->is_published]);
        WebsiteCache::section('about', 'awards');

        return back()->with('success', 'Award visibility updated.');
    }

    private function present(Award $award): array
    {
        return [
            'id' => $award->id,
            'title' => $award->title,
            'year' => $award->year,
            'description' => $award->description,
            'icon_key' => $award->icon_key,
            'sort_order' => $award->sort_order,
            'is_published' => $award->is_published,
        ];
    }
}