@php
    /** @var string|null $subject */
    /** @var string $intro */
    /** @var string $summary */
    /** @var array<int, array{label: string, value: string|null}> $rows */
    /** @var string|null $nextSteps */
@endphp
@component('mail::message')
{{ $subject }}

{{ $intro }}

{{ $summary }}

@component('mail::panel')
@foreach ($rows as $row)
**{{ $row['label'] }}:** {{ $row['value'] ?? '—' }}

@endforeach
@endcomponent

@if (! empty($nextSteps))
{{ $nextSteps }}

@endif

@isset($actionUrl)
@component('mail::button', ['url' => $actionUrl])
{{ $actionLabel ?? 'Open admin dashboard' }}
@endcomponent
@endisset

Thanks,
{{ config('app.name') }}
@endcomponent