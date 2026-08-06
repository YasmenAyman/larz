<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_category_id' => ['nullable', 'integer', 'exists:project_categories,id'],
            'title' => ['required', 'string', 'max:180'],
            'slug' => ['required', 'string', 'max:180', 'unique:projects,slug'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'location' => ['nullable', 'string', 'max:180'],
            'address' => ['nullable', 'string', 'max:500'],
            'status' => ['nullable', 'string', 'max:80'],
            'project_type' => ['nullable', 'string', 'max:80'],
            'completion_date' => ['nullable', 'date'],
            'price_from' => ['nullable', 'numeric', 'min:0'],
            'price_to' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'installment_information' => ['nullable', 'string'],
            'area_min' => ['nullable', 'numeric', 'min:0'],
            'area_max' => ['nullable', 'numeric', 'min:0'],
            'area_unit' => ['nullable', 'string', 'max:20'],
            'hero_heading' => ['nullable', 'string', 'max:255'],
            'hero_description' => ['nullable', 'string'],
            'hero_image' => ['nullable', 'file', 'extensions:jpg,jpeg,png,webp,svg', 'mimetypes:image/jpeg,image/png,image/webp,image/svg+xml', 'max:5120'],
            'logo' => ['nullable', 'file', 'extensions:jpg,jpeg,png,webp,svg', 'mimetypes:image/jpeg,image/png,image/webp,image/svg+xml', 'max:5120'],
            'brochure' => ['nullable', 'file', 'extensions:pdf', 'mimetypes:application/pdf', 'max:20480'],
            'video_url' => ['nullable', 'string', 'max:500'],
            'virtual_tour_url' => ['nullable', 'string', 'max:500'],
            'map_image' => ['nullable', 'file', 'extensions:jpg,jpeg,png,webp,svg', 'mimetypes:image/jpeg,image/png,image/webp,image/svg+xml', 'max:5120'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'seo_title' => ['nullable', 'string', 'max:180'],
            'seo_description' => ['nullable', 'string', 'max:320'],
            'canonical_url' => ['nullable', 'string', 'max:500'],
            'robots' => ['nullable', 'string', 'max:100'],
        ];
    }
}
