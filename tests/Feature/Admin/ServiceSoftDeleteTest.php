<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceSoftDeleteTest extends TestCase
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

    private function createService(bool $isActive = true): Service
    {
        $category = Category::create([
            'name' => 'Garden',
            'slug' => 'garden',
            'sort_order' => 10,
        ]);

        return Service::create([
            'category_id' => $category->id,
            'name' => 'Lawn mowing',
            'slug' => 'lawn-mowing',
            'price_from' => 5000,
            'sort_order' => 10,
            'is_active' => $isActive,
        ]);
    }

    public function test_admin_can_soft_delete_service(): void
    {
        $admin = $this->createUser(true);
        $service = $this->createService();

        $response = $this->actingAs($admin)->delete(
            route('admin.services.destroy', [
                'service' => $service->id,
            ])
        );

        $response->assertRedirect(route('admin.services.index'));

        $this->assertSoftDeleted($service);

        $this->assertNull(Service::find($service->id));

        $this->assertNotNull(
            Service::withTrashed()->find($service->id)
        );
    }

    public function test_admin_can_restore_deleted_service(): void
    {
        $admin = $this->createUser(true);
        $service = $this->createService(false);

        $service->delete();

        $response = $this->actingAs($admin)->patch(
            route('admin.services.restore', [
                'service' => $service->id,
            ])
        );

        $response->assertRedirect(route('admin.services.trashed'));

        $this->assertNotSoftDeleted($service);

        $restored = Service::findOrFail($service->id);

        $this->assertSame('lawn-mowing', $restored->slug);
        $this->assertFalse($restored->is_active);
    }

    public function test_active_service_cannot_be_restored(): void
    {
        $admin = $this->createUser(true);
        $service = $this->createService();

        $response = $this->actingAs($admin)->patch(
            route('admin.services.restore', [
                'service' => $service->id,
            ])
        );

        $response->assertNotFound();

        $this->assertNotSoftDeleted($service);
    }

    public function test_regular_user_cannot_delete_or_restore_service(): void
    {
        $user = $this->createUser(false);
        $service = $this->createService();

        $this->actingAs($user)->delete(
            route('admin.services.destroy', [
                'service' => $service->id,
            ])
        )->assertForbidden();

        $this->assertNotSoftDeleted($service);

        $service->delete();

        $this->actingAs($user)->patch(
            route('admin.services.restore', [
                'service' => $service->id,
            ])
        )->assertForbidden();

        $this->assertSoftDeleted($service);
    }

    public function test_deleting_service_preserves_request_history(): void
    {
        $admin = $this->createUser(true);
        $service = $this->createService();

        $request = ServiceRequest::create([
            'name' => 'Анна',
            'phone' => '+374 91 123 456',
            'email' => 'anna@example.test',
        ]);

        $item = $request->items()->create([
            'service_id' => $service->id,
            'service_name' => $service->name,
            'price' => 5000,
            'quantity' => 1,
        ]);

        $this->actingAs($admin)->delete(
            route('admin.services.destroy', [
                'service' => $service->id,
            ])
        )->assertRedirect(route('admin.services.index'));

        $this->assertSoftDeleted($service);

        $this->assertDatabaseHas('request_items', [
            'id' => $item->id,
            'service_id' => $service->id,
            'service_name' => 'Lawn mowing',
            'quantity' => 1,
        ]);

        $this->assertDatabaseHas('service_requests', [
            'id' => $request->id,
            'name' => 'Анна',
        ]);
    }
}
