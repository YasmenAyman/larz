<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdminSettingsRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'settings' => ['required', 'array'],
            'logo' => ['nullable', 'file', 'image', 'max:10240'],
            'favicon' => ['nullable', 'file', 'image', 'max:10240'],
        ];
    }
}
