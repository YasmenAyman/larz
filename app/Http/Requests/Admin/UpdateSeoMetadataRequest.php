<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSeoMetadataRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'seo_title' => ['nullable', 'string', 'max:180'],
            'meta_description' => ['nullable', 'string', 'max:320'],
            'canonical_url' => ['nullable', 'url', 'max:500'],
            'og_title' => ['nullable', 'string', 'max:180'],
            'og_description' => ['nullable', 'string', 'max:320'],
            'og_image' => ['nullable', 'file', 'extensions:jpg,jpeg,png,webp,svg', 'mimetypes:image/jpeg,image/png,image/webp,image/svg+xml', 'max:5120'],
            'indexable' => ['boolean'],
            'followable' => ['boolean'],
            'translations' => ['nullable', 'array'],
            'translations.en' => ['nullable', 'array'],
            'translations.ar' => ['nullable', 'array'],
            'translations.en.seo_title' => ['nullable', 'string', 'max:180'],
            'translations.en.meta_description' => ['nullable', 'string', 'max:320'],
            'translations.en.og_title' => ['nullable', 'string', 'max:180'],
            'translations.en.og_description' => ['nullable', 'string', 'max:320'],
            'translations.ar.seo_title' => ['nullable', 'string', 'max:180'],
            'translations.ar.meta_description' => ['nullable', 'string', 'max:320'],
            'translations.ar.og_title' => ['nullable', 'string', 'max:180'],
            'translations.ar.og_description' => ['nullable', 'string', 'max:320'],
        ];
    }
}
