<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMediaPostRequest extends FormRequest
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
            'type' => ['required', 'in:press,blog'],
            'title' => ['required', 'string', 'max:220'],
            'slug' => ['required', 'string', 'max:220'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'author_id' => ['nullable', 'integer', 'exists:users,id'],
            'event_date' => ['nullable', 'date'],
            'published_at' => ['nullable', 'date'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'seo_title' => ['nullable', 'string', 'max:180'],
            'seo_description' => ['nullable', 'string', 'max:320'],
            'canonical_url' => ['nullable', 'url', 'max:500'],
            'robots' => ['nullable', 'string', 'max:100'],
        ];
    }
}
