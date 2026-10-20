<?php

namespace App\Policies;

use App\Models\ServiceRequest;
use App\Models\User;

class ServiceRequestPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->is_admin;
    }

    public function view(User $user, ServiceRequest $serviceRequest): bool
    {
        return $user->is_admin;
    }

    public function update(User $user, ServiceRequest $serviceRequest): bool
    {
        return $user->is_admin;
    }
}
