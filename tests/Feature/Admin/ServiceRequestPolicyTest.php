<?php

namespace Tests\Feature\Admin;

use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class ServiceRequestPolicyTest extends TestCase
{
    private function makeUser(bool $isAdmin): User
    {
        $user = User::factory()->make();
        $user->is_admin = $isAdmin;

        return $user;
    }

    public function test_admin_can_view_all_requests(): void
    {
        $admin = $this->makeUser(true);

        $this->assertTrue(
            Gate::forUser($admin)->allows(
                'viewAny',
                ServiceRequest::class
            )
        );
    }

    public function test_regular_user_cannot_view_all_requests(): void
    {
        $user = $this->makeUser(false);

        $this->assertFalse(
            Gate::forUser($user)->allows(
                'viewAny',
                ServiceRequest::class
            )
        );
    }

    public function test_only_admin_can_view_and_update_request(): void
    {
        $admin = $this->makeUser(true);
        $user = $this->makeUser(false);

        $request = new ServiceRequest();

        $this->assertTrue(
            Gate::forUser($admin)->allows('view', $request)
        );

        $this->assertTrue(
            Gate::forUser($admin)->allows('update', $request)
        );

        $this->assertFalse(
            Gate::forUser($user)->allows('view', $request)
        );

        $this->assertFalse(
            Gate::forUser($user)->allows('update', $request)
        );
    }
}
