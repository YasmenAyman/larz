<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAboutStoryRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'image' => ['nullable', 'file', 'extensions:jpg,jpeg,png,webp,svg', 'mimetypes:image/jpeg,image/png,image/webp,image/svg+xml', 'max:5120'],
            'translations' => ['required', 'array'],
            'translations.en' => ['required', 'array'],
            'translations.ar' => ['required', 'array'],
            'translations.*.eyebrow' => ['nullable', 'string', 'max:100'],
            'translations.*.heading' => ['nullable', 'string', 'max:5000'],
            'translations.*.body' => ['nullable', 'string', 'max:30000'],
        ];
    }
}
