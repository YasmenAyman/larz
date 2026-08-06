<?php

namespace App\Services;

use App\Mail\GenericSubmissionReceived;
use App\Support\FormRecipients;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * Centralized helper for public form submissions.
 *
 * Persists the record first, then attempts the notification emails so we
 * never lose a submission because the mail transport is misconfigured.
 */
final class FormSubmissionService
{
    /**
     * Persist a submission and dispatch the optional internal + confirmation
     * emails. Mail failures are logged but never bubble up.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function record(Model $model, array $attributes, FormNotificationContext $context): Model
    {
        return DB::transaction(function () use ($model, $attributes, $context) {
            $record = $model->newInstance();
            $record->forceFill($attributes)->save();
            $this->dispatchNotifications($record, $context);
            return $record;
        });
    }

    private function dispatchNotifications(Model $record, FormNotificationContext $context): void
    {
        $internal = $this->buildInternalMail($record, $context);
        $submitter = $this->buildSubmitterMail($record, $context);

        if ($internal) {
            $this->safeSend($internal, $record, $context, 'internal');
        }

        if ($submitter) {
            $this->safeSend($submitter, $record, $context, 'submitter');
        }
    }

    private function safeSend(MailablePayload $payload, Model $record, FormNotificationContext $context, string $kind): void
    {
        $recipient = $kind === 'internal' ? FormRecipients::recipient() : ($payload->recipient ?: FormRecipients::recipient());

        try {
            Mail::to($recipient)
                ->send(new GenericSubmissionReceived(
                    subjectLine: $payload->subject,
                    intro: $payload->intro,
                    summary: $payload->summary,
                    rows: $payload->rows,
                    nextSteps: $payload->nextSteps,
                    actionUrl: $payload->actionUrl,
                    actionLabel: $payload->actionLabel,
                ));
        } catch (Throwable $exception) {
            Log::warning('form_submission.notification_failed', [
                'kind' => $kind,
                'form' => $context->form,
                'submission_id' => $record->getKey(),
                'recipient' => $recipient,
                'error' => $exception->getMessage(),
            ]);
        }
    }

    private function buildInternalMail(Model $record, FormNotificationContext $context): ?MailablePayload
    {
        $summary = ($context->summary)($record);
        $rows = ($context->rows)($record);

        $actionUrl = url('/admin/'.$context->adminPath.'/'.$record->getKey());

        return new MailablePayload(
            recipient: FormRecipients::recipient(),
            subject: ($context->internalSubject)($record),
            intro: $context->internalIntro,
            summary: $summary,
            rows: $rows,
            nextSteps: $context->nextSteps,
            actionUrl: $actionUrl,
            actionLabel: 'Open in admin',
        );
    }

    private function buildSubmitterMail(Model $record, FormNotificationContext $context): ?MailablePayload
    {
        $email = ($context->submitterEmail)($record);
        if (! $email) {
            return null;
        }

        return new MailablePayload(
            recipient: $email,
            subject: ($context->submitterSubject)($record),
            intro: $context->submitterGreeting,
            summary: $context->submitterBody,
            rows: [],
            nextSteps: null,
            actionUrl: null,
            actionLabel: null,
        );
    }
}