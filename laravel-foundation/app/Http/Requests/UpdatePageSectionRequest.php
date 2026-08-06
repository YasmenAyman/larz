<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePageSectionRequest extends FormRequest
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
            'page_key' => ['required', 'string', 'max:80'],
            'section_key' => ['required', 'string', 'max:100'],
            'section_type' => ['required', 'string', 'max:80'],
            'sort_order' => ['integer', 'min:0'],
            'status' => ['in:draft,in_review,published,archived'],
            'published_at' => ['nullable', 'date'],
            'content_snapshot' => ['nullable', 'array'],
        ];
    }
}
