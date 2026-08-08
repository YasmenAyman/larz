<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAboutHeroRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'background_image' => ['nullable', 'file', 'extensions:jpg,jpeg,png,webp,svg', 'mimetypes:image/jpeg,image/png,image/webp,image/svg+xml', 'max:5120'],
            'translations' => ['required', 'array'],
            'translations.en' => ['required', 'array'],
            'translations.ar' => ['required', 'array'],
            'translations.*.eyebrow' => ['nullable', 'string', 'max:100'],
            'translations.*.heading' => ['nullable', 'string', 'max:5000'],
            'translations.*.description' => ['nullable', 'string', 'max:10000'],
            'translations.*.cta_label' => ['nullable', 'string', 'max:160'],
            'translations.*.cta_url' => ['nullable', 'string', 'max:500'],
            'translations.*.secondary_cta_label' => ['nullable', 'string', 'max:160'],
            'translations.*.secondary_cta_url' => ['nullable', 'string', 'max:500'],
        ];
    }
}
