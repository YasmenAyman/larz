<?php

namespace App\Support;

use App\Models\MediaAsset;
use App\Models\PageSection;
use App\Models\Project;
use App\Services\MediaUploadService;
use Illuminate\Support\Facades\Cache;

final class WebsiteContent
{
    public static function assetUrl(?MediaAsset $asset): ?string
    {
        return app(MediaUploadService::class)->publicUrl($asset);
    }

    public static function section(string $page, string $key): array
    {
        return Cache::remember('website.section.'.$page.'.'.$key, now()->addHour(), fn () => PageSection::query()
            ->where('page_key', $page)
            ->where('section_key', $key)
            ->where('status', 'published')
            ->first()?->content_snapshot ?? []);
    }

    public static function project(Project $project): array
    {
        return [
            'id' => $project->id,
            'title' => $project->title,
            'slug' => $project->slug,
            'location' => $project->location,
            'status' => $project->status,
            'projectType' => $project->project_type,
            'description' => $project->description,
            'shortDescription' => $project->short_description,
            'tagline' => $project->short_description,
            'intro' => $project->description,
            'highlights' => self::section('project-'.$project->slug, 'highlights')['items'] ?? [],
            'heroHeading' => $project->hero_heading,
            'heroDescription' => $project->hero_description,
            'heroImage' => self::assetUrl($project->heroImage),
            'brochure' => self::assetUrl($project->brochure),
            'virtualTourUrl' => $project->virtual_tour_url,
            'mapImage' => self::assetUrl($project->mapImage),
            'facts' => $project->statistics->map(fn ($item) => [
                'value' => $item->value,
                'label' => $item->label,
                'note' => $item->note,
            ])->values()->all(),
            'gallery' => $project->galleries->map(fn ($item) => self::assetUrl($item->media))->filter()->values()->all(),
            'unitTypes' => $project->unitTypes->map(fn ($item) => [
                'tag' => $item->tag,
                'name' => $item->name,
                'size' => $item->size_min.'–'.$item->size_max,
            ])->values()->all(),
            'amenities' => $project->amenities->map(fn ($item) => [
                'group' => $item->group_name,
                'icon' => $item->icon_key,
                'title' => $item->title,
                'note' => $item->description,
            ])->values()->all(),
            'updates' => $project->updates->map(fn ($item) => [
                'tag' => $item->tag,
                'title' => $item->title,
                'image' => self::assetUrl($item->media),
            ])->values()->all(),
            'nearbyLocations' => $project->nearbyLocations->map(fn ($item) => [
                'place' => $item->place,
                'time' => $item->time_label,
            ])->values()->all(),
        ];
    }
}
