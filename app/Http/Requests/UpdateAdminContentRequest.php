<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdminContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sections' => ['required', 'array'],
            'sections.*' => ['required', 'array'],
            'sections.*.eyebrow' => ['sometimes', 'string', 'max:160'],
            'sections.*.translations' => ['sometimes', 'array'],
            'sections.*.translations.en' => ['sometimes', 'array'],
            'sections.*.translations.ar' => ['sometimes', 'array'],
            'sections.*.translations.*.eyebrow' => ['sometimes', 'string', 'max:160'],
            'sections.*.translations.*.heading' => ['sometimes', 'string', 'max:5000'],
            'sections.*.translations.*.description' => ['sometimes', 'string', 'max:10000'],
            'sections.*.heading' => ['sometimes', 'string', 'max:5000'],
            'sections.*.description' => ['sometimes', 'string', 'max:10000'],
            'sections.*.body' => ['sometimes', 'string', 'max:30000'],
            'sections.*.cta_label' => ['sometimes', 'string', 'max:160'],
            'sections.*.cta_url' => ['sometimes', 'string', 'max:500'],
            'sections.*.brochureHeading' => ['sometimes', 'string', 'max:180'],
            'sections.*.brochureDescription' => ['sometimes', 'string', 'max:1000'],
            'sections.*.items' => ['sometimes', 'array'],
            'sections.*.items.*' => ['array'],
            'sections.stats.items' => ['sometimes', 'array', 'size:4'],
            'sections.stats.items.*.value' => ['required_with:sections.stats.items', 'string', 'max:100'],
            'sections.stats.items.*.label' => ['required_with:sections.stats.items', 'string', 'max:100'],
            'sections.*.images' => ['sometimes', 'array'],
            'sections.*.images.*' => ['string', 'max:500'],
        ];
    }
}
