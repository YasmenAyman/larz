<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactInquiryRequest;
use App\Models\ContactInquiry;
use App\Services\FormNotificationContext;
use App\Services\FormSubmissionService;
use App\Support\LocalizedContent;
use App\Support\WebsiteContent;
use App\Services\SeoMetadataService;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(SeoMetadataService $seo): Response
    {
        $settings = \App\Models\SiteSetting::query()->whereIn('key', ['social.instagram', 'social.facebook', 'social.linkedin', 'social.youtube', 'contact.phone', 'contact.email', 'whatsapp.number', 'whatsapp.message'])->pluck('value', 'key');
        $social = [
            'instagram' => $settings['social.instagram'] ?? null,
            'facebook' => $settings['social.facebook'] ?? null,
            'linkedin' => $settings['social.linkedin'] ?? null,
            'youtube' => $settings['social.youtube'] ?? null,
        ];
        $heroRaw = WebsiteContent::sectionSnapshot('contact', 'hero');
        $hero = LocalizedContent::section($heroRaw);
        $primaryCtaUrl = $this->resolvePrimaryCtaUrl($hero['primary_cta_url'] ?? '#request');
        $secondaryCtaUrl = $this->resolveWhatsAppUrl($hero['secondary_cta_url'] ?? '#whatsapp', $settings);
        $methods = WebsiteContent::section('contact', 'contact_methods');
        $cards = $methods['items'] ?? [];
        $requestFormSnapshot = WebsiteContent::sectionSnapshot('contact', 'request_form');

        $locationRaw = WebsiteContent::sectionSnapshot('contact', 'location_map');
        $locationTranslations = is_array($locationRaw['translations'] ?? null) ? $locationRaw['translations'] : ['en' => $locationRaw, 'ar' => []];
        $locale = app()->getLocale();
        $locationCopy = $locationTranslations[$locale] ?? $locationTranslations['en'] ?? [];
        $addressSetting = \App\Models\SiteSetting::query()->where('key', $locale === 'ar' ? 'contact.address_ar' : 'contact.address')->value('value');
        if (! $addressSetting) {
            $addressSetting = \App\Models\SiteSetting::query()->where('key', 'contact.address')->value('value');
        }
        $locationImage = null;
        if (! empty($locationRaw['image_id'])) {
            $locationImage = \App\Support\WebsiteContent::assetUrl(\App\Models\MediaAsset::find($locationRaw['image_id']));
        }

        $socialMediaRaw = WebsiteContent::section('contact', 'social_media');
        $socialMediaTranslations = is_array($socialMediaRaw['translations'] ?? null) ? $socialMediaRaw['translations'] : ['en' => $socialMediaRaw, 'ar' => []];
        $socialMediaCopy = $socialMediaTranslations[$locale] ?? $socialMediaTranslations['en'] ?? [];

        return Inertia::render('Website/Contact/Index', [
            'contact_methods' => [
                'eyebrow' => $methods['eyebrow'] ?? 'Get in touch',
                'heading' => $methods['heading'] ?? 'However suits you best.',
                'description' => $methods['description'] ?? '',
                'items' => $cards,
            ],
            'contact' => [
                'phone' => collect($cards)->firstWhere('key', 'hotline')['value'] ?? null,
                'whatsapp' => collect($cards)->firstWhere('key', 'whatsapp')['value'] ?? null,
                'email' => collect($cards)->firstWhere('key', 'email')['value'] ?? null,
                'sales_office' => collect($cards)->firstWhere('key', 'sales_office')['value'] ?? null,
                'address' => collect($cards)->firstWhere('key', 'sales_office')['note'] ?? null,
            ],
            'projects' => \App\Models\Project::query()->where('is_published', true)->orderBy('sort_order')->get(['id', 'title'])->map(fn ($project) => ['id' => $project->id, 'title' => $project->title])->values()->all(),
            'request_form' => [
                'eyebrow' => LocalizedContent::field($requestFormSnapshot, 'eyebrow', 'Request pricing / tour'),
                'heading' => LocalizedContent::field($requestFormSnapshot, 'heading', 'Book a visit or request pricing.'),
                'description' => LocalizedContent::field($requestFormSnapshot, 'description', ''),
            ],
            'location_map' => [
                'eyebrow' => $locationCopy['eyebrow'] ?? 'Location & map',
                'heading' => $locationCopy['heading'] ?? 'Find us.',
                'description' => $locationCopy['description'] ?? '',
                'cta_label' => $locationCopy['cta_label'] ?? 'Get directions',
                'cta_url' => $locationCopy['cta_url'] ?? '#directions',
                'image' => $locationImage,
                'address' => $addressSetting ?? '',
            ],
            'hero' => [
                'eyebrow' => $hero['eyebrow'] ?? 'Contact us',
                'heading' => $hero['heading'] ?? '',
                'description' => $hero['description'] ?? '',
                'primary_cta_label' => $hero['primary_cta_label'] ?? 'Request pricing & a tour',
                'primary_cta_url' => $primaryCtaUrl,
                'secondary_cta_label' => $hero['secondary_cta_label'] ?? 'WhatsApp us',
                'secondary_cta_url' => $secondaryCtaUrl,
            ],
            'location' => WebsiteContent::section('contact', 'location'),
            'social' => $social,
            'social_media' => [
                'eyebrow' => $socialMediaCopy['eyebrow'] ?? 'Social media',
                'heading' => $socialMediaCopy['heading'] ?? 'Follow LARZ.',
            ],
            'contact_phone' => $settings['contact.phone'] ?? null,
            'contact_email' => $settings['contact.email'] ?? null,
            'seo' => $seo->forPage('contact', '/contact-us', ['title' => 'Contact | LARZ Developments'], [
                $seo->breadcrumbs([['name' => 'Home', 'url' => url('/')], ['name' => 'Contact Us', 'url' => url('/contact-us')]]),
            ]),
        ]);
    }

    private function resolvePrimaryCtaUrl(string $url): string
    {
        return $url === '#contact-form' ? '#request' : $url;
    }

    /** @param  \Illuminate\Support\Collection<string, string|null>  $settings */
    private function resolveWhatsAppUrl(string $url, \Illuminate\Support\Collection $settings): string
    {
        if ($url !== '#whatsapp' && ! str_starts_with($url, 'tel:')) {
            return $url;
        }

        $whatsappNumber = $settings['whatsapp.number'] ?? null;
        if (! $whatsappNumber) {
            return $url;
        }

        $whatsappUrl = 'https://wa.me/'.preg_replace('/[^0-9]/', '', $whatsappNumber);
        $whatsappMessage = $settings['whatsapp.message'] ?? null;

        if ($whatsappMessage) {
            $whatsappUrl .= '?text='.rawurlencode($whatsappMessage);
        }

        return $whatsappUrl;
    }

    public function submit(StoreContactInquiryRequest $request, FormSubmissionService $submissions): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validated();
        $data['status'] = 'new';
        $data['assigned_to'] = null;
        if (! empty($data['consent_at'])) {
            $data['consent_at'] = \Illuminate\Support\Carbon::parse($data['consent_at']);
        }

        $submissions->record(new ContactInquiry, $data, FormNotificationContext::contact());

        return back()->with('success', 'Thanks — we received your request and will reply within one business day.');
    }
}
