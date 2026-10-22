<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceRequest;
use App\Http\Requests\Admin\UpdateServiceRequest;
use App\Models\Category;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;


class ServiceController extends Controller
{
    public function index(): Response
    {
        $services = Service::query()
            ->with('category:id,name')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->paginate(10)
            ->through(fn (Service $service): array => [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
                'category' => $service->category?->name,
                'price_from' => $service->price_from,
                'is_active' => $service->is_active,
                'sort_order' => $service->sort_order,
            ]);

        return Inertia::render('admin/services/index', [
            'services' => $services,
            'success' => session('success'),
        ]);
    }

    public function create(): Response
{
         $categories = Category::query()
        ->orderBy('sort_order')
        ->orderBy('name')
        ->get(['id', 'name']);

    return Inertia::render('admin/services/create', [
        'categories' => $categories,
    ]);
}

    public function store(StoreServiceRequest $request): RedirectResponse
{
    $data = $request->validated();

    $baseSlug = Str::slug($data['name']) ?: 'service';
    $slug = $baseSlug;
    $suffix = 2;

    while (Service::withTrashed()->where('slug', $slug)->exists()) {
        $slug = "{$baseSlug}-{$suffix}";
        $suffix++;
    }

    Service::create([
        ...$data,
        'slug' => $slug,
    ]);

    return to_route('admin.services.index')
        ->with('success', 'Услуга успешно создана.');
}


public function edit(Service $service): Response
{
    $categories = Category::query()
        ->orderBy('sort_order')
        ->orderBy('name')
        ->get(['id', 'name']);

    return Inertia::render('admin/services/edit', [
        'service' => $service->only([
            'id',
            'name',
            'slug',
            'category_id',
            'short_description',
            'description',
            'price_from',
            'sort_order',
            'is_active',
        ]),
        'categories' => $categories,
    ]);
}

public function update(
    UpdateServiceRequest $request,
    Service $service
): RedirectResponse {
    $service->update($request->validated());

    return to_route('admin.services.index')
        ->with('success', 'Услуга успешно обновлена.');
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


public function destroy(Service $service): RedirectResponse
{
    $service->delete();

    return to_route('admin.services.index')
        ->with('success', 'Услуга удалена.');
}


public function trashed(): Response
{
    $services = Service::onlyTrashed()
        ->with('category:id,name')
        ->orderByDesc('deleted_at')
        ->paginate(10)
        ->through(fn (Service $service): array => [
            'id' => $service->id,
            'name' => $service->name,
            'slug' => $service->slug,
            'category' => $service->category?->name,
            'deleted_at' => $service->deleted_at->toIso8601String(),
        ]);

    return Inertia::render('admin/services/trashed', [
        'services' => $services,
        'success' => session('success'),
    ]);
}

public function restore(Service $service): RedirectResponse
{
    abort_unless($service->trashed(), 404);

    $service->restore();

    return to_route('admin.services.trashed')
        ->with('success', 'Услуга успешно восстановлена.');
}



}
