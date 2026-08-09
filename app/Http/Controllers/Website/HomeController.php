<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Models\PhotoGalleryItem;
use App\Models\Project;
use App\Models\Testimonial;
use App\Support\LocalizedContent;
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

        $heroRaw = WebsiteContent::section('home', 'hero');
        $hero = [
            'heading' => $heroRaw['heading'] ?? 'Designed for\nthe Way You Live',
            'description' => $heroRaw['description'] ?? '',
            'cta_label' => $heroRaw['cta_label'] ?? $heroRaw['primary_cta_label'] ?? "Our Project's",
            'cta_url' => $heroRaw['cta_url'] ?? $heroRaw['primary_cta_url'] ?? '/projects',
            'heroImage' => asset('assets/tower_img.png'),
        ];

        return Inertia::render('Website/Home/Index', [
            'hero' => $hero,
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
                'heroImage' => WebsiteContent::assetUrl($project->heroImage),
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
            'testimonialSettings' => LocalizedContent::section(WebsiteContent::section('home', 'testimonials')),
            'testimonials' => $testimonials->map(fn ($item) => array_merge([
                'name' => $item->name,
                'role' => $item->role,
                'quote' => $item->quote,
                'image' => WebsiteContent::assetUrl($item->media),
            ], LocalizedContent::record($item, ['name', 'role', 'quote'])))->values()->all(),
            'seo' => $seo->forPage('home', '/', ['title' => 'LARZ Developments | Designed for the Way You Live'], [
                $seo->breadcrumbs([['name' => 'Home', 'url' => url('/')]]),
            ]),
        ]);
    }
}
