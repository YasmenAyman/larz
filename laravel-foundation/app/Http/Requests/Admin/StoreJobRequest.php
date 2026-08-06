<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreJobRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:180'], 'slug' => ['required', 'string', 'max:180', 'unique:job_positions,slug'], 'department' => ['required', 'string', 'max:100'], 'location' => ['required', 'string', 'max:140'], 'employment_type' => ['required', 'string', 'max:60'], 'experience_level' => ['nullable', 'string', 'max:80'], 'summary' => ['nullable', 'string'], 'description' => ['nullable', 'string'], 'requirements' => ['nullable', 'string'], 'responsibilities' => ['nullable', 'string'], 'benefits' => ['nullable', 'string'], 'deadline' => ['nullable', 'date'], 'is_published' => ['boolean'], 'is_featured' => ['boolean'], 'sort_order' => ['integer', 'min:0'],
        ];
    }
}
