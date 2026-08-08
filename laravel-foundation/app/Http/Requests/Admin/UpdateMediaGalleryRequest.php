<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMediaGalleryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'eyebrow' => ['nullable', 'string', 'max:100'],
            'heading' => ['nullable', 'string', 'max:5000'],
            'description' => ['nullable', 'string', 'max:10000'],
            'translations' => ['nullable', 'array'],
            'translations.en' => ['nullable', 'array'],
            'translations.ar' => ['nullable', 'array'],
            'translations.en.eyebrow' => ['nullable', 'string', 'max:100'],
            'translations.en.heading' => ['nullable', 'string', 'max:5000'],
            'translations.en.description' => ['nullable', 'string', 'max:10000'],
            'translations.ar.eyebrow' => ['nullable', 'string', 'max:100'],
            'translations.ar.heading' => ['nullable', 'string', 'max:5000'],
            'translations.ar.description' => ['nullable', 'string', 'max:10000'],
            'images' => ['nullable', 'array'],
            'images.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:25600'],
            'remove_ids' => ['nullable', 'array'],
            'remove_ids.*' => ['integer'],
            'gallery_ids' => ['nullable', 'array'],
            'gallery_ids.*' => ['integer'],
            '_method' => ['sometimes', 'string'],
        ];
    }
}