<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('request_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('service_request_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('service_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->string('service_name');
            $table->decimal('price', 10, 2)->nullable();

            $table->unsignedInteger('quantity')->default(1);
            $table->text('note')->nullable();

            $table->timestamps();

            $table->index(['service_request_id', 'service_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('request_items');
    }
};