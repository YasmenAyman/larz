<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAdminSettingsRequest;
use App\Models\SiteSetting;
use App\Support\WebsiteCache;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function edit(): Response { return Inertia::render('Admin/Settings/Edit', ['settings' => SiteSetting::query()->orderBy('group_name')->orderBy('key')->get(['key', 'value', 'value_type', 'group_name', 'description'])]); }

    public function update(UpdateAdminSettingsRequest $request): RedirectResponse
    {
        $allowedKeys = SiteSetting::query()->pluck('key')->all();
        DB::transaction(function () use ($request, $allowedKeys) {
            foreach (array_intersect_key($request->input('settings', []), array_flip($allowedKeys)) as $key => $value) {
                SiteSetting::where('key', $key)->update(['value' => $value, 'updated_at' => now()]);
            }
        });
        WebsiteCache::settings();
        WebsiteCache::all();
        return back()->with('success', 'Global settings updated.');
    }
}
