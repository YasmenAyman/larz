<?php

namespace App\Http\Middleware;

use App\Support\WebsiteMaintenance;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ShowMaintenancePage
{
    public function handle(Request $request, Closure $next): Response
    {
        $settings = WebsiteMaintenance::settings();

        if (! $settings['enabled'] || $this->isAllowedPath($request)) {
            return $next($request);
        }

        $isArabic = app()->getLocale() === 'ar';
        $response = Inertia::render('Website/Maintenance', [
            'locale' => $isArabic ? 'ar' : 'en',
            'title' => $isArabic ? $settings['title_ar'] : $settings['title_en'],
            'message' => $isArabic ? $settings['message_ar'] : $settings['message_en'],
        ])->toResponse($request);

        $response->setStatusCode(Response::HTTP_SERVICE_UNAVAILABLE);
        $response->headers->set('Retry-After', '3600');
        $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate');

        return $response;
    }

    private function isAllowedPath(Request $request): bool
    {
        return $request->is(
            'admin',
            'admin/*',
            'login',
            'register',
            'forgot-password',
            'reset-password/*',
            'verify-email',
            'verify-email/*',
            'confirm-password',
            'language/*',
            'up',
            'build/*',
            'storage/*',
        );
    }
}
