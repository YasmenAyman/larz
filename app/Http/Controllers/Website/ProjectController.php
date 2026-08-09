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
        $projects = Project::query()->with(['heroImage', 'category'])->where('is_published', true)->orderBy('sort_order')->get();
        return Inertia::render('Website/Projects/Index', [
            'projects' => $projects->map(fn ($item) => [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug,
                'location' => $item->location,
                'shortDescription' => $item->short_description,
                'heroImage' => WebsiteContent::assetUrl($item->heroImage),
                'category' => $item->category?->name,
            ])->values()->all(),
            'seo' => $seo->forPage('projects', '/projects', ['title' => 'Projects | LARZ Developments'], [
                $seo->breadcrumbs([['name' => 'Home', 'url' => url('/')], ['name' => 'Projects', 'url' => url('/projects')]]),
            ]),
        ]);
    }

    public function show(string $project, SeoMetadataService $seo): InertiaResponse
    {
        $record = Project::query()->with(['category', 'heroImage', 'logo', 'brochure', 'mapImage', 'overviewImage', 'masterplanImage', 'galleries.media', 'statistics', 'unitTypes', 'amenities', 'updates.media', 'nearbyLocations'])->where('slug', $project)->where('is_published', true)->firstOrFail();
        $locale = app()->getLocale();
        $sections = $this->resolveSections($record, $locale);
        $path = '/projects/'.$record->slug;
        $url = url($path);
        $projectSchema = $seo->projectSchema($record, $url);
        return Inertia::render('Website/Projects/Show', [
            'project' => WebsiteContent::project($record),
            'sections' => $sections,
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

    private function resolveSections(Project $record, string $locale): array
    {
        $projectSections = $record->sections ?? [];
        $lang = $projectSections[$locale] ?? $projectSections['en'] ?? [];
        $defaults = [
            'heroSlides' => [],
            'stats' => [],
            'overview' => ['heading' => '', 'body' => ''],
            'masterplan' => ['heading' => '', 'description' => '', 'brochureHeading' => '', 'brochureDescription' => ''],
            'virtualTour' => ['heading' => '', 'description' => '', 'videoUrl' => ''],
            'cta' => ['eyebrow' => '', 'heading' => ''],
            'homes3d' => ['heading' => '', 'description' => '', 'note' => '', 'items' => []],
            'construction' => ['heading' => '', 'description' => '', 'items' => []],
            'amenities' => ['heading' => '', 'categories' => []],
            'location' => ['heading' => '', 'description' => '', 'gateNote' => '', 'driveNote' => '', 'image' => null, 'nearbyLocations' => []],
        ];

        if (! empty($lang)) {
            $resolved = array_replace_recursive($defaults, $lang);
            $resolved['heroSlides'] = $this->normalizeHeroSlides($resolved['heroSlides'], $record);
            return $resolved;
        }
        $raw = PageSection::query()->where('page_key', 'project-'.$record->slug)->where('status', 'published')->pluck('content_snapshot', 'section_key')->all();
        $resolved = [
            'heroSlides' => $raw['hero_slides']['items'] ?? [],
            'stats' => [],
            'overview' => $raw['overview'] ?? ['heading' => '', 'body' => ''],
            'masterplan' => $raw['masterplan'] ?? ['heading' => '', 'description' => '', 'brochureHeading' => '', 'brochureDescription' => ''],
            'virtualTour' => $raw['virtual_tour'] ?? ['heading' => '', 'description' => '', 'videoUrl' => ''],
            'cta' => $raw['cta'] ?? ['eyebrow' => '', 'heading' => ''],
            'homes3d' => $raw['homes3d'] ?? ['heading' => '', 'description' => '', 'note' => ''],
            'construction' => $raw['construction'] ?? ['heading' => '', 'description' => ''],
            'amenities' => $raw['amenities'] ?? ['heading' => '', 'categories' => []],
            'location' => $raw['location'] ?? ['heading' => '', 'description' => '', 'gateNote' => '', 'driveNote' => '', 'image' => null, 'nearbyLocations' => []],
        ];

        $resolved['heroSlides'] = $this->normalizeHeroSlides($resolved['heroSlides'], $record);
        return $resolved;
    }

    private function normalizeHeroSlides(array $slides, Project $record): array
    {
        if (empty($slides)) {
            $slides = [[
                'eyebrow' => $record->title.' — '.$record->location,
                'titleLine1' => $record->hero_heading ?: $record->title,
                'titleLine2' => '',
                'description' => $record->hero_description ?: $record->short_description,
            ]];
        }

        return array_map(fn (array $slide) => [
            ...$slide,
            'cta1Label' => $slide['cta1Label'] ?? 'Request pricing & payment plan',
            'cta1Url' => $slide['cta1Url'] ?? '#brochure',
            'cta2Label' => $slide['cta2Label'] ?? 'Download brochure',
            'cta2Url' => $slide['cta2Url'] ?? '#brochure',
        ], $slides);
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
