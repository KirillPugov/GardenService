<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Сад',
                'slug' => 'garden',
                'description' => 'Работы по саду и уход за участком',
                'sort_order' => 10,
            ],
            [
                'name' => 'Благоустройство',
                'slug' => 'landscaping',
                'description' => 'Обустройство территории и прилегающих участков',
                'sort_order' => 20,
            ],
            [
                'name' => 'Дом',
                'slug' => 'home',
                'description' => 'Помощь по дому и мелкие хозяйственные работы',
                'sort_order' => 30,
            ],
            [
                'name' => 'Сезонные работы',
                'slug' => 'seasonal',
                'description' => 'Уборка снега, листьев и сезонный уход за территорией',
                'sort_order' => 40,
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}