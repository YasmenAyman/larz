<?php

namespace App\Services;

use App\Models\BrochureRequest;
use App\Models\ContactInquiry;
use App\Models\GeneralCvSubmission;
use App\Models\InternshipApplication;
use App\Models\JobApplication;
use App\Models\NewsletterSubscriber;
use App\Models\ProjectInquiry;
use Closure;
use Illuminate\Database\Eloquent\Model;

/**
 * Per-form metadata describing how to summarise the submission, where to
 * send the emails, and how to address the submitter in their confirmation.
 */
final class FormNotificationContext
{
    /**
     * @param  Closure(Model): array<int, array{label: string, value: string|null}>  $rows
     * @param  Closure(Model): string  $summary
     * @param  Closure(Model): string  $internalSubject
     * @param  Closure(Model): string  $submitterSubject
     * @param  Closure(Model): ?string  $submitterEmail
     */
    public function __construct(
        public string $form,
        public string $adminPath,
        public string $internalIntro,
        public ?string $nextSteps,
        public string $submitterGreeting,
        public string $submitterBody,
        public Closure $rows,
        public Closure $summary,
        public Closure $internalSubject,
        public Closure $submitterSubject,
        public Closure $submitterEmail,
    ) {
    }

    /**
     * @return array{label: string, value: string|null}
     */
    public function labelled(string $label, mixed $value): array
    {
        return ['label' => $label, 'value' => $value === null || $value === '' ? null : (string) $value];
    }

    public static function contact(): self
    {
        return new self(
            form: 'contact',
            adminPath: 'contact-inquiries',
            internalIntro: 'A new visitor submitted the public contact form.',
            nextSteps: 'Reply within the same business day and update the status once handled.',
            submitterGreeting: 'Thanks for reaching out to LARZ Developments',
            submitterBody: 'We received your message and a member of our team will be in touch within one business day.',
            rows: fn (Model $m) => [
                ['label' => 'Name', 'value' => $m->name],
                ['label' => 'Phone', 'value' => $m->phone],
                ['label' => 'Email', 'value' => $m->email],
                ['label' => 'Project', 'value' => $m->project?->title],
                ['label' => 'Message', 'value' => $m->message],
                ['label' => 'Source', 'value' => $m->source],
                ['label' => 'Source URL', 'value' => $m->source_url],
            ],
            summary: fn (Model $m) => sprintf('Submission from %s (%s).', $m->name, $m->phone),
            internalSubject: fn (Model $m) => sprintf('New contact inquiry from %s', $m->name),
            submitterSubject: fn (Model $m) => 'We received your message — LARZ Developments',
            submitterEmail: fn (Model $m) => $m->email,
        );
    }

    public static function projectInquiry(): self
    {
        return new self(
            form: 'project-inquiry',
            adminPath: 'project-inquiries',
            internalIntro: 'A new project inquiry was submitted from the public site.',
            nextSteps: 'Contact the lead using their preferred method and move the status forward.',
            submitterGreeting: 'Thanks for your interest in '.(request()->route('project')?->title ?? 'our communities'),
            submitterBody: 'A sales consultant will follow up shortly with availability, payment plans and unit details.',
            rows: fn (Model $m) => [
                ['label' => 'Name', 'value' => $m->name],
                ['label' => 'Phone', 'value' => $m->phone],
                ['label' => 'Email', 'value' => $m->email],
                ['label' => 'Preferred contact method', 'value' => $m->preferred_contact_method],
                ['label' => 'Unit type', 'value' => $m->unitType?->name],
                ['label' => 'Message', 'value' => $m->message],
                ['label' => 'Source', 'value' => $m->source],
                ['label' => 'Source URL', 'value' => $m->source_url],
            ],
            summary: fn (Model $m) => sprintf('%s asked about %s.', $m->name, $m->project?->title ?? 'a project'),
            internalSubject: fn (Model $m) => sprintf('New project inquiry: %s', $m->project?->title ?? 'Project'),
            submitterSubject: fn (Model $m) => 'Your project inquiry is in good hands',
            submitterEmail: fn (Model $m) => $m->email,
        );
    }

    public static function brochure(): self
    {
        return new self(
            form: 'brochure',
            adminPath: 'brochure-requests',
            internalIntro: 'A visitor requested a project brochure.',
            nextSteps: 'Send the brochure PDF by email and follow up by phone.',
            submitterGreeting: 'Your brochure is on the way',
            submitterBody: 'We have received your details and will email the brochure to you shortly.',
            rows: fn (Model $m) => [
                ['label' => 'Name', 'value' => $m->name],
                ['label' => 'Phone', 'value' => $m->phone],
                ['label' => 'Email', 'value' => $m->email],
                ['label' => 'Project', 'value' => $m->project?->title],
                ['label' => 'Source', 'value' => $m->source],
                ['label' => 'Source URL', 'value' => $m->source_url],
            ],
            summary: fn (Model $m) => sprintf('%s requested the brochure for %s.', $m->name, $m->project?->title ?? 'a project'),
            internalSubject: fn (Model $m) => sprintf('Brochure request for %s', $m->project?->title ?? 'project'),
            submitterSubject: fn (Model $m) => 'Your brochure is on the way',
            submitterEmail: fn (Model $m) => $m->email,
        );
    }

