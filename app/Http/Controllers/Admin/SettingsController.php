<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAdminSettingsRequest;
use App\Models\SiteSetting;
use App\Services\MediaUploadService;
use App\Support\WebsiteCache;
use App\Support\WebsiteContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function edit(): Response
    {
        $settings = SiteSetting::query()->orderBy('group_name')->orderBy('key')->get(['key', 'value', 'value_type', 'group_name', 'description']);
        $brand = $settings->whereIn('key', ['brand.logo', 'brand.favicon'])->pluck('value', 'key')->all();

        return Inertia::render('Admin/Settings/Edit', [
            'settings' => $settings->whereNotIn('key', ['brand.logo', 'brand.favicon'])->values(),
            'brand' => $brand,
        ]);
    }

    public function update(UpdateAdminSettingsRequest $request, MediaUploadService $uploads): RedirectResponse
    {
        $allowedKeys = SiteSetting::query()->pluck('key')->all();
        DB::transaction(function () use ($request, $uploads, $allowedKeys) {
            foreach (array_intersect_key($request->input('settings', []), array_flip($allowedKeys)) as $key => $value) {
                SiteSetting::where('key', $key)->update(['value' => $value, 'updated_at' => now()]);
            }

            foreach (['brand.logo' => 'logo', 'brand.favicon' => 'favicon'] as $key => $field) {
                if (! $request->hasFile($field)) {
                    continue;
                }
                $asset = $uploads->storePublicImage($request->file($field), 'brand');
                SiteSetting::where('key', $key)->update(['value' => WebsiteContent::assetUrl($asset), 'updated_at' => now()]);
            }
        });
        WebsiteCache::settings();
        WebsiteCache::all();
        return back()->with('success', 'Global settings updated.');
    }
}
