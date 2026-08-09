<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectUnitTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id' => ['sometimes', 'integer', 'exists:projects,id'],
            'tag' => ['nullable', 'string', 'max:80'],
            'name' => ['sometimes', 'required', 'string', 'max:180'],
            'size_min' => ['nullable', 'numeric', 'min:0'],
            'size_max' => ['nullable', 'numeric', 'min:0'],
            'size_unit' => ['nullable', 'string', 'max:20'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
        ];
    }
}
