<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Public\ServiceRequestController;

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
    


require __DIR__.'/settings.php';
