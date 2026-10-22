<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceManagementTest extends TestCase
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

    private function createCategory(): Category
    {
        return Category::create([
            'name' => 'Garden',
            'slug' => 'garden',
            'sort_order' => 10,
        ]);
    }

    public function test_admin_can_create_service(): void
    {
        $admin = $this->createUser(true);
        $category = $this->createCategory();

        $response = $this->actingAs($admin)->post(
            route('admin.services.store'),
            [
                'name' => 'Territory cleanup',
                'category_id' => $category->id,
                'short_description' => 'Garden cleaning',
                'description' => 'Complete territory cleanup',
                'price_from' => '5000',
                'sort_order' => 10,
                'is_active' => true,
            ]
        );

        $response->assertRedirect(
            route('admin.services.index')
        );

        $response->assertSessionHasNoErrors();

        $this->assertDatabaseHas('services', [
            'name' => 'Territory cleanup',
            'slug' => 'territory-cleanup',
            'category_id' => $category->id,
            'is_active' => 1,
        ]);
    }

    public function test_admin_can_update_service_without_changing_slug(): void
    {
        $admin = $this->createUser(true);
        $category = $this->createCategory();

        $service = Service::create([
            'name' => 'Old service',
            'slug' => 'old-service',
            'category_id' => $category->id,
            'price_from' => 3000,
            'sort_order' => 10,
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->patch(
            route('admin.services.update', [
                'service' => $service->id,
            ]),
            [
                'name' => 'Updated service',
                'category_id' => $category->id,
                'short_description' => 'Updated description',
                'description' => 'Updated full description',
                'price_from' => '7000',
                'sort_order' => 20,
                'is_active' => false,
            ]
        );

        $response->assertRedirect(
            route('admin.services.index')
        );

        $response->assertSessionHasNoErrors();

        $service->refresh();

        $this->assertSame('Updated service', $service->name);
        $this->assertSame('old-service', $service->slug);
        $this->assertSame('7000.00', $service->price_from);
        $this->assertFalse($service->is_active);
    }

    public function test_service_cannot_be_created_with_invalid_category(): void
    {
        $admin = $this->createUser(true);

        $response = $this->actingAs($admin)->post(
            route('admin.services.store'),
            [
                'name' => 'Test service',
                'category_id' => 99999,
                'price_from' => '5000',
                'sort_order' => 0,
                'is_active' => true,
            ]
        );

        $response->assertSessionHasErrors(['category_id']);

        $this->assertDatabaseCount('services', 0);
    }

    public function test_regular_user_cannot_create_service(): void
    {
        $user = $this->createUser(false);
        $category = $this->createCategory();

        $response = $this->actingAs($user)->post(
            route('admin.services.store'),
            [
                'name' => 'Unauthorized service',
                'category_id' => $category->id,
                'sort_order' => 0,
                'is_active' => true,
            ]
        );

        $response->assertForbidden();

        $this->assertDatabaseCount('services', 0);
    }
}
