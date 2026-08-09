<?php

namespace App\Services;

final class RichTextSanitizer
{
    private const ALLOWED_TAGS = '<p><br><strong><b><em><i><ul><ol><li><blockquote><a>';

    public function sanitize(?string $value): ?string
    {
        if ($value === null) return null;

        $value = strip_tags($value, self::ALLOWED_TAGS);
        $value = preg_replace('/\s+on[a-z0-9_-]+\s*=\s*(["\'])[^"\']*\1/i', '', $value) ?? $value;
        $value = preg_replace('/(href|src)\s*=\s*(["\'])\s*(?:javascript|vbscript|data)\s*:[^"\']*\2/i', '$1="#"', $value) ?? $value;
        $value = preg_replace('/<a\b(?![^>]*\brel=)/i', '<a rel="nofollow noopener noreferrer"', $value) ?? $value;

        return $value;
    }

    public function sanitizeArray(array $value): array
    {
        foreach ($value as $key => $item) {
            $value[$key] = is_array($item) ? $this->sanitizeArray($item) : (is_string($item) ? $this->sanitize($item) : $item);
        }

        return $value;
    }
}
