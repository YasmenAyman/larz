<?php

namespace App\Http\Requests\Concerns;

trait ValidatesApplicantContactFields
{
    /**
     * @return array<int, string>
     */
    protected function applicantNameRules(): array
    {
        return ['required', 'string', 'max:160', 'regex:/^[\p{L}\s]+$/u'];
    }

    /**
     * @return array<int, string>
     */
    protected function applicantPhoneRules(): array
    {
        return ['required', 'string', 'regex:/^[0-9]+$/', 'min:6', 'max:40'];
    }

    /**
     * @return array<int, string>
     */
    protected function requiredApplicantEmailRules(): array
    {
        return ['required', 'string', 'max:255', 'regex:/^[^\s@]+@[^\s@]+\.[^\s@]+$/'];
    }

    /**
     * @return array<string, string>
     */
    protected function applicantContactMessages(): array
    {
        return [
            'name.regex' => 'The name may only contain letters.',
            'phone.regex' => 'The phone may only contain numbers.',
            'email.regex' => 'Please enter a valid email address (e.g. name@example.com).',
        ];
    }
}
