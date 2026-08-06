<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBrochureRequest as StoreBrochureFormRequest;
use App\Http\Requests\StoreProjectInquiryRequest as StoreProjectInquiryFormRequest;
use App\Models\BrochureRequest;
use App\Models\PageSection;
use App\Models\Project;
use App\Models\ProjectInquiry;
use App\Services\FormNotificationContext;
use App\Services\FormSubmissionService;
use App\Services\SeoMetadataService;
use App\Support\WebsiteContent;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ProjectController extends Controller
{
    public function index(SeoMetadataService $seo): InertiaResponse
    {
        $project = Project::query()->with(['category', 'heroImage', 'logo', 'brochure', 'mapImage', 'galleries.media', 'statistics', 'unitTypes', 'amenities', 'updates.media', 'nearbyLocations'])->where('slug', 'klove-new-cairo')->firstOrFail();
        $raw = PageSection::query()->where('page_key', 'project-klove-new-cairo')->where('status', 'published')->pluck('content_snapshot', 'section_key')->all();
        $sections = ['heroSlides' => $raw['hero_slides']['items'], 'overview' => $raw['overview'], 'masterplan' => $raw['masterplan'], 'virtualTour' => $raw['virtual_tour'], 'cta' => $raw['cta'], 'homes3d' => $raw['homes3d'], 'construction' => $raw['construction'], 'amenities' => $raw['amenities'], 'location' => $raw['location']];
        return Inertia::render('Website/Projects/Index', ['project' => WebsiteContent::project($project), 'sections' => $sections, 'seo' => $seo->forPage('projects', '/projects', ['title' => 'Projects | LARZ Developments'], [
            $seo->breadcrumbs([['name' => 'Home', 'url' => url('/')], ['name' => 'Projects', 'url' => url('/projects')]]),
        ])]);
    }

    public function show(string $project, SeoMetadataService $seo): InertiaResponse
    {
        $record = Project::query()->with(['category', 'heroImage', 'logo', 'brochure', 'mapImage', 'galleries.media', 'statistics', 'unitTypes', 'amenities', 'updates.media', 'nearbyLocations'])->where('slug', $project)->where('is_published', true)->firstOrFail();
        $others = Project::query()->with('heroImage')->where('is_published', true)->whereKeyNot($record->id)->orderBy('sort_order')->get();
        $path = '/projects/'.$record->slug;
        $url = url($path);
        $projectSchema = $seo->projectSchema($record, $url);
        return Inertia::render('Website/Projects/Show', [
            'project' => WebsiteContent::project($record),
            'others' => $others->map(fn ($item) => ['slug' => $item->slug, 'title' => $item->title, 'location' => $item->location, 'image' => WebsiteContent::assetUrl($item->heroImage)])->values()->all(),
            'seo' => $seo->forProject($record, $path, array_filter([
                $seo->breadcrumbs([
                    ['name' => 'Home', 'url' => url('/')],
                    ['name' => 'Projects', 'url' => url('/projects')],
                    ['name' => $record->title, 'url' => $url],
                ]),
                $projectSchema,
            ])),
        ]);
    }

    public function submitInquiry(StoreProjectInquiryFormRequest $request, FormSubmissionService $submissions): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validated();
        $data['status'] = 'new';
        $data['assigned_to'] = null;
        if (! empty($data['consent_at'])) {
            $data['consent_at'] = \Illuminate\Support\Carbon::parse($data['consent_at']);
        }

        $submissions->record(new ProjectInquiry, $data, FormNotificationContext::projectInquiry());

        return back()->with('success', 'Thanks — your inquiry was submitted. A consultant will be in touch shortly.');
    }

    public function submitBrochure(StoreBrochureFormRequest $request, FormSubmissionService $submissions): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validated();
        $data['status'] = 'new';
        $data['assigned_to'] = null;

        $submissions->record(new BrochureRequest, $data, FormNotificationContext::brochure());

        return back()->with('success', 'Brochure request received — we will email it to you shortly.');
    }
}
