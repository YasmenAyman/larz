<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePhotoGalleryItemRequest extends FormRequest
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
            'image' => ['required', 'file', 'extensions:jpg,jpeg,png,webp,svg', 'mimetypes:image/jpeg,image/png,image/webp,image/svg+xml', 'max:5120'], 'title' => ['nullable', 'string', 'max:180'], 'alt_text' => ['nullable', 'string', 'max:255'], 'caption' => ['nullable', 'string'], 'location' => ['nullable', 'string', 'max:180'], 'event_date' => ['nullable', 'date'], 'sort_order' => ['integer', 'min:0'], 'is_published' => ['boolean'], 'is_active' => ['boolean'],
        ];
    }
}
