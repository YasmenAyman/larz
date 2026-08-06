<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateInquiryRequest;
use App\Models\ContactInquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactInquiryController extends Controller
{
    public function index(Request $request): Response
    {
        $inquiries = ContactInquiry::query()
            ->with(['project', 'assignee'])
            ->when($request->string('search')->isNotEmpty(), fn ($q) => $q->where(function ($q) use ($request) {
                $term = '%'.$request->string('search').'%';
                $q->where('name', 'like', $term)->orWhere('email', 'like', $term)->orWhere('phone', 'like', $term);
            }))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->orderByDesc('created_at')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('Admin/Leads/Contact/Index', [
            'inquiries' => $inquiries->through(fn ($item) => [
                'id' => $item->id,
                'name' => $item->name,
                'email' => $item->email,
                'phone' => $item->phone,
                'project' => $item->project?->title,
                'status' => $item->status,
                'assigned_to' => $item->assignee?->name,
                'source' => $item->source,
                'source_url' => $item->source_url,
                'created_at' => $item->created_at?->toDateTimeString(),
            ]),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function update(UpdateInquiryRequest $request, ContactInquiry $contactInquiry): RedirectResponse
    {
        $data = $request->validated();
        $data['assigned_to'] = $data['assigned_to'] ?? null;
        $contactInquiry->update($data);

        return back()->with('success', 'Contact inquiry updated.');
    }
}