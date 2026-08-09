<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMediaPostRequest extends FormRequest
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
            'media_category_id' => ['nullable', 'integer', 'exists:media_categories,id'],
            'type' => ['sometimes', 'in:press,blog'],
            'title' => ['sometimes', 'string', 'max:220'],
            'slug' => ['sometimes', 'string', 'max:220'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ];
    }
}
