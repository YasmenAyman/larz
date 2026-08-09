<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesHoneypot;
use App\Support\Honeypot;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectInquiryRequest extends FormRequest
{
    use ValidatesHoneypot;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->ensureHoneypotIsClean();
        $this->merge([
            'source' => $this->input('source') ?: 'project-inquiry',
            'source_url' => $this->input('source_url') ?: $this->headers->get('referer'),
        ]);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return array_merge($this->honeypotRules(), [
            'project_id' => ['required', 'integer', Rule::exists('projects', 'id')->where('is_published', true)],
            'project_unit_type_id' => ['nullable', 'integer', Rule::exists('project_unit_types', 'id')->where('is_published', true)],
            'name' => ['required', 'string', 'max:160'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['required', 'string', 'min:6', 'max:40'],
            'preferred_contact_method' => ['nullable', 'in:phone,email,whatsapp'],
            'message' => ['nullable', 'string', 'max:5000'],
            'source' => ['required', 'string', 'max:40'],
            'source_url' => ['nullable', 'url', 'max:2000'],
            'consent_at' => ['nullable', 'date'],
        ]);
    }

    public function attributes(): array
    {
        return [Honeypot::FIELD => 'spam protection'];
    }
}