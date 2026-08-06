<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePartnerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:180'],
            'role' => ['nullable', 'string', 'max:180'],
            'description' => ['nullable', 'string', 'max:1000'],
            'url' => ['nullable', 'string', 'max:500', 'url'],
            'logo' => ['nullable', 'file', 'extensions:jpg,jpeg,png,webp,svg', 'mimetypes:image/jpeg,image/png,image/webp,image/svg+xml', 'max:5120'],
            'sort_order' => ['integer', 'min:0'],
            'is_published' => ['boolean'],
        ];
    }
}