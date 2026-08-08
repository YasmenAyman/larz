<?php

namespace App\Http\Requests\Admin;

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
            'type' => ['sometimes', 'in:press,blog'], 'media_category_id' => ['nullable', 'exists:media_categories,id'], 'title' => ['sometimes', 'string', 'max:220'], 'slug' => ['sometimes', 'string', 'max:220'], 'excerpt' => ['nullable', 'string'], 'content' => ['nullable', 'string'], 'featured_image' => ['nullable', 'file', 'extensions:jpg,jpeg,png,webp,svg', 'mimetypes:image/jpeg,image/png,image/webp,image/svg+xml', 'max:5120'], 'open_graph_image' => ['nullable', 'file', 'extensions:jpg,jpeg,png,webp,svg', 'mimetypes:image/jpeg,image/png,image/webp,image/svg+xml', 'max:5120'], 'author_id' => ['nullable', 'exists:users,id'], 'event_date' => ['nullable', 'date'], 'published_at' => ['nullable', 'date'], 'is_featured' => ['boolean'], 'is_published' => ['boolean'], 'sort_order' => ['integer', 'min:0'], 'seo_title' => ['nullable', 'string', 'max:180'], 'seo_description' => ['nullable', 'string', 'max:320'],
            'translations' => ['nullable', 'array'], 'translations.en' => ['nullable', 'array'], 'translations.ar' => ['nullable', 'array'],
            'translations.en.title' => ['nullable', 'string', 'max:220'], 'translations.en.excerpt' => ['nullable', 'string'], 'translations.en.content' => ['nullable', 'string'],
            'translations.ar.title' => ['nullable', 'string', 'max:220'], 'translations.ar.excerpt' => ['nullable', 'string'], 'translations.ar.content' => ['nullable', 'string'],
        ];
    }
}
