<?php

namespace App\Support;

final class Honeypot
{
    public const FIELD = '_hp_website';

    /**
     * Determine whether the submission is a bot based on the honeypot field.
     *
     * The hidden field is rendered with `tabindex="-1"`, `autocomplete="off"`,
     * and absolute screen-reader-hidden styling. Real users never fill it; bots
     * typically populate every available input.
     */
    public static function triggered(?string $value): bool
    {
        return is_string($value) && trim($value) !== '';
    }
}