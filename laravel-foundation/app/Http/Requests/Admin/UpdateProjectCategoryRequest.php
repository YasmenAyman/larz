<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('projectCategory')?->id ?? null;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:180'],
            'slug' => ['sometimes', 'required', 'string', 'max:180', Rule::unique('project_categories', 'slug')->ignore($id)],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }
}
