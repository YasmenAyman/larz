<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMediaCategoryRequest;
use App\Http\Requests\Admin\UpdateMediaCategoryRequest;
use App\Models\MediaCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class MediaCategoryController extends Controller
{
    public function index(): Response { return Inertia::render('Admin/Media/Categories/Index', ['categories' => MediaCategory::withCount('posts')->orderBy('name')->get()]); }
    public function store(StoreMediaCategoryRequest $request): RedirectResponse { DB::transaction(fn () => MediaCategory::create($request->validated())); return back()->with('success', 'Media category created.'); }
    public function update(UpdateMediaCategoryRequest $request, MediaCategory $mediaCategory): RedirectResponse { DB::transaction(fn () => $mediaCategory->update($request->validated())); return back()->with('success', 'Media category updated.'); }
    public function destroy(MediaCategory $mediaCategory): RedirectResponse { $mediaCategory->delete(); return back()->with('success', 'Media category deleted.'); }
}
