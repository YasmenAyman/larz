<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesHoneypot;
use App\Support\Honeypot;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContactInquiryRequest extends FormRequest
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
            'source' => $this->input('source') ?: 'contact-us',
            'source_url' => $this->input('source_url') ?: $this->headers->get('referer'),
            'email' => $this->filled('email') ? $this->input('email') : null,
        ]);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return array_merge($this->honeypotRules(), [
            'name' => ['required', 'string', 'max:160', 'regex:/^[\p{L}\s]+$/u'],
            'email' => ['nullable', 'string', 'max:255', 'regex:/^[^\s@]+@[^\s@]+\.[^\s@]+$/'],
            'phone' => ['required', 'string', 'regex:/^[0-9]+$/', 'min:6', 'max:40'],
            'project_id' => ['nullable', 'integer', Rule::exists('projects', 'id')->where('is_published', true)],
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

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.regex' => 'The name may only contain letters.',
            'phone.regex' => 'The phone may only contain numbers.',
            'email.regex' => 'Please enter a valid email address (e.g. name@example.com).',
        ];
    }
}