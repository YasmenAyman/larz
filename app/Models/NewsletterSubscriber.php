<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NewsletterSubscriber extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['email', 'source', 'source_url', 'status', 'consent_at', 'subscribed_at', 'unsubscribed_at'];
    protected $casts = ['consent_at' => 'datetime', 'subscribed_at' => 'datetime', 'unsubscribed_at' => 'datetime'];
}
