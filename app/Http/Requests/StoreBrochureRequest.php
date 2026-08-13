<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesApplicantContactFields;
use App\Http\Requests\Concerns\ValidatesHoneypot;
use App\Support\Honeypot;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBrochureRequest extends FormRequest
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
            'source' => $this->input('source') ?: 'brochure',
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
            'name' => $this->applicantNameRules(),
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => $this->applicantPhoneRules(),
            'source' => ['required', 'string', 'max:40'],
            'source_url' => ['nullable', 'url', 'max:2000'],
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