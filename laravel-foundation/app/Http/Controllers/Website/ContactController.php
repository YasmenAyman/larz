<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactInquiryRequest;
use App\Models\ContactInquiry;
use App\Services\FormNotificationContext;
use App\Services\FormSubmissionService;
use App\Support\WebsiteContent;
use App\Services\SeoMetadataService;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(SeoMetadataService $seo): Response
    {
        $settings = \App\Models\SiteSetting::query()->whereIn('key', ['contact.phone', 'contact.email', 'contact.address', 'social.instagram', 'social.facebook', 'social.linkedin'])->pluck('value', 'key');
        $social = [
            'instagram' => $settings['social.instagram'] ?? null,
            'facebook' => $settings['social.facebook'] ?? null,
            'linkedin' => $settings['social.linkedin'] ?? null,
        ];
        return Inertia::render('Website/Contact/Index', [
            'contact' => ['phone' => $settings['contact.phone'] ?? null, 'email' => $settings['contact.email'] ?? null, 'address' => $settings['contact.address'] ?? null],
            'projects' => \App\Models\Project::query()->where('is_published', true)->orderBy('sort_order')->get(['id', 'title'])->map(fn ($project) => ['id' => $project->id, 'title' => $project->title])->values()->all(),
            'hero' => WebsiteContent::section('contact', 'hero'),
            'location' => WebsiteContent::section('contact', 'location'),
            'social' => $social,
            'seo' => $seo->forPage('contact', '/contact-us', ['title' => 'Contact | LARZ Developments'], [
                $seo->breadcrumbs([['name' => 'Home', 'url' => url('/')], ['name' => 'Contact Us', 'url' => url('/contact-us')]]),
            ]),
        ]);
    }

    public function submit(StoreContactInquiryRequest $request, FormSubmissionService $submissions): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validated();
        $data['status'] = 'new';
        $data['assigned_to'] = null;
        if (! empty($data['consent_at'])) {
            $data['consent_at'] = \Illuminate\Support\Carbon::parse($data['consent_at']);
        }

        $submissions->record(new ContactInquiry, $data, FormNotificationContext::contact());

        return back()->with('success', 'Thanks — we received your request and will reply within one business day.');
    }
}
