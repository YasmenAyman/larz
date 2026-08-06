<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAwardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:180'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'icon_key' => ['nullable', 'string', 'in:award,star,medal,crown'],
            'sort_order' => ['integer', 'min:0'],
            'is_published' => ['boolean'],
        ];
    }
}