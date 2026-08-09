<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCareersHeroRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'background_image' => ['nullable', 'file', 'extensions:jpg,jpeg,png,webp,svg', 'mimetypes:image/jpeg,image/png,image/webp,image/svg+xml', 'max:25600'],
            'translations' => ['nullable', 'array'],
            'translations.en' => ['nullable', 'array'],
            'translations.ar' => ['nullable', 'array'],
            'translations.*.eyebrow' => ['nullable', 'string', 'max:100'],
            'translations.*.heading' => ['nullable', 'string', 'max:5000'],
            'translations.*.description' => ['nullable', 'string', 'max:10000'],
        ];
    }
}
