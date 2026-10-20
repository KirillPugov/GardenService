<?php

namespace App\Http\Controllers\Admin;

use App\Enums\RequestStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateServiceRequestStatus;
use Illuminate\Support\Facades\Gate;
use App\Models\ServiceRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ServiceRequestController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', ServiceRequest::class);
        $requests = ServiceRequest::query()
            ->select([
                'id',
                'name',
                'phone',
                'email',
                'status',
                'created_at',
            ])
            ->withCount('items')
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate(10)
            ->through(fn (ServiceRequest $request): array => [
                'id' => $request->id,
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'status' => [
                    'value' => $request->status->value,
                    'label' => $request->status->label(),
                ],
                'items_count' => $request->items_count,
                'created_at' => $request->created_at->toIso8601String(),
            ]);

        return Inertia::render('admin/requests/index', [
            'requests' => $requests,
        ]);
    }

    public function show(ServiceRequest $serviceRequest): Response
    {
        Gate::authorize('view', $serviceRequest);
        $serviceRequest->load('items');

        return Inertia::render('admin/requests/show', [
            'request' => [
                'id' => $serviceRequest->id,
                'name' => $serviceRequest->name,
                'phone' => $serviceRequest->phone,
                'email' => $serviceRequest->email,
                'comment' => $serviceRequest->comment,
                'created_at' => $serviceRequest->created_at->toIso8601String(),
                'status' => [
                    'value' => $serviceRequest->status->value,
                    'label' => $serviceRequest->status->label(),
                ],
                'items' => $serviceRequest->items
                    ->map(fn ($item): array => [
                        'id' => $item->id,
                        'service_name' => $item->service_name,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'note' => $item->note,
                    ])
                    ->all(),
            ],
            'statuses' => array_map(
                fn (RequestStatus $status): array => [
                    'value' => $status->value,
                    'label' => $status->label(),
                ],
                RequestStatus::cases()
            ),
            'success' => session('success'),
        ]);
    }

    public function updateStatus(
        UpdateServiceRequestStatus $request,
        ServiceRequest $serviceRequest
    ): RedirectResponse {
        $status = RequestStatus::from(
            $request->validated('status')
        );

        $serviceRequest->status = $status;
        $serviceRequest->save();

        return to_route('admin.requests.show', [
            'serviceRequest' => $serviceRequest->id,
        ])->with('success', 'Статус заявки обновлён.');
    }
}
