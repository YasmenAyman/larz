<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAdminNavigationRequest;
use App\Models\NavigationItem;
use App\Support\WebsiteCache;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class NavigationController extends Controller
{
    public function index(): Response { return Inertia::render('Admin/Navigation/Index', ['items' => NavigationItem::query()->orderBy('location')->orderBy('sort_order')->get(['id', 'label', 'url', 'location', 'sort_order', 'is_active'])]); }
    public function update(UpdateAdminNavigationRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) { foreach ($request->validated('items') as $item) { NavigationItem::whereKey($item['id'])->update(collect($item)->except('id')->all()); } });
        WebsiteCache::navigation();
        WebsiteCache::sitemap();
        return back()->with('success', 'Navigation updated.');
    }
}
