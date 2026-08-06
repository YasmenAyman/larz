<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectGalleryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id' => ['required', 'integer', 'exists:projects,id'],
            'media_asset_id' => ['nullable', 'integer', 'exists:media_assets,id'],
            'image' => ['nullable', 'file', 'extensions:jpg,jpeg,png,webp,svg', 'mimetypes:image/jpeg,image/png,image/webp,image/svg+xml', 'max:5120'],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
        ];
    }
}
