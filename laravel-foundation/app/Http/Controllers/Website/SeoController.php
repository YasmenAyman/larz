<?php

namespace App\Http\Controllers\Website;

use App\Models\MediaPost;
use App\Models\Project;
use App\Services\SeoMetadataService;
use Illuminate\Http\Response;

class SeoController
{
    public function sitemap(SeoMetadataService $seo): Response
    {
        $staticPages = [
            ['path' => '/', 'key' => 'home'],
            ['path' => '/about-us', 'key' => 'about'],
            ['path' => '/projects', 'key' => 'projects'],
            ['path' => '/media', 'key' => 'media'],
            ['path' => '/careers', 'key' => 'careers'],
            ['path' => '/contact-us', 'key' => 'contact'],
        ];
        $projects = Project::query()->with('heroImage')->where('is_published', true)->get();
        $posts = MediaPost::query()->with(['openGraphImage', 'featuredImage'])->where('is_published', true)->get();
        $seo->preload(array_merge(array_column($staticPages, 'key'), $projects->map(fn ($project) => 'project:'.$project->id)->all(), $posts->map(fn ($post) => 'media:'.$post->id)->all()));

        $urls = collect($staticPages)->map(function ($page) use ($seo) {
            $metadata = $seo->forPage($page['key'], $page['path']);
            return ['loc' => $metadata['canonical'], 'lastmod' => null, 'indexable' => $metadata['indexable']];
        });

        $urls = $urls->concat($projects->map(function ($project) use ($seo) {
            $metadata = $seo->forProject($project, '/projects/'.$project->slug);
            return ['loc' => $metadata['canonical'], 'lastmod' => $project->updated_at?->toAtomString(), 'indexable' => $metadata['indexable']];
        }));

        $urls = $urls->concat($posts->map(function ($post) use ($seo) {
            $metadata = $seo->forMediaPost($post, '/media/'.$post->slug);
            return ['loc' => $metadata['canonical'], 'lastmod' => $post->updated_at?->toAtomString(), 'indexable' => $metadata['indexable']];
        }));

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n".'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        foreach ($urls->filter(fn ($url) => $url['indexable'] ?? true) as $url) {
            $xml .= '<url><loc>'.e($url['loc']).'</loc>'.(! empty($url['lastmod']) ? '<lastmod>'.e($url['lastmod']).'</lastmod>' : '').'</url>';
        }
        $xml .= '</urlset>';

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }

    public function robots(): Response
    {
        $body = "User-agent: *\nDisallow: /admin\nDisallow: /dashboard\nDisallow: /login\nDisallow: /register\nSitemap: ".url('/sitemap.xml')."\n";

        return response($body, 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
    }
}
