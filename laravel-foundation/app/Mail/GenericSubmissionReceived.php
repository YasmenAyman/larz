<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class GenericSubmissionReceived extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * @param  array<int, array{label: string, value: string|null}>  $rows
     * @param  array<string, mixed>  $context
     */
    public function __construct(
        public string $subjectLine,
        public string $intro,
        public string $summary,
        public array $rows,
        public ?string $nextSteps = null,
        public ?string $actionUrl = null,
        public ?string $actionLabel = null,
        public array $context = [],
    ) {
        $this->onQueue('notifications');
    }

    public function build(): self
    {
        return $this->subject($this->subjectLine)
            ->view('emails.partials.generic-submission', [
                'subject' => $this->subjectLine,
                'intro' => $this->intro,
                'summary' => $this->summary,
                'rows' => $this->rows,
                'nextSteps' => $this->nextSteps,
                'actionUrl' => $this->actionUrl,
                'actionLabel' => $this->actionLabel,
            ])
            ->with($this->context);
    }
}