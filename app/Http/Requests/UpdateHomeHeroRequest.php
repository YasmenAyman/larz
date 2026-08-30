<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateHomeHeroRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'hero_video' => ['nullable', 'file', 'extensions:mp4', 'mimetypes:video/mp4,application/mp4', 'max:51200'],
            'translations' => ['nullable', 'array'],
            'translations.en' => ['nullable', 'array'],
            'translations.ar' => ['nullable', 'array'],
            'translations.*.eyebrow' => ['nullable', 'string', 'max:100'],
            'translations.*.heading' => ['nullable', 'string', 'max:5000'],
            'translations.*.description' => ['nullable', 'string', 'max:10000'],
            'translations.*.primary_cta_label' => ['nullable', 'string', 'max:100'],
            'translations.*.primary_cta_url' => ['nullable', 'string', 'max:500'],
        ];
    }
}
