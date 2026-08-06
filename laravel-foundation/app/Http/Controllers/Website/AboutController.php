<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Models\Award;
use App\Models\Partner;
use App\Support\WebsiteContent;
use App\Services\SeoMetadataService;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function __invoke(SeoMetadataService $seo): Response
    {
        return Inertia::render('Website/About/Index', [
            'hero' => [...WebsiteContent::section('about', 'hero'), 'backgroundImage' => asset('assets/TYPE-B-IMAGE-01.png')],
            'stats' => WebsiteContent::section('about', 'stats')['items'] ?? [],
            'story' => [...WebsiteContent::section('about', 'story'), 'image' => asset('assets/IMAGE-01-RENDERED-1.png')],
            'awards' => Award::query()->where('is_published', true)->orderBy('sort_order')->get()->map(fn ($award) => [
                'title' => $award->title, 'year' => $award->year, 'copy' => $award->description, 'icon' => $award->icon_key,
            ])->values()->all(),
            'partners' => Partner::query()->where('is_published', true)->orderBy('sort_order')->get()->map(fn ($partner) => [
                'name' => $partner->name, 'role' => $partner->role, 'logo' => WebsiteContent::assetUrl($partner->logo),
            ])->values()->all(),
            'promise' => WebsiteContent::section('about', 'promise'),
            'seo' => $seo->forPage('about', '/about-us', ['title' => 'About Us | LARZ Developments'], [
                $seo->breadcrumbs([['name' => 'Home', 'url' => url('/')], ['name' => 'About Us', 'url' => url('/about-us')]]),
            ]),
        ]);
    }
}
