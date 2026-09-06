<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'project_category_id' => ['nullable', 'integer', 'exists:project_categories,id'],
            'title' => ['required', 'string', 'max:180'],
            'slug' => ['required', 'string', 'max:180'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:180'],
            'address' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'max:80'],
            'project_type' => ['nullable', 'string', 'max:80'],
            'completion_date' => ['nullable', 'date'],
            'price_from' => ['nullable', 'numeric', 'min:0'],
            'price_to' => ['nullable', 'numeric', 'gte:price_from'],
            'currency' => ['required', 'string', 'max:10'],
            'installment_information' => ['nullable', 'string'],
            'area_min' => ['nullable', 'numeric', 'min:0'],
            'area_max' => ['nullable', 'numeric', 'gte:area_min'],
            'area_unit' => ['required', 'string', 'max:20'],
            'hero_heading' => ['nullable', 'string', 'max:255'],
            'hero_description' => ['nullable', 'string'],
            'video_url' => ['nullable', 'url', 'max:500'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ];
    }
}
