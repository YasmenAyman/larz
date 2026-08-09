<?php

namespace App\Policies;

use App\Models\MediaCategory;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MediaCategoryPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('media.view');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, MediaCategory $mediaCategory): bool
    {
        return $user->can('media.create');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('media.update');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, MediaCategory $mediaCategory): bool
    {
        return $user->can('media.delete');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, MediaCategory $mediaCategory): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, MediaCategory $mediaCategory): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, MediaCategory $mediaCategory): bool
    {
        return false;
    }
}
