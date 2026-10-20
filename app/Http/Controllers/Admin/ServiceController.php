<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceRequest;
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

}
