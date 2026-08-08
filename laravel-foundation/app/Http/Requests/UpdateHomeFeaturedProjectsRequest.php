<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHomeFeaturedProjectsRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'eyebrow' => ['nullable', 'string', 'max:100'],
            'heading' => ['nullable', 'string', 'max:180'],
            'description' => ['nullable', 'string', 'max:1000'],
            'cta_label' => ['nullable', 'string', 'max:100'],
            'cta_url' => ['nullable', 'string', 'max:500'],
            'project_ids' => ['required', 'array', 'max:12'],
            'project_ids.*' => ['integer', 'exists:projects,id'],
            'translations' => ['nullable', 'array'],
            'translations.en' => ['nullable', 'array'],
            'translations.ar' => ['nullable', 'array'],
            'translations.*.eyebrow' => ['nullable', 'string', 'max:100'],
            'translations.*.heading' => ['nullable', 'string', 'max:180'],
            'translations.*.description' => ['nullable', 'string', 'max:1000'],
            'translations.*.cta_label' => ['nullable', 'string', 'max:100'],
            'translations.*.cta_url' => ['nullable', 'string', 'max:500'],
        ];
    }
}
