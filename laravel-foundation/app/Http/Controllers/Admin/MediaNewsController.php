<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAdminContentRequest;
use App\Models\MediaPost;
use App\Models\PageSection;
use App\Services\RichTextSanitizer;
use App\Support\WebsiteCache;
use App\Support\WebsiteContent;
use App\Support\LocalizedContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MediaNewsController extends Controller
{
    public function index(Request $request): Response
    {
        $section = PageSection::query()->where('page_key', 'media')->where('section_key', 'news')->first();
        $snapshot = $section?->content_snapshot ?? [];
        $defaults = ['eyebrow' => 'News & press releases', 'heading' => "What's happening at LARZ.", 'description' => 'Latest announcements and milestones from across our projects and communities.'];
        $settings = array_replace($defaults, $snapshot);
        $settings['translations'] = $snapshot['translations'] ?? ['en' => $settings, 'ar' => ['eyebrow' => '', 'heading' => '', 'description' => '']];
        $posts = MediaPost::query()->with(['featuredImage'])->where('type', 'press')->orderBy('sort_order')->orderByDesc('published_at')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Pages/MediaNews', [
            'settings' => $settings,
            'posts' => $posts->through(fn (MediaPost $post) => [
                'id' => $post->id,
                'title' => LocalizedContent::record($post, ['title'])['title'] ?? $post->title,
                'slug' => $post->slug,
                'excerpt' => LocalizedContent::record($post, ['excerpt'])['excerpt'] ?? $post->excerpt,
                'published' => $post->is_published,
                'date' => $post->event_date?->format('Y-m-d'),
                'image' => WebsiteContent::assetUrl($post->featuredImage),
            ]),
        ]);
    }

    public function updateSettings(UpdateAdminContentRequest $request): RedirectResponse
    {
        $content = app(RichTextSanitizer::class)->sanitizeArray($request->input('sections.news', $request->input('section', [])));
        if (isset($content['translations'])) {
            $content = ['translations' => $content['translations']];
        }
        PageSection::updateOrCreate(
            ['page_key' => 'media', 'section_key' => 'news'],
            ['section_type' => 'media.news', 'content_snapshot' => $content, 'status' => 'published', 'published_at' => now(), 'updated_by' => $request->user()->id],
        );
        WebsiteCache::section('media', 'news');
        return back()->with('success', 'News section updated.');
    }
}
