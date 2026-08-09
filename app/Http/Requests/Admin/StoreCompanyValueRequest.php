<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCompanyValueRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:140'],
            'description' => ['nullable', 'string', 'max:2000'],
            'icon_key' => ['required', 'string', 'in:heart,growth,leaf,medal'],
            'sort_order' => ['integer', 'min:0'],
            'is_published' => ['boolean'],
            'translations' => ['nullable', 'array'],
            'translations.en' => ['nullable', 'array'],
            'translations.ar' => ['nullable', 'array'],
            'translations.*.title' => ['nullable', 'string', 'max:140'],
            'translations.*.description' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
