<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTestimonialRequest;
use App\Http\Requests\Admin\UpdateTestimonialRequest;
use App\Http\Requests\UpdateAdminContentRequest;
use App\Models\PageSection;
use App\Models\Testimonial;
use App\Services\MediaUploadService;
use App\Services\RichTextSanitizer;
use App\Support\WebsiteCache;
use App\Support\WebsiteContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(): Response
    {
        $section = PageSection::query()->where('page_key', 'home')->where('section_key', 'testimonials')->first();

        return Inertia::render('Admin/Content/Testimonials/Index', [
            'settings' => $section?->content_snapshot ?? [],
            'testimonials' => Testimonial::query()->with('media')->orderBy('sort_order')->orderBy('id')->get()->map(fn (Testimonial $item) => $this->present($item))->values()->all(),
        ]);
    }

    public function updateSettings(UpdateAdminContentRequest $request): RedirectResponse
    {
        $content = app(RichTextSanitizer::class)->sanitizeArray($request->input('section', $request->input('sections.testimonials', [])));
        PageSection::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'testimonials'],
            ['section_type' => 'home.testimonials', 'content_snapshot' => $content, 'status' => 'published', 'published_at' => now(), 'updated_by' => $request->user()->id],
        );
        WebsiteCache::section('home', 'testimonials');

        return back()->with('success', 'Testimonials section settings updated.');
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Content/Testimonials/Form', ['testimonial' => null]);
    }

    public function store(StoreTestimonialRequest $request, MediaUploadService $uploads): RedirectResponse
    {
        $data = $request->safe()->except('image');
        $data['is_published'] = $request->boolean('is_published');
        $newAsset = null;

        try {
            DB::transaction(function () use ($request, $uploads, &$newAsset, &$data): void {
                if ($request->hasFile('image')) {
                    $newAsset = $uploads->storePublicImage($request->file('image'), 'media/testimonials');
                    $data['media_asset_id'] = $newAsset->id;
                }
                Testimonial::create($data);
            });
        } catch (\Throwable $exception) {
            if ($newAsset) $uploads->delete($newAsset);
            throw $exception;
        }
        WebsiteCache::section('home', 'testimonials');

        return to_route('admin.pages.home.testimonials.edit')->with('success', 'Testimonial created.');
    }

    public function edit(Testimonial $testimonial): Response
    {
        $testimonial->load('media');

        return Inertia::render('Admin/Content/Testimonials/Form', [
            'testimonial' => [
                'id' => $testimonial->id,
                'name' => $testimonial->name,
                'role' => $testimonial->role,
                'quote' => $testimonial->quote,
                'sort_order' => $testimonial->sort_order,
                'is_published' => $testimonial->is_published,
                'image' => WebsiteContent::assetUrl($testimonial->media),
            ],
        ]);
    }

    public function update(UpdateTestimonialRequest $request, Testimonial $testimonial, MediaUploadService $uploads): RedirectResponse
    {
        $data = $request->safe()->except('image');
        $data['is_published'] = $request->boolean('is_published');
        $oldAsset = $testimonial->media;
        $newAsset = null;

        try {
            DB::transaction(function () use ($request, $uploads, $testimonial, &$newAsset, &$data): void {
                if ($request->hasFile('image')) {
                    $newAsset = $uploads->storePublicImage($request->file('image'), 'media/testimonials');
                    $data['media_asset_id'] = $newAsset->id;
                }
                $testimonial->update($data);
            });
        } catch (\Throwable $exception) {
            if ($newAsset) $uploads->delete($newAsset);
            throw $exception;
        }

        if ($request->hasFile('image') && $oldAsset) $uploads->deleteIfUnreferenced($oldAsset);
        WebsiteCache::section('home', 'testimonials');

        return to_route('admin.pages.home.testimonials.edit')->with('success', 'Testimonial updated.');
    }

    public function destroy(Testimonial $testimonial, MediaUploadService $uploads): RedirectResponse
    {
        $asset = $testimonial->media;
        $testimonial->delete();
        if ($asset) $uploads->deleteIfUnreferenced($asset);
        WebsiteCache::section('home', 'testimonials');

        return back()->with('success', 'Testimonial deleted.');
    }

    public function togglePublished(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update(['is_published' => ! $testimonial->is_published]);
        WebsiteCache::section('home', 'testimonials');

        return back()->with('success', 'Testimonial visibility updated.');
    }

    private function present(Testimonial $testimonial): array
    {
        return [
            'id' => $testimonial->id,
            'name' => $testimonial->name,
            'role' => $testimonial->role,
            'quote' => $testimonial->quote,
            'sort_order' => $testimonial->sort_order,
            'is_published' => $testimonial->is_published,
            'image' => WebsiteContent::assetUrl($testimonial->media),
        ];
    }
}
