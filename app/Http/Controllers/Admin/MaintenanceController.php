<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateMaintenanceSettingsRequest;
use App\Models\SiteSetting;
use App\Support\WebsiteMaintenance;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/Maintenance/Edit', [
            'settings' => WebsiteMaintenance::settings(),
        ]);
    }

    public function update(UpdateMaintenanceSettingsRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $settings = [
            'maintenance.enabled' => [$request->boolean('enabled') ? '1' : '0', 'boolean'],
            'maintenance.title_en' => [$data['title_en'] ?? '', 'string'],
            'maintenance.message_en' => [$data['message_en'] ?? '', 'string'],
            'maintenance.title_ar' => [$data['title_ar'] ?? '', 'string'],
            'maintenance.message_ar' => [$data['message_ar'] ?? '', 'string'],
        ];

        DB::transaction(function () use ($settings): void {
            foreach ($settings as $key => [$value, $type]) {
                SiteSetting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $value, 'value_type' => $type, 'group_name' => 'maintenance'],
                );
            }
        });

        WebsiteMaintenance::clear();

        return back()->with('success', 'Maintenance settings updated.');
    }
}
