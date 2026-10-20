<?php

namespace App\Http\Requests;

use App\Enums\RequestStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceRequestStatus extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can(
            'update',
            $this->route('serviceRequest')
        ) ?? false;
    }

    public function rules(): array
    {
        return [
            'status' => [
                'required',
                Rule::enum(RequestStatus::class),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Выберите статус заявки.',
            'status.enum' => 'Указан недопустимый статус.',
        ];
    }
}
