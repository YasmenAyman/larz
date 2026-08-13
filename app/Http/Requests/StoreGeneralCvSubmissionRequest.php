<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesApplicantContactFields;
use App\Http\Requests\Concerns\ValidatesHoneypot;
use App\Support\Honeypot;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreGeneralCvSubmissionRequest extends FormRequest
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
            'source_url' => $this->input('source_url') ?: $this->headers->get('referer'),
        ]);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return array_merge($this->honeypotRules(), [
            'name' => $this->applicantNameRules(),
            'email' => $this->requiredApplicantEmailRules(),
            'phone' => $this->applicantPhoneRules(),
            'city' => ['nullable', 'string', 'max:120'],
            'linkedin_url' => ['nullable', 'url', 'max:500'],
            'portfolio_url' => ['nullable', 'url', 'max:500'],
            'cover_letter' => ['nullable', 'string', 'max:10000'],
            'resume' => ['required', 'file', 'extensions:pdf,doc,docx', 'mimetypes:application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'max:10240'],
            'consent_at' => ['nullable', 'date'],
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
