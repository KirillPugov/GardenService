<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        $services = Service::query()
            ->select([
                'id',
                'category_id',
                'name',
                'slug',
                'short_description',
                'price_from',
            ])
            ->with('category:id,name')
            ->whereHas('category')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn (Service $service): array => [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
                'description' => $service->short_description,
                'price_from' => $service->price_from,
                'category' => $service->category->name,
            ]);

        return Inertia::render('public/services/index', [
            'services' => $services,
        ]);
    }

    public function show(Service $service): Response
{
    $service->load('category:id,name');

    abort_if(
        ! $service->is_active || $service->category === null,
        404
    );

    return Inertia::render('public/services/show', [
        'service' => [
            'id' => $service->id,
            'name' => $service->name,
            'slug' => $service->slug,
            'short_description' => $service->short_description,
            'description' => $service->description,
            'price_from' => $service->price_from,
            'category' => $service->category->name,
        ],
    ]);
}
}
