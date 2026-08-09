<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdminNavigationRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:navigation_items,id'],
            'items.*.label' => ['required', 'string', 'max:100'],
            'items.*.url' => ['required', 'string', 'max:500'],
            'items.*.location' => ['required', 'in:header,footer'],
            'items.*.sort_order' => ['required', 'integer', 'min:0'],
            'items.*.is_active' => ['boolean'],
        ];
    }
}
