<?php

namespace App\Support;

use App\Models\SiteSetting;

final class FormRecipients
{
    /**
     * Get the recipient email address for internal notifications.
     */
    public static function recipient(): string
    {
        $configured = SiteSetting::query()->where('key', 'forms.recipient_email')->value('value');

        if (is_string($configured) && filter_var($configured, FILTER_VALIDATE_EMAIL)) {
            return $configured;
        }

        $fallback = SiteSetting::query()->where('key', 'contact.email')->value('value');

        if (is_string($fallback) && filter_var($fallback, FILTER_VALIDATE_EMAIL)) {
            return $fallback;
        }

        return (string) (config('mail.from.address') ?: 'info@larzdevelopments.com');
    }

    /**
     * Get the sender / "from" address used for outgoing submission notifications.
     */
    public static function fromAddress(): string
    {
        return (string) (config('mail.from.address') ?: self::recipient());
    }

    public static function fromName(): string
    {
        return (string) (config('mail.from.name') ?: config('app.name'));
    }
}