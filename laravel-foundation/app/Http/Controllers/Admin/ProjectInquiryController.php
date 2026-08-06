<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateInquiryRequest;
use App\Models\ProjectInquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectInquiryController extends Controller
{
    public function index(Request $request): Response
    {
        $inquiries = ProjectInquiry::query()
            ->with(['project', 'unitType', 'assignee'])
            ->when($request->string('search')->isNotEmpty(), fn ($q) => $q->where(function ($q) use ($request) {
                $term = '%'.$request->string('search').'%';
                $q->where('name', 'like', $term)->orWhere('email', 'like', $term)->orWhere('phone', 'like', $term);
            }))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->orderByDesc('created_at')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('Admin/Leads/Project/Index', [
            'inquiries' => $inquiries->through(fn ($item) => [
                'id' => $item->id,
                'name' => $item->name,
                'email' => $item->email,
                'phone' => $item->phone,
                'project' => $item->project?->title,
                'unit_type' => $item->unitType?->name,
                'preferred_contact_method' => $item->preferred_contact_method,
                'status' => $item->status,
                'assigned_to' => $item->assignee?->name,
                'source' => $item->source,
                'source_url' => $item->source_url,
                'created_at' => $item->created_at?->toDateTimeString(),
            ]),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function update(UpdateInquiryRequest $request, ProjectInquiry $projectInquiry): RedirectResponse
    {
        $data = $request->validated();
        $data['assigned_to'] = $data['assigned_to'] ?? null;
        $projectInquiry->update($data);

        return back()->with('success', 'Project inquiry updated.');
    }
}