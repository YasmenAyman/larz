<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateHomeFeaturedProjectsRequest;
use App\Models\PageSection;
use App\Models\Project;
use App\Support\WebsiteCache;
use App\Support\WebsiteContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class HomeFeaturedProjectsController extends Controller
{
    public function edit(): Response
    {
        $settings = WebsiteContent::section('home', 'featured_projects');
        $raw = PageSection::query()->where('page_key', 'home')->where('section_key', 'featured_projects')->value('content_snapshot') ?? [];
        $translations = $raw['translations'] ?? ['en' => $settings, 'ar' => ['eyebrow' => '', 'heading' => '', 'description' => '', 'cta_label' => '', 'cta_url' => '']];
        $projects = Project::query()->where('is_published', true)->with('heroImage')->orderBy('sort_order')->get();
        $selected = $settings['project_ids'] ?? $projects->where('is_featured', true)->pluck('id')->values()->all();
        return Inertia::render('Admin/Pages/HomeFeaturedProjects', [
            'settings' => ['eyebrow' => $settings['eyebrow'] ?? 'Featured Projects', 'heading' => $settings['heading'] ?? 'Our Signature Developments', 'description' => $settings['description'] ?? 'Discover a curated selection of our most prestigious projects, designed to elevate the standard of modern living.', 'cta_label' => $settings['cta_label'] ?? 'Explore All', 'cta_url' => $settings['cta_url'] ?? '/projects', 'project_ids' => array_values(array_map('intval', $selected)), 'translations' => $translations],
            'projects' => $projects->map(fn ($project) => ['id' => $project->id, 'title' => $project->title, 'location' => $project->location, 'image' => WebsiteContent::assetUrl($project->heroImage)])->values()->all(),
        ]);
    }

    public function update(UpdateHomeFeaturedProjectsRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $translations = $data['translations'] ?? [
            'en' => ['eyebrow' => $data['eyebrow'] ?? '', 'heading' => $data['heading'] ?? '', 'description' => $data['description'] ?? '', 'cta_label' => $data['cta_label'] ?? '', 'cta_url' => $data['cta_url'] ?? ''],
            'ar' => ['eyebrow' => '', 'heading' => '', 'description' => '', 'cta_label' => '', 'cta_url' => ''],
        ];
        DB::transaction(fn () => PageSection::updateOrCreate(['page_key' => 'home', 'section_key' => 'featured_projects'], ['section_type' => 'home.featured_projects', 'content_snapshot' => ['translations' => $translations, 'project_ids' => array_values($data['project_ids'])], 'status' => 'published', 'published_at' => now(), 'updated_by' => $request->user()->id]));
        WebsiteCache::section('home', 'featured_projects');
        WebsiteCache::sitemap();
        return back()->with('success', 'Featured projects updated.');
    }
}
