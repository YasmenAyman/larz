<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCareersInternshipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'translations.en.eyebrow' => ['nullable', 'string', 'max:200'],
            'translations.en.heading' => ['nullable', 'string', 'max:500'],
            'translations.en.description' => ['nullable', 'string', 'max:5000'],
            'translations.en.cta_label' => ['nullable', 'string', 'max:200'],
            'translations.ar.eyebrow' => ['nullable', 'string', 'max:200'],
            'translations.ar.heading' => ['nullable', 'string', 'max:500'],
            'translations.ar.description' => ['nullable', 'string', 'max:5000'],
            'translations.ar.cta_label' => ['nullable', 'string', 'max:200'],
            'image' => ['nullable', 'file', 'image', 'max:25600'],
        ];
    }
}
