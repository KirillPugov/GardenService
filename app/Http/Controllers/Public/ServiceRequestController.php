<?php

namespace App\Http\Controllers\Public;

use App\Enums\RequestStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Models\Service;
use App\Models\ServiceRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ServiceRequestController extends Controller
{
    public function create(): Response
    {
        $services = Service::query()
            ->select([
                'id',
                'category_id',
                'name',
                'short_description',
                'price_from',
            ])
            ->with('category:id,name')
            ->where('is_active', true)
            ->whereHas('category')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn (Service $service): array => [
                'id' => $service->id,
                'name' => $service->name,
                'description' => $service->short_description,
                'price_from' => $service->price_from,
                'category' => $service->category->name,
            ]);

        return Inertia::render('public/requests/create', [
            'services' => $services,
            'success' => session('success'),
        ]);
    }

    public function store(StoreServiceRequest $request): RedirectResponse
    {
        $data = $request->validated();

        DB::transaction(function () use ($data): void {
            $serviceIds = array_column(
                $data['items'],
                'service_id'
            );

            $services = Service::query()
                ->whereIn('id', $serviceIds)
                ->where('is_active', true)
                ->whereHas('category')
                ->get()
                ->keyBy('id');

            if ($services->count() !== count($serviceIds)) {
                throw ValidationException::withMessages([
                    'items' => 'Одна или несколько услуг недоступны.',
                ]);
            }

            $serviceRequest = ServiceRequest::create([
                'user_id' => Auth::id(),
                'name' => $data['name'],
                'phone' => $data['phone'],
                'email' => $data['email'] ?? null,
                'comment' => $data['comment'] ?? null,
                'status' => RequestStatus::New,
            ]);

            foreach ($data['items'] as $item) {
                $service = $services->get($item['service_id']);

                $serviceRequest->items()->create([
                    'service_id' => $service->id,
                    'service_name' => $service->name,
                    'price' => $service->price_from,
                    'quantity' => $item['quantity'],
                    'note' => $item['note'] ?? null,
                ]);
            }
        });

        return to_route('requests.create')
            ->with('success', 'Заявка успешно отправлена!');
    }
}