    public static function newsletter(): self
    {
        return new self(
            form: 'newsletter',
            adminPath: 'newsletter-subscribers',
            internalIntro: 'A new email subscribed to the newsletter.',
            nextSteps: 'Confirm the subscription double-opt-in (if enabled) before any campaigns.',
            submitterGreeting: 'You are subscribed to the LARZ newsletter',
            submitterBody: 'Look out for our latest news, stories and project launches in your inbox.',
            rows: fn (Model $m) => [
                ['label' => 'Email', 'value' => $m->email],
                ['label' => 'Source', 'value' => $m->source],
                ['label' => 'Source URL', 'value' => $m->source_url],
                ['label' => 'Status', 'value' => $m->status],
            ],
            summary: fn (Model $m) => sprintf('New subscriber: %s', $m->email),
            internalSubject: fn (Model $m) => sprintf('Newsletter subscription: %s', $m->email),
            submitterSubject: fn () => 'You are subscribed to the LARZ newsletter',
            submitterEmail: fn (Model $m) => $m->email,
        );
    }

    public static function jobApplication(): self
    {
        return new self(
            form: 'job-application',
            adminPath: 'job-applications',
            internalIntro: 'A new job application was received.',
            nextSteps: 'Screen the CV, assign a reviewer and move the status forward.',
            submitterGreeting: 'Thanks for applying to LARZ Developments',
            submitterBody: 'We received your application and our HR team will review it within five business days.',
            rows: fn (Model $m) => [
                ['label' => 'Name', 'value' => $m->name],
                ['label' => 'Email', 'value' => $m->email],
                ['label' => 'Phone', 'value' => $m->phone],
                ['label' => 'City', 'value' => $m->city],
                ['label' => 'LinkedIn', 'value' => $m->linkedin_url],
                ['label' => 'Portfolio', 'value' => $m->portfolio_url],
                ['label' => 'Position', 'value' => $m->job?->title],
                ['label' => 'Source URL', 'value' => $m->source_url],
            ],
            summary: fn (Model $m) => sprintf('%s applied for %s.', $m->name, $m->job?->title ?? 'an open role'),
            internalSubject: fn (Model $m) => sprintf('New application: %s', $m->job?->title ?? 'Open role'),
            submitterSubject: fn () => 'Thanks for applying to LARZ Developments',
            submitterEmail: fn (Model $m) => $m->email,
        );
    }

    public static function internshipApplication(): self
    {
        return new self(
            form: 'internship-application',
            adminPath: 'internship-applications',
            internalIntro: 'A new internship application was received.',
            nextSteps: 'Add to the next review cycle and respond within seven business days.',
            submitterGreeting: 'Thanks for applying to the LARZ internship program',
            submitterBody: 'We have received your application and will be in touch once we schedule interviews.',
            rows: fn (Model $m) => [
                ['label' => 'Name', 'value' => $m->name],
                ['label' => 'Email', 'value' => $m->email],
                ['label' => 'Phone', 'value' => $m->phone],
                ['label' => 'University', 'value' => $m->university],
                ['label' => 'Graduation year', 'value' => $m->graduation_year],
                ['label' => 'Program', 'value' => $m->program?->title],
                ['label' => 'Source URL', 'value' => $m->source_url],
            ],
            summary: fn (Model $m) => sprintf('%s applied for the internship program.', $m->name),
            internalSubject: fn () => 'New internship application',
            submitterSubject: fn () => 'Thanks for applying to the LARZ internship program',
            submitterEmail: fn (Model $m) => $m->email,
        );
    }

    public static function generalCv(): self
    {
        return new self(
            form: 'general-cv',
            adminPath: 'general-cv-submissions',
            internalIntro: 'A new general CV submission was received.',
            nextSteps: 'Review the CV and add it to the relevant talent pool.',
            submitterGreeting: 'Thanks for sharing your CV with LARZ Developments',
            submitterBody: 'We keep your CV on file and will reach out when a matching opportunity opens up.',
            rows: fn (Model $m) => [
                ['label' => 'Name', 'value' => $m->name],
                ['label' => 'Email', 'value' => $m->email],
                ['label' => 'Phone', 'value' => $m->phone],
                ['label' => 'City', 'value' => $m->city],
                ['label' => 'LinkedIn', 'value' => $m->linkedin_url],
                ['label' => 'Portfolio', 'value' => $m->portfolio_url],
                ['label' => 'Source URL', 'value' => $m->source_url],
            ],
            summary: fn (Model $m) => sprintf('General CV received from %s.', $m->name),
            internalSubject: fn (Model $m) => sprintf('General CV: %s', $m->name),
            submitterSubject: fn () => 'Thanks for sharing your CV with LARZ Developments',
            submitterEmail: fn (Model $m) => $m->email,
        );
    }

    /**
     * Convenience mapping used by controllers when they don't know the model
     * type ahead of persistence.
     */
    public static function forModel(Model $model): self
    {
        return match ($model::class) {
            ContactInquiry::class => self::contact(),
            ProjectInquiry::class => self::projectInquiry(),
            BrochureRequest::class => self::brochure(),
            NewsletterSubscriber::class => self::newsletter(),
            JobApplication::class => self::jobApplication(),
            InternshipApplication::class => self::internshipApplication(),
            GeneralCvSubmission::class => self::generalCv(),
            default => self::contact(),
        };
    }
}