<?php

namespace App\Policies;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PopupPolicy
{
    use HandlesAuthorization;

    public function index(User $user) {
        return $user->hasPermission('popups.view');
    }

    public function show(User $user) {
        return $user->hasPermission('popups.view');
    }

    public function store(User $user) {
        return $user->hasPermission('popups.create');
    }

    public function update(User $user) {
        return $user->hasPermission('popups.update');
    }

    public function destroy(User $user) {
        return $user->hasPermission('popups.delete');
    }
}
