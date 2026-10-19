<?php

namespace Tests\Feature\Admin;

use App\Enums\RequestStatus;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceRequestStatusTest extends TestCase
{
    use RefreshDatabase;

    private function createUser(bool $isAdmin): User
    {
        $user = User::factory()->create();

        $user->is_admin = $isAdmin;
        $user->email_verified_at = now();
        $user->save();

        return $user;
    }

    private function createRequest(): ServiceRequest
    {
        return ServiceRequest::create([
            'name' => 'Анна',
            'phone' => '+374 91 123 456',
            'email' => 'anna@example.test',
            'status' => RequestStatus::New,
        ]);
    }

    public function test_admin_can_update_request_status(): void
    {
        $admin = $this->createUser(true);
        $request = $this->createRequest();

        $response = $this->actingAs($admin)->patch(
            route('admin.requests.status.update', [
                'serviceRequest' => $request->id,
            ]),
            [
                'status' => RequestStatus::InProgress->value,
            ]
        );

        $response->assertRedirect(
            route('admin.requests.show', [
                'serviceRequest' => $request->id,
            ])
        );

        $response->assertSessionHasNoErrors();

        $this->assertDatabaseHas('service_requests', [
            'id' => $request->id,
            'status' => 'in_progress',
        ]);

        $this->assertSame(
            RequestStatus::InProgress,
            $request->fresh()->status
        );
    }

    public function test_regular_user_cannot_update_status(): void
    {
        $user = $this->createUser(false);
        $request = $this->createRequest();

        $response = $this->actingAs($user)->patch(
            route('admin.requests.status.update', [
                'serviceRequest' => $request->id,
            ]),
            [
                'status' => 'done',
            ]
        );

        $response->assertForbidden();

        $this->assertSame(
            RequestStatus::New,
            $request->fresh()->status
        );
    }

    public function test_invalid_status_is_rejected(): void
    {
        $admin = $this->createUser(true);
        $request = $this->createRequest();

        $response = $this->actingAs($admin)->patch(
            route('admin.requests.status.update', [
                'serviceRequest' => $request->id,
            ]),
            [
                'status' => 'unknown_status',
            ]
        );

        $response->assertSessionHasErrors(['status']);

        $this->assertSame(
            RequestStatus::New,
            $request->fresh()->status
        );
    }

    public function test_guest_cannot_update_status(): void
    {
        $request = $this->createRequest();

        $response = $this->patch(
            route('admin.requests.status.update', [
                'serviceRequest' => $request->id,
            ]),
            [
                'status' => 'done',
            ]
        );

        $response->assertRedirect(route('login'));

        $this->assertSame(
            RequestStatus::New,
            $request->fresh()->status
        );
    }
}
