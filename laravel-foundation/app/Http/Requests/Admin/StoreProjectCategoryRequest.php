<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:180'],
            'slug' => ['required', 'string', 'max:180', 'unique:project_categories,slug'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }
}
