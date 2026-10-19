<?php

namespace Tests\Feature\Public;

use App\Enums\RequestStatus;
use App\Models\Category;
use App\Models\Service;
use App\Models\ServiceRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceRequestTest extends TestCase
{
    use RefreshDatabase;

    private function createService(bool $isActive = true): Service
    {
        $category = Category::create([
            'name' => 'Сад',
            'slug' => 'garden',
            'sort_order' => 10,
        ]);

        return Service::create([
            'category_id' => $category->id,
            'name' => 'Стрижка газона',
            'slug' => 'lawn-mowing',
            'price_from' => '5000.00',
            'is_active' => $isActive,
        ]);
    }

    public function test_guest_can_create_service_request(): void
    {
        $service = $this->createService();

        $response = $this->post(route('requests.store'), [
            'name' => 'Анна',
            'phone' => '+374 91 123 456',
            'email' => 'anna@example.test',
            'comment' => 'Желательно утром',
            'items' => [
                [
                    'service_id' => $service->id,
                    'quantity' => 2,
                    'note' => 'Участок около 500 м²',
                ],
            ],
        ]);

        $response->assertRedirect(route('requests.create'));
        $response->assertSessionHasNoErrors();
        $response->assertSessionHas(
            'success',
            'Заявка успешно отправлена!'
        );

        $this->assertDatabaseHas('service_requests', [
            'name' => 'Анна',
            'email' => 'anna@example.test',
            'status' => 'new',
            'user_id' => null,
        ]);

        $request = ServiceRequest::query()
            ->where('email', 'anna@example.test')
            ->firstOrFail();

        $this->assertSame(RequestStatus::New, $request->status);
        $this->assertCount(1, $request->items);

        $item = $request->items->first();

        $this->assertSame($service->id, $item->service_id);
        $this->assertSame('Стрижка газона', $item->service_name);
        $this->assertSame('5000.00', $item->price);
        $this->assertSame(2, $item->quantity);
    }

    public function test_invalid_request_is_rejected(): void
    {
        $response = $this->post(route('requests.store'), [
            'name' => '',
            'phone' => '123',
            'email' => 'invalid-email',
            'items' => [],
        ]);

        $response->assertSessionHasErrors([
            'name',
            'phone',
            'email',
            'items',
        ]);

        $this->assertDatabaseCount('service_requests', 0);
        $this->assertDatabaseCount('request_items', 0);
    }

    public function test_inactive_service_cannot_be_requested(): void
    {
        $service = $this->createService(false);

        $response = $this->post(route('requests.store'), [
            'name' => 'Арман',
            'phone' => '+374 91 123 456',
            'items' => [
                [
                    'service_id' => $service->id,
                    'quantity' => 1,
                ],
            ],
        ]);

        $response->assertSessionHasErrors([
            'items.0.service_id',
        ]);

        $this->assertDatabaseCount('service_requests', 0);
    }

    public function test_service_with_deleted_category_is_rejected(): void
    {
        $service = $this->createService();

        $service->category->delete();

        $response = $this->post(route('requests.store'), [
            'name' => 'Давид',
            'phone' => '+374 91 123 456',
            'items' => [
                [
                    'service_id' => $service->id,
                    'quantity' => 1,
                ],
            ],
        ]);

        $response->assertSessionHasErrors(['items']);

        $this->assertDatabaseCount('service_requests', 0);
        $this->assertDatabaseCount('request_items', 0);
    }
}
