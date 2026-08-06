<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Models\PhotoGalleryItem;
use App\Models\Project;
use App\Models\Testimonial;
use App\Support\WebsiteContent;
use App\Services\SeoMetadataService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(SeoMetadataService $seo): Response
    {
        $featuredSettings = WebsiteContent::section('home', 'featured_projects');
        $allProjects = Project::query()->with([
            'category', 'heroImage', 'logo', 'brochure', 'mapImage', 'galleries.media',
            'statistics', 'unitTypes', 'amenities', 'updates.media', 'nearbyLocations',
        ])->where('is_published', true)->orderBy('sort_order')->get();
        $selectedProjectIds = array_values(array_map('intval', $featuredSettings['project_ids'] ?? []));
        $projects = $selectedProjectIds === [] ? $allProjects->where('is_featured', true)->values() : collect($selectedProjectIds)->map(fn ($id) => $allProjects->firstWhere('id', $id))->filter()->values();
        $gallery = PhotoGalleryItem::query()->with('media')->where('is_published', true)->orderBy('sort_order')->get();
        $gallerySettings = WebsiteContent::section('home', 'gallery');
        $testimonialSettings = WebsiteContent::section('home', 'testimonials');
        $testimonials = Testimonial::query()->with('media')->where('is_published', true)->orderBy('sort_order')->get();
        $finalCtaSettings = WebsiteContent::section('home', 'final_cta');

        return Inertia::render('Website/Home/Index', [
            'hero' => [...WebsiteContent::section('home', 'hero'), 'heroImage' => asset('assets/tower_img.png')],
            'stats' => collect(WebsiteContent::section('home', 'stats')['items'] ?? [
                ['value' => '40+', 'label' => 'Experience'],
                ['value' => '60+', 'label' => 'Projects'],
                ['value' => '15k', 'label' => 'Clients'],
                ['value' => '2', 'label' => 'Countries'],
            ])->take(4)->map(fn ($stat) => ['value' => (string) ($stat['value'] ?? ''), 'label' => (string) ($stat['label'] ?? '')])->values()->all(),
            'projects' => $projects->map(fn ($project) => [
                'slug' => $project->slug,
                'title' => $project->title,
                'location' => $project->location,
                'image' => WebsiteContent::assetUrl($project->heroImage),
            ])->values()->all(),
            'featuredProjectsSettings' => [
                'eyebrow' => $featuredSettings['eyebrow'] ?? 'Featured Projects',
                'heading' => $featuredSettings['heading'] ?? 'Our Signature Developments',
                'description' => $featuredSettings['description'] ?? 'Discover a curated selection of our most prestigious projects, designed to elevate the standard of modern living.',
                'cta_label' => $featuredSettings['cta_label'] ?? 'Explore All',
                'cta_url' => $featuredSettings['cta_url'] ?? '/projects',
            ],
            'gallery' => $gallery->map(fn ($item) => WebsiteContent::assetUrl($item->media))->filter()->values()->all(),
            'gallerySettings' => [
                'eyebrow' => $gallerySettings['eyebrow'] ?? 'Our Gallery',
                'heading' => $gallerySettings['heading'] ?? 'Spaces That Inspire',
                'description' => $gallerySettings['description'] ?? 'A glimpse into the details, designs, and destinations that define the LARZ experience.',
                'cta_label' => $gallerySettings['cta_label'] ?? 'Explore All',
                'cta_url' => $gallerySettings['cta_url'] ?? '/projects',
            ],
            'testimonialSettings' => [
                'eyebrow' => $testimonialSettings['eyebrow'] ?? 'Testimonials',
                'heading' => $testimonialSettings['heading'] ?? 'Built on Trust. Proven by Experience.',
                'description' => $testimonialSettings['description'] ?? "Our clients' satisfaction reflects our commitment to delivering thoughtfully designed developments and exceptional service.",
            ],
            'testimonials' => $testimonials->map(fn ($item) => [
                'quote' => $item->quote,
                'name' => $item->name,
                'role' => $item->role,
                'image' => WebsiteContent::assetUrl($item->media),
            ])->values()->all(),
            'finalCta' => [
                'eyebrow' => $finalCtaSettings['eyebrow'] ?? "LET'S TALK",
                'heading' => $finalCtaSettings['heading'] ?? "Let's Build\nThe Future Together",
                'cta_label' => $finalCtaSettings['cta_label'] ?? 'Get In Touch',
                'cta_url' => $finalCtaSettings['cta_url'] ?? '/contact-us',
            ],
            'seo' => $seo->forPage('home', '/', ['title' => 'LARZ Developments | Designed for the Way You Live'], [
                $seo->breadcrumbs([['name' => 'Home', 'url' => url('/')]]),
            ]),
        ]);
    }
}
