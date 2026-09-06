<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMaintenanceSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'enabled' => ['required', 'boolean'],
            'title_en' => ['nullable', 'string', 'max:180'],
            'message_en' => ['nullable', 'string', 'max:1000'],
            'title_ar' => ['nullable', 'string', 'max:180'],
            'message_ar' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
