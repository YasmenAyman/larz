<?php

namespace App\Policies;

use App\Models\NewsletterSubscriber;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class NewsletterSubscriberPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('newsletter.view');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, NewsletterSubscriber $newsletterSubscriber): bool
    {
        return $user->can('newsletter.update');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, NewsletterSubscriber $newsletterSubscriber): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, NewsletterSubscriber $newsletterSubscriber): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, NewsletterSubscriber $newsletterSubscriber): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, NewsletterSubscriber $newsletterSubscriber): bool
    {
        return false;
    }
}
