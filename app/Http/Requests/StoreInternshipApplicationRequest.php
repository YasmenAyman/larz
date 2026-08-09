<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesHoneypot;
use App\Support\Honeypot;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreInternshipApplicationRequest extends FormRequest
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
            'source_url' => $this->input('source_url') ?: $this->headers->get('referer'),
        ]);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return array_merge($this->honeypotRules(), [
            'internship_program_id' => ['required', 'integer', 'exists:internship_programs,id'],
            'name' => ['required', 'string', 'max:160'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'min:6', 'max:40'],
            'city' => ['nullable', 'string', 'max:120'],
            'university' => ['nullable', 'string', 'max:180'],
            'graduation_year' => ['nullable', 'integer', 'min:1900', 'max:2200'],
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
}
