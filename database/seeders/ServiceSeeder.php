<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'category_slug' => 'garden',
                'name' => 'Стрижка газона',
                'slug' => 'lawn-mowing',
                'short_description' => 'Стрижка и уход за газоном',
                'description' => 'Покос травы, стрижка газона и базовый уход за участком.',
                'price_from' => 5000,
                'sort_order' => 10,
            ],
            [
                'category_slug' => 'garden',
                'name' => 'Обрезка деревьев',
                'slug' => 'tree-pruning',
                'short_description' => 'Санитарная и формирующая обрезка',
                'description' => 'Удаление сухих ветвей, формирование кроны и уход за плодовыми деревьями.',
                'price_from' => 8000,
                'sort_order' => 20,
            ],
            [
                'category_slug' => 'garden',
                'name' => 'Прополка грядок',
                'slug' => 'weeding',
                'short_description' => 'Удаление сорняков на грядках',
                'description' => 'Ручная прополка грядок, цветников и небольших участков.',
                'price_from' => 3000,
                'sort_order' => 30,
            ],
            [
                'category_slug' => 'landscaping',
                'name' => 'Укладка садовых дорожек',
                'slug' => 'garden-paths',
                'short_description' => 'Обустройство дорожек на участке',
                'description' => 'Подготовка основания и укладка садовых дорожек.',
                'price_from' => 15000,
                'sort_order' => 10,
            ],
            [
                'category_slug' => 'landscaping',
                'name' => 'Выравнивание участка',
                'slug' => 'land-leveling',
                'short_description' => 'Подготовка и выравнивание грунта',
                'description' => 'Выравнивание небольших участков и подготовка территории к благоустройству.',
                'price_from' => 12000,
                'sort_order' => 20,
            ],
            [
                'category_slug' => 'landscaping',
                'name' => 'Установка бордюров',
                'slug' => 'curb-installation',
                'short_description' => 'Монтаж садовых бордюров',
                'description' => 'Установка бордюров для дорожек, газонов и клумб.',
                'price_from' => 10000,
                'sort_order' => 30,
            ],
            [
                'category_slug' => 'home',
                'name' => 'Мелкий бытовой ремонт',
                'slug' => 'minor-home-repairs',
                'short_description' => 'Небольшие ремонтные работы по дому',
                'description' => 'Мелкий ремонт, установка полок и другие хозяйственные работы.',
                'price_from' => 4000,
                'sort_order' => 10,
            ],
            [
                'category_slug' => 'home',
                'name' => 'Сборка мебели',
                'slug' => 'furniture-assembly',
                'short_description' => 'Сборка и установка мебели',
                'description' => 'Сборка шкафов, столов, стеллажей и другой мебели.',
                'price_from' => 6000,
                'sort_order' => 20,
            ],
            [
                'category_slug' => 'seasonal',
                'name' => 'Уборка снега',
                'slug' => 'snow-removal',
                'short_description' => 'Очистка дорожек и территории от снега',
                'description' => 'Ручная уборка снега во дворах, на дорожках и придомовых территориях.',
                'price_from' => 5000,
                'sort_order' => 10,
            ],
            [
                'category_slug' => 'seasonal',
                'name' => 'Уборка листьев',
                'slug' => 'leaf-cleanup',
                'short_description' => 'Осенняя уборка территории',
                'description' => 'Сбор опавших листьев и очистка участка от растительных остатков.',
                'price_from' => 3500,
                'sort_order' => 20,
            ],
        ];

        foreach ($services as $data) {
            $category = Category::query()
                ->where('slug', $data['category_slug'])
                ->firstOrFail();

            $service = Service::withTrashed()->updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'category_id' => $category->id,
                    'name' => $data['name'],
                    'short_description' => $data['short_description'],
                    'description' => $data['description'],
                    'price_from' => $data['price_from'],
                    'sort_order' => $data['sort_order'],
                    'is_active' => true,
                ]
            );

            if ($service->trashed()) {
                $service->restore();
            }
        }
    }
}
