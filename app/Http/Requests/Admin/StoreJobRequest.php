<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'slug' => ['required', 'string', 'max:180', 'unique:job_positions,slug'],
            'deadline' => ['nullable', 'date'],
            'is_published' => ['boolean'],
            'is_featured' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
            'translations' => ['required', 'array'],
            'translations.en' => ['required', 'array'],
            'translations.en.title' => ['required', 'string', 'max:180'],
            'translations.en.department' => ['required', 'string', 'max:100'],
            'translations.en.location' => ['required', 'string', 'max:140'],
            'translations.en.employment_type' => ['required', 'string', 'max:60'],
            'translations.en.experience_level' => ['nullable', 'string', 'max:80'],
            'translations.en.summary' => ['nullable', 'string'],
            'translations.en.description' => ['nullable', 'string'],
            'translations.en.requirements' => ['nullable', 'string'],
            'translations.en.responsibilities' => ['nullable', 'string'],
            'translations.en.benefits' => ['nullable', 'string'],
            'translations.ar' => ['nullable', 'array'],
            'translations.ar.title' => ['nullable', 'string', 'max:180'],
            'translations.ar.department' => ['nullable', 'string', 'max:100'],
            'translations.ar.location' => ['nullable', 'string', 'max:140'],
            'translations.ar.employment_type' => ['nullable', 'string', 'max:60'],
            'translations.ar.experience_level' => ['nullable', 'string', 'max:80'],
            'translations.ar.summary' => ['nullable', 'string'],
            'translations.ar.description' => ['nullable', 'string'],
            'translations.ar.requirements' => ['nullable', 'string'],
            'translations.ar.responsibilities' => ['nullable', 'string'],
            'translations.ar.benefits' => ['nullable', 'string'],
        ];
    }
}
