@php
    /** @var string $greeting */
    /** @var string $body */
    /** @var string|null $reference */
@endphp
@component('mail::message')
# {{ $greeting }}

{{ $body }}

@isset($reference)
Reference number: **{{ $reference }}**
@endisset

If you have any questions in the meantime, simply reply to this email and a member of the LARZ team will assist you.

Warm regards,
The {{ config('app.name') }} team
@endcomponent