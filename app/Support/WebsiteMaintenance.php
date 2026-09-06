<?php

namespace App\Support;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;

final class WebsiteMaintenance
{
    private const CACHE_KEY = 'website.maintenance';

    /** @return array{enabled: bool, title_en: string, message_en: string, title_ar: string, message_ar: string} */
    public static function settings(): array
    {
        return Cache::remember(self::CACHE_KEY, now()->addHour(), function (): array {
            $values = SiteSetting::query()
                ->where('group_name', 'maintenance')
                ->pluck('value', 'key')
                ->all();

            return [
                'enabled' => filter_var($values['maintenance.enabled'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'title_en' => $values['maintenance.title_en'] ?? 'We’ll be back soon.',
                'message_en' => $values['maintenance.message_en'] ?? 'We are making a few improvements to serve you better. Please check back shortly.',
                'title_ar' => $values['maintenance.title_ar'] ?? 'سنعود قريبًا.',
                'message_ar' => $values['maintenance.message_ar'] ?? 'نعمل على بعض التحسينات لنقدم لك تجربة أفضل. يرجى العودة بعد قليل.',
            ];
        });
    }

    public static function clear(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}
