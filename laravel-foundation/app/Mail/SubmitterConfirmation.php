<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SubmitterConfirmation extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $greeting,
        public string $body,
        public ?string $reference = null,
        public string $queueName = 'notifications',
    ) {
        $this->onQueue($this->queueName);
    }

    public function build(): self
    {
        return $this->subject($this->greeting)
            ->view('emails.partials.submitter-confirmation', [
                'greeting' => $this->greeting,
                'body' => $this->body,
                'reference' => $this->reference,
            ]);
    }
}