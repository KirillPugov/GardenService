<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Public\ServiceRequestController;
use App\Http\Controllers\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Admin\ServiceRequestController as AdminServiceRequestController;

Route::inertia('/', 'welcome')->name('home');
use App\Http\Controllers\Public\ServiceController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});
Route::get('/services', [ServiceController::class, 'index'])
    ->name('services.index');

Route::get('/services/{service:slug}', [ServiceController::class, 'show'])
    ->name('services.show');

Route::get('/requests/create', [ServiceRequestController::class, 'create'])
    ->name('requests.create');

Route::post('/requests', [ServiceRequestController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('requests.store');
Route::get('/services/{service:slug}', [ServiceController::class, 'show'])
        ->name('services.show');

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'verified', 'admin'])
    ->group(function (): void {
        Route::get('/check', function () {
            return response('StepGarden Admin: access granted');
        })->name('check');
        Route::get('/requests', [AdminServiceRequestController::class, 'index'])
        ->name('requests.index');
        Route::get('/requests/{serviceRequest}', [AdminServiceRequestController::class, 'show'])
        ->name('requests.show');
        Route::patch(
        '/requests/{serviceRequest}/status',
        [AdminServiceRequestController::class, 'updateStatus']
        )->name('requests.status.update');
        
        Route::get('/services', [AdminServiceController::class, 'index'])
        ->name('services.index');
        Route::get('/services/create', [AdminServiceController::class, 'create'])
        ->name('services.create');

        Route::post('/services', [AdminServiceController::class, 'store'])
        ->name('services.store');
        Route::get('/services/{service}/edit', [AdminServiceController::class, 'edit'])
        ->name('services.edit');

        Route::patch('/services/{service}', [AdminServiceController::class, 'update'])
        ->name('services.update');
        Route::delete(
        '/services/{service}',
        [AdminServiceController::class, 'destroy']
        )->name('services.destroy');
        Route::get(
            '/services/trashed',
            [AdminServiceController::class, 'trashed']
        )->name('services.trashed');

Route::patch(
    '/services/{service}/restore',
    [AdminServiceController::class, 'restore']
)->withTrashed()->name('services.restore');
    });




require __DIR__.'/settings.php';
