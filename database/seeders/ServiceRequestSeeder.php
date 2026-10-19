<?php
namespace Database\Seeders;

use App\Enums\RequestStatus;
use App\Models\Service;
use App\Models\ServiceRequest;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceRequestSeeder extends Seeder
{
    public function run(): void
    {
        $requests = [
            [
                'name' => 'Анна',
                'phone' => '+374 91 000 101',
                'email' => 'anna.seed@example.test',
                'comment' => 'Желательно приехать в субботу.',
                'status' => RequestStatus::New,
                'items' => [
                    [
                        'service_slug' => 'lawn-mowing',
                        'quantity' => 1,
                        'note' => 'Газон около 300 м²',
                    ],
                    [
                        'service_slug' => 'weeding',
                        'quantity' => 2,
                        'note' => 'Две большие грядки',
                    ],
                ],
            ],
            [
                'name' => 'Арман',
                'phone' => '+374 91 000 102',
                'email' => 'arman.seed@example.test',
                'comment' => 'Нужно собрать шкаф.',
                'status' => RequestStatus::InProgress,
                'items' => [
                    [
                        'service_slug' => 'furniture-assembly',
                        'quantity' => 1,
                        'note' => 'Трёхдверный шкаф',
                    ],
                ],
            ],
            [
                'name' => 'Мариам',
                'phone' => '+374 91 000 103',
                'email' => 'mariam.seed@example.test',
                'comment' => 'Работа выполнена.',
                'status' => RequestStatus::Done,
                'items' => [
                    [
                        'service_slug' => 'snow-removal',
                        'quantity' => 1,
                        'note' => 'Двор и дорожки',
                    ],
                ],
            ],
            [
                'name' => 'Давид',
                'phone' => '+374 91 000 104',
                'email' => 'david.seed@example.test',
                'comment' => 'Клиент отменил заявку.',
                'status' => RequestStatus::Cancelled,
                'items' => [
                    [
                        'service_slug' => 'curb-installation',
                        'quantity' => 1,
                        'note' => 'Бордюр вдоль дорожки',
                    ],
                ],
            ],
        ];

        DB::transaction(function () use ($requests): void {
            foreach ($requests as $data) {
                $request = ServiceRequest::updateOrCreate(
                    ['email' => $data['email']],
                    [
                        'user_id' => null,
                        'name' => $data['name'],
                        'phone' => $data['phone'],
                        'comment' => $data['comment'],
                        'status' => $data['status'],
                    ]
                );

                foreach ($data['items'] as $itemData) {
                    $service = Service::query()
                        ->where('slug', $itemData['service_slug'])
                        ->firstOrFail();

                    $request->items()->updateOrCreate(
                        ['service_id' => $service->id],
                        [
                            'service_name' => $service->name,
                            'price' => $service->price_from,
                            'quantity' => $itemData['quantity'],
                            'note' => $itemData['note'],
                        ]
                    );
                }
            }
        });
    }
}
