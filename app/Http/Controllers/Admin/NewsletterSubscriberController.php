<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateNewsletterSubscriberRequest;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response;

class NewsletterSubscriberController extends Controller
{
    public function index(Request $request): Response { $subscribers = NewsletterSubscriber::query()->when($request->string('search')->isNotEmpty(), fn ($q) => $q->where('email', 'like', '%'.$request->string('search').'%'))->orderByDesc('subscribed_at')->paginate(25)->withQueryString(); return Inertia::render('Admin/Media/Newsletter/Index', ['subscribers' => $subscribers->through(fn ($item) => ['id' => $item->id, 'email' => $item->email, 'status' => $item->status, 'subscribed_at' => $item->subscribed_at?->toDateTimeString()]), 'filters' => $request->only('search')]); }
    public function update(UpdateNewsletterSubscriberRequest $request, NewsletterSubscriber $newsletterSubscriber): RedirectResponse { $newsletterSubscriber->update(['status' => $request->validated('status'), 'unsubscribed_at' => $request->validated('status') === 'unsubscribed' ? now() : null]); return back()->with('success', 'Subscriber status updated.'); }
    public function export(): StreamedResponse { return response()->streamDownload(function () { $handle = fopen('php://output', 'w'); fputcsv($handle, ['email', 'status', 'subscribed_at']); NewsletterSubscriber::orderBy('id')->chunk(500, function ($items) use ($handle) { foreach ($items as $item) fputcsv($handle, [$item->email, $item->status, $item->subscribed_at]); }); fclose($handle); }, 'newsletter-subscribers.csv', ['Content-Type' => 'text/csv']); }
}
