<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Models\MediaPost;
use App\Models\PhotoGalleryItem;
use App\Support\WebsiteContent;
use App\Services\SeoMetadataService;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function index(SeoMetadataService $seo): Response
    {
        $posts = MediaPost::query()->with(['category', 'featuredImage', 'author'])->where('is_published', true)->orderByDesc('published_at')->get();
        $gallery = PhotoGalleryItem::query()->with('media')->where('is_published', true)->orderBy('sort_order')->get();
        $news = WebsiteContent::section('media', 'news');
        $stories = WebsiteContent::section('media', 'stories');
        $gallerySettings = WebsiteContent::section('media', 'gallery');
        $newsletterSettings = WebsiteContent::section('media', 'newsletter');

        return Inertia::render('Website/Media/Index', [
            'hero' => WebsiteContent::section('media', 'hero'),
            'posts' => $posts->map(fn ($post) => ['slug' => $post->slug, 'type' => $post->type, 'category' => $post->category?->name, 'date' => $post->event_date?->format('d M Y'), 'title' => $post->title, 'excerpt' => $post->excerpt, 'image' => WebsiteContent::assetUrl($post->featuredImage)])->values()->all(),
            'newsSettings' => [
                'eyebrow' => $news['eyebrow'] ?? 'News & press releases',
                'heading' => $news['heading'] ?? "What's happening at LARZ.",
                'description' => $news['description'] ?? null,
            ],
            'storiesSettings' => [
                'eyebrow' => $stories['eyebrow'] ?? 'Blogs',
                'heading' => $stories['heading'] ?? 'Stories & insight.',
                'description' => $stories['description'] ?? null,
            ],
            'gallerySettings' => [
                'eyebrow' => $gallerySettings['eyebrow'] ?? 'Photo gallery',
                'heading' => $gallerySettings['heading'] ?? 'Inside our communities.',
                'description' => $gallerySettings['description'] ?? null,
            ],
            'newsletterSettings' => [
                'eyebrow' => $newsletterSettings['eyebrow'] ?? 'Newsletter',
                'heading' => $newsletterSettings['heading'] ?? 'Never miss an update.',
                'description' => $newsletterSettings['description'] ?? null,
            ],
            'gallery' => $gallery->map(fn ($item) => WebsiteContent::assetUrl($item->media))->filter()->values()->all(),
            'seo' => $seo->forPage('media', '/media', ['title' => 'Media | LARZ Developments'], [
                $seo->breadcrumbs([['name' => 'Home', 'url' => url('/')], ['name' => 'Media', 'url' => url('/media')]]),
            ]),
        ]);
    }

    public function show(string $post, SeoMetadataService $seo): Response
    {
        $record = MediaPost::query()->with(['category', 'featuredImage', 'openGraphImage', 'author'])->where('slug', $post)->where('is_published', true)->firstOrFail();
        $path = '/media/'.$record->slug;
        $url = url($path);
        return Inertia::render('Website/Media/Show', ['post' => ['slug' => $record->slug, 'type' => $record->type, 'category' => $record->category?->name, 'date' => $record->event_date?->format('d M Y'), 'title' => $record->title, 'excerpt' => $record->excerpt, 'content' => $record->content, 'image' => WebsiteContent::assetUrl($record->featuredImage)], 'seo' => $seo->forMediaPost($record, $path, [
            $seo->breadcrumbs([['name' => 'Home', 'url' => url('/')], ['name' => 'Media', 'url' => url('/media')], ['name' => $record->title, 'url' => $url]]),
            $seo->article($record, $url),
        ])]);
    }
}
