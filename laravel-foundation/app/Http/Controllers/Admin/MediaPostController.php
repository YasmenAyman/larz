<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMediaPostRequest;
use App\Http\Requests\Admin\UpdateMediaPostRequest;
use App\Models\MediaCategory;
use App\Models\MediaPost;
use App\Services\MediaUploadService;
use App\Services\RichTextSanitizer;
use App\Support\WebsiteCache;
use App\Support\WebsiteContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MediaPostController extends Controller
{
    public function index(Request $request): Response
    {
        $posts = MediaPost::query()->with(['category', 'featuredImage', 'author'])->when($request->string('search')->isNotEmpty(), fn ($q) => $q->where('title', 'like', '%'.$request->string('search').'%'))->when($request->filled('type'), fn ($q) => $q->where('type', $request->string('type')))->when($request->filled('category'), fn ($q) => $q->where('media_category_id', $request->integer('category')))->when($request->filled('status'), fn ($q) => $q->where('is_published', $request->boolean('status')))->orderBy('sort_order')->orderByDesc('published_at')->paginate(15)->withQueryString();
        return Inertia::render('Admin/Media/Posts/Index', ['posts' => $posts->through(fn ($post) => ['id' => $post->id, 'title' => $post->title, 'slug' => $post->slug, 'type' => $post->type, 'category' => $post->category?->name, 'published' => $post->is_published, 'featured' => $post->is_featured, 'image' => WebsiteContent::assetUrl($post->featuredImage)]), 'categories' => MediaCategory::query()->orderBy('name')->get(['id', 'name']), 'filters' => $request->only(['search', 'type', 'category', 'status'])]);
    }

    public function create(): Response { return Inertia::render('Admin/Media/Posts/Form', ['post' => null, 'categories' => MediaCategory::query()->orderBy('name')->get(['id', 'name'])]); }

    public function store(StoreMediaPostRequest $request, MediaUploadService $uploads): RedirectResponse
    {
        $data = $request->safe()->except(['featured_image', 'open_graph_image']);
        if (array_key_exists('content', $data)) $data['content'] = app(RichTextSanitizer::class)->sanitize($data['content']);
        $newAssets = [];
        try {
            DB::transaction(function () use ($request, $uploads, $data, &$newAssets) {
                $data['is_published'] = $request->boolean('is_published');
                $data['is_featured'] = $request->boolean('is_featured');
                if ($request->hasFile('featured_image')) { $newAssets[] = $uploads->storePublicImage($request->file('featured_image'), 'media/posts'); $data['featured_image_id'] = end($newAssets)->id; }
                if ($request->hasFile('open_graph_image')) { $newAssets[] = $uploads->storePublicImage($request->file('open_graph_image'), 'media/og'); $data['open_graph_image_id'] = end($newAssets)->id; }
                MediaPost::create($data);
            });
        } catch (\Throwable $exception) {
            foreach ($newAssets as $asset) $uploads->delete($asset);
            throw $exception;
        }
        WebsiteCache::mediaSections();
        WebsiteCache::sitemap();
        return to_route('admin.media.posts.index')->with('success', 'Media post created.');
    }

    public function edit(MediaPost $mediaPost): Response { $mediaPost->load(['category', 'featuredImage', 'openGraphImage']); return Inertia::render('Admin/Media/Posts/Form', ['post' => ['id' => $mediaPost->id, 'type' => $mediaPost->type, 'media_category_id' => $mediaPost->media_category_id, 'title' => $mediaPost->title, 'slug' => $mediaPost->slug, 'excerpt' => $mediaPost->excerpt, 'content' => $mediaPost->content, 'event_date' => $mediaPost->event_date?->format('Y-m-d'), 'published_at' => $mediaPost->published_at?->format('Y-m-d\\TH:i'), 'is_featured' => $mediaPost->is_featured, 'is_published' => $mediaPost->is_published, 'sort_order' => $mediaPost->sort_order, 'seo_title' => $mediaPost->seo_title, 'seo_description' => $mediaPost->seo_description, 'featured_image' => WebsiteContent::assetUrl($mediaPost->featuredImage), 'open_graph_image' => WebsiteContent::assetUrl($mediaPost->openGraphImage)], 'categories' => MediaCategory::query()->orderBy('name')->get(['id', 'name'])]); }

    public function update(UpdateMediaPostRequest $request, MediaPost $mediaPost, MediaUploadService $uploads): RedirectResponse
    {
        $data = $request->safe()->except(['featured_image', 'open_graph_image']);
        if (array_key_exists('content', $data)) $data['content'] = app(RichTextSanitizer::class)->sanitize($data['content']);
        $oldFeaturedImage = $mediaPost->featuredImage;
        $oldOpenGraphImage = $mediaPost->openGraphImage;
        $newAssets = [];
        try {
            DB::transaction(function () use ($request, $uploads, $data, $mediaPost, &$newAssets) {
                $data['is_published'] = $request->boolean('is_published');
                $data['is_featured'] = $request->boolean('is_featured');
                if ($request->hasFile('featured_image')) { $newAssets[] = $uploads->storePublicImage($request->file('featured_image'), 'media/posts'); $data['featured_image_id'] = end($newAssets)->id; }
                if ($request->hasFile('open_graph_image')) { $newAssets[] = $uploads->storePublicImage($request->file('open_graph_image'), 'media/og'); $data['open_graph_image_id'] = end($newAssets)->id; }
                $mediaPost->update($data);
            });
        } catch (\Throwable $exception) {
            foreach ($newAssets as $asset) $uploads->delete($asset);
            throw $exception;
        }
        if ($request->hasFile('featured_image') && $oldFeaturedImage) $uploads->deleteIfUnreferenced($oldFeaturedImage);
        if ($request->hasFile('open_graph_image') && $oldOpenGraphImage) $uploads->deleteIfUnreferenced($oldOpenGraphImage);
        WebsiteCache::mediaSections();
        WebsiteCache::sitemap();
        return back()->with('success', 'Media post updated.');
    }

    public function destroy(MediaPost $mediaPost, MediaUploadService $uploads): RedirectResponse { $assets = [$mediaPost->featuredImage, $mediaPost->openGraphImage]; $mediaPost->delete(); foreach ($assets as $asset) if ($asset) $uploads->deleteIfUnreferenced($asset); WebsiteCache::mediaSections(); WebsiteCache::sitemap(); return back()->with('success', 'Media post moved to trash.'); }
    public function restore(int $mediaPost): RedirectResponse { MediaPost::withTrashed()->findOrFail($mediaPost)->restore(); WebsiteCache::mediaSections(); WebsiteCache::sitemap(); return back()->with('success', 'Media post restored.'); }
    public function forceDelete(int $mediaPost): RedirectResponse { abort_unless(request()->user()->hasRole('Super Admin'), 403); MediaPost::withTrashed()->findOrFail($mediaPost)->forceDelete(); WebsiteCache::mediaSections(); WebsiteCache::sitemap(); return back()->with('success', 'Media post permanently deleted.'); }
    public function togglePublished(MediaPost $mediaPost): RedirectResponse { $mediaPost->update(['is_published' => ! $mediaPost->is_published, 'published_at' => ! $mediaPost->is_published ? now() : null]); WebsiteCache::mediaSections(); WebsiteCache::sitemap(); return back(); }
    public function toggleFeatured(MediaPost $mediaPost): RedirectResponse { $mediaPost->update(['is_featured' => ! $mediaPost->is_featured]); WebsiteCache::mediaSections(); WebsiteCache::sitemap(); return back(); }
}
