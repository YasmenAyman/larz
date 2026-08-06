<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNewsletterSubscriptionRequest;
use App\Models\NewsletterSubscriber;
use App\Services\FormNotificationContext;
use App\Services\FormSubmissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;

class NewsletterSubscriptionController extends Controller
{
    public function store(StoreNewsletterSubscriptionRequest $request, FormSubmissionService $submissions): RedirectResponse
    {
        $data = $request->validated();
        $email = strtolower($data['email']);

        $existing = NewsletterSubscriber::query()->withTrashed()->where('email', $email)->first();
        if ($existing && ! $existing->trashed() && $existing->status === 'active') {
            return back()->with('success', 'You are already subscribed — thanks for being a part of our newsletter.');
        }

        if ($existing && $existing->trashed()) {
            $existing->restore();
        }

        $payload = [
            'email' => $email,
            'source' => $data['source'] ?? 'newsletter',
            'source_url' => $data['source_url'] ?? null,
            'status' => 'active',
            'subscribed_at' => Carbon::now(),
            'unsubscribed_at' => null,
            'consent_at' => ! empty($data['consent_at']) ? Carbon::parse($data['consent_at']) : Carbon::now(),
        ];

        $submissions->record(
            $existing ?: new NewsletterSubscriber,
            $payload,
            FormNotificationContext::newsletter(),
        );

        return back()->with('success', 'Thanks — you are now subscribed to the LARZ newsletter.');
    }
}