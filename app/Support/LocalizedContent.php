<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;

final class LocalizedContent
{
    public static function section(array $snapshot): array
    {
        if (! isset($snapshot['translations']) || ! is_array($snapshot['translations'])) {
            return $snapshot;
        }

        $locale = app()->getLocale();
        $overlay = $snapshot['translations'][$locale] ?? $snapshot['translations']['en'] ?? [];

        return self::deepMerge($snapshot, $overlay);
    }

    public static function record(Model $record, array $fields): array
    {
        $translations = $record->getAttribute('translations');
        if (! is_array($translations)) {
            return [];
        }

        $locale = app()->getLocale();
        $values = $translations[$locale] ?? $translations['en'] ?? [];

        return array_intersect_key($values, array_flip($fields));
    }

    /**
     * Merge $overlay into $base so that nested arrays (e.g. items[]) are
     * preserved when the overlay only defines a subset of keys.
     */
    private static function deepMerge(array $base, array $overlay): array
    {
        foreach ($overlay as $key => $value) {
            if (is_array($value) && isset($base[$key]) && is_array($base[$key]) && self::isAssoc($value) && self::isAssoc($base[$key])) {
                $base[$key] = self::deepMerge($base[$key], $value);
            } else {
                $base[$key] = $value;
            }
        }
        return $base;
    }

    private static function isAssoc(array $arr): bool
    {
        if ($arr === []) {
            return false;
        }
        return array_keys($arr) !== range(0, count($arr) - 1);
    }
}
