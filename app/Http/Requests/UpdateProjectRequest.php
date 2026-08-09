<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
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
            'title' => ['sometimes', 'string', 'max:180'],
            'slug' => ['sometimes', 'string', 'max:180'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:180'],
            'address' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'max:80'],
            'project_type' => ['nullable', 'string', 'max:80'],
            'completion_date' => ['nullable', 'date'],
            'price_from' => ['nullable', 'numeric', 'min:0'],
            'price_to' => ['nullable', 'numeric', 'gte:price_from'],
            'video_url' => ['nullable', 'url', 'max:500'],
            'virtual_tour_url' => ['nullable', 'url', 'max:500'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
        ];
    }
}
