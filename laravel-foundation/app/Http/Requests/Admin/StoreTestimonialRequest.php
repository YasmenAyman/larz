<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTestimonialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:140'],
            'role' => ['nullable', 'string', 'max:140'],
            'quote' => ['required', 'string'],
            'translations' => ['nullable', 'array'],
            'translations.en' => ['nullable', 'array'],
            'translations.ar' => ['nullable', 'array'],
            'translations.en.name' => ['nullable', 'string', 'max:140'],
            'translations.en.role' => ['nullable', 'string', 'max:140'],
            'translations.en.quote' => ['nullable', 'string'],
            'translations.ar.name' => ['nullable', 'string', 'max:140'],
            'translations.ar.role' => ['nullable', 'string', 'max:140'],
            'translations.ar.quote' => ['nullable', 'string'],
            'image' => ['nullable', 'file', 'extensions:jpg,jpeg,png,webp,svg', 'mimetypes:image/jpeg,image/png,image/webp,image/svg+xml', 'max:5120'],
            'sort_order' => ['integer', 'min:0'],
            'is_published' => ['boolean'],
        ];
    }
}
