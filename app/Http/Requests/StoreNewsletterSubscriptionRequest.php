<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesApplicantContactFields;
use App\Http\Requests\Concerns\ValidatesHoneypot;
use App\Support\Honeypot;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreNewsletterSubscriptionRequest extends FormRequest
{
    use ValidatesApplicantContactFields;
    use ValidatesHoneypot;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->ensureHoneypotIsClean();
        $this->merge([
            'source' => $this->input('source') ?: 'newsletter',
            'source_url' => $this->input('source_url') ?: $this->headers->get('referer'),
        ]);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return array_merge($this->honeypotRules(), [
            'email' => $this->requiredApplicantEmailRules(),
            'source' => ['nullable', 'string', 'max:40'],
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
        return $this->applicantContactMessages();
    }
}