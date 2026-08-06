<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreJobApplicationRequest extends FormRequest
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
            'job_position_id' => ['nullable', 'exists:job_positions,id'], 'name' => ['required', 'string', 'max:160'], 'email' => ['required', 'email', 'max:255'], 'phone' => ['required', 'string', 'max:40'], 'city' => ['nullable', 'string', 'max:120'], 'linkedin_url' => ['nullable', 'url', 'max:500'], 'portfolio_url' => ['nullable', 'url', 'max:500'], 'cover_note' => ['nullable', 'string', 'max:10000'], 'resume' => ['required', 'file', 'extensions:pdf,doc,docx', 'mimetypes:application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'max:10240'], 'consent_at' => ['nullable', 'date'],
        ];
    }
}
