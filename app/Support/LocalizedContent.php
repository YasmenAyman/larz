<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;

final class LocalizedContent
{
    public static function section(array $snapshot): array
    {
        if (! isset($snapshot['translations']) || ! is_array($snapshot['translations'])) {
            return self::sanitizeStrings($snapshot);
        }

        $locale = app()->getLocale();
        $overlay = $snapshot['translations'][$locale] ?? $snapshot['translations']['en'] ?? [];

        return self::sanitizeStrings(self::deepMerge($snapshot, $overlay));
    }

    /** @param  list<string>  $keys */
    public static function adminTranslations(array $snapshot, array $keys): array
    {
        $base = [];
        foreach ($keys as $key) {
            if (array_key_exists($key, $snapshot) && is_string($snapshot[$key])) {
                $base[$key] = self::sanitizeNewlines($snapshot[$key]);
            }
        }

        $translations = is_array($snapshot['translations'] ?? null) ? $snapshot['translations'] : [];

        return [
            'en' => self::sanitizeStrings(array_merge($base, is_array($translations['en'] ?? null) ? $translations['en'] : [])),
            'ar' => is_array($translations['ar'] ?? null) ? $translations['ar'] : [],
        ];
    }

    public static function sanitizeNewlines(string $value): string
    {
        $value = str_replace('\\n', ' ', $value);

        return preg_replace('/\s+/u', ' ', $value) ?? $value;
    }

    public static function sanitizeStrings(array $data): array
    {
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $data[$key] = self::sanitizeNewlines($value);
            } elseif (is_array($value)) {
                $data[$key] = self::sanitizeStrings($value);
            }
        }

        return $data;
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
