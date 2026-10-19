<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
       public function up(): void
    {
        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
            ->nullable()
            ->constrained()
            ->nullOnDelete();

            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();

            $table->text('comment')->nullable();
            $table->string('status')->default('new');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'created_at']);
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('service_requests');
    }
};
