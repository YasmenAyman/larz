<?php

namespace App\Http\Requests\Concerns;

use App\Support\Honeypot;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

trait ValidatesHoneypot
{
    /**
     * Run the honeypot check before the standard rules so failures are silent.
     *
     * Bots that fill the hidden field are rejected with a generic validation
     * error so they cannot tell the difference from a real failure.
     */
    protected function ensureHoneypotIsClean(): void
    {
        $value = $this->input(Honeypot::FIELD);

        if (Honeypot::triggered($value)) {
            $validator = Validator::make([], []);
            $validator->errors()->add(Honeypot::FIELD, 'Submission rejected.');
            throw new ValidationException($validator);
        }
    }

    /**
     * Shared rules for any FormRequest that wants honeypot enforcement.
     */
    protected function honeypotRules(): array
    {
        return [Honeypot::FIELD => ['nullable', 'string', 'max:255']];
    }
}