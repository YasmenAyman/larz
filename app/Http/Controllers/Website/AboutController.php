<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Models\Award;
use App\Models\Partner;
use App\Models\MediaAsset;
use App\Support\LocalizedContent;
use App\Support\WebsiteContent;
use App\Services\SeoMetadataService;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function __invoke(SeoMetadataService $seo): Response
    {
        $hero = WebsiteContent::section('about', 'hero');
        $legacyHeroBackground = $hero['background_image'] ?? null;
        $heroBackground = ! empty($hero['background_image_id'])
            ? WebsiteContent::assetUrl(MediaAsset::find($hero['background_image_id']))
            : asset($legacyHeroBackground === 'assets/TYPE-B-IMAGE-01.png' ? 'assets/about-hero-optimized.jpg' : ($legacyHeroBackground ?? 'assets/about-hero-optimized.jpg'));
        $story = WebsiteContent::section('about', 'story');
        $awardsSection = LocalizedContent::section(WebsiteContent::section('about', 'awards'));
        $promiseSection = LocalizedContent::section(WebsiteContent::section('about', 'promise'));
        return Inertia::render('Website/About/Index', [
            'hero' => [...$hero, 'backgroundImage' => $heroBackground],
            'stats' => WebsiteContent::section('about', 'stats')['items'] ?? [],
            'story' => [...$story, 'image' => ! empty($story['image_id']) ? WebsiteContent::assetUrl(MediaAsset::find($story['image_id'])) : asset($story['image'] ?? 'assets/IMAGE-01-RENDERED-1.png')],
            'awards' => [
                'eyebrow' => $awardsSection['eyebrow'] ?? 'Awards & achievements',
                'heading' => $awardsSection['heading'] ?? 'Recognised for building things that last.',
                'items' => Award::query()->where('is_published', true)->orderBy('sort_order')->get()->map(function ($award) {
                    $localized = LocalizedContent::record($award, ['title', 'description']);

                    return [
                        'title' => $localized['title'] ?? $award->title,
                        'year' => $award->year,
                        'copy' => $localized['description'] ?? $award->description,
                        'icon' => $award->icon_key,
                    ];
                })->values()->all(),
            ],
            'partners' => [
                'settings' => WebsiteContent::section('about', 'partners'),
                'items' => Partner::query()->where('is_published', true)->orderBy('sort_order')->get()->map(fn ($partner) => [
                    'name' => LocalizedContent::record($partner, ['name'])['name'] ?? $partner->name, 'role' => LocalizedContent::record($partner, ['role'])['role'] ?? $partner->role, 'description' => LocalizedContent::record($partner, ['description'])['description'] ?? $partner->description, 'url' => $partner->url, 'logo' => WebsiteContent::assetUrl($partner->logo),
                ])->values()->all(),
            ],
            'promise' => [
                'eyebrow' => $promiseSection['eyebrow'] ?? 'Our promise',
                'heading' => $promiseSection['heading'] ?? '',
                'primary_cta_label' => $promiseSection['primary_cta_label'] ?? 'Explore our projects',
                'primary_cta_url' => $promiseSection['primary_cta_url'] ?? '/projects',
                'secondary_cta_label' => $promiseSection['secondary_cta_label'] ?? 'Talk to us',
                'secondary_cta_url' => $promiseSection['secondary_cta_url'] ?? '/contact-us',
            ],
            'seo' => $seo->forPage('about', '/about-us', ['title' => 'About Us | LARZ Developments'], [
                $seo->breadcrumbs([['name' => 'Home', 'url' => url('/')], ['name' => 'About Us', 'url' => url('/about-us')]]),
            ]),
        ]);
    }
}
