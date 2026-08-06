<?php

namespace App\Services;

/**
 * @internal Lightweight value object used by {@see FormSubmissionService}
 *           to carry notification payload data without leaking Laravel's
 *           Mailable internals.
 */
final class MailablePayload
{
    /**
     * @param  array<int, array{label: string, value: string|null}>  $rows
     */
    public function __construct(
        public string $recipient,
        public string $subject,
        public string $intro,
        public string $summary,
        public array $rows,
        public ?string $nextSteps = null,
        public ?string $actionUrl = null,
        public ?string $actionLabel = null,
    ) {
    }
}