<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'phone' => [
                'required',
                'string',
                'min:7',
                'max:30',
            ],

            'email' => [
                'nullable',
                'email',
                'max:255',
            ],

            'comment' => [
                'nullable',
                'string',
                'max:5000',
            ],

            'items' => [
                'required',
                'array',
                'min:1',
                'max:20',
            ],

            'items.*' => [
                'required',
                'array:service_id,quantity,note',
            ],

            'items.*.service_id' => [
                'required',
                'integer',
                'distinct',
                Rule::exists('services', 'id')
                    ->where('is_active', true)
                    ->withoutTrashed(),
            ],

            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
                'max:100',
            ],

            'items.*.note' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Выберите хотя бы одну услугу.',
            'items.min' => 'Выберите хотя бы одну услугу.',
            'items.max' => 'В одной заявке можно выбрать не более 20 услуг.',
            'items.*.service_id.exists' => 'Выбранная услуга недоступна.',
            'items.*.service_id.distinct' => 'Услуга не должна повторяться.',
            'items.*.quantity.min' => 'Количество должно быть больше нуля.',
        ];
    }
}
