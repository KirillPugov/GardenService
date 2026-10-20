
import { Head, Link } from '@inertiajs/react';

import AdminLayout from '@/layouts/admin-layout';

type Service = {
    id: number;
    name: string;
    slug: string;
    category: string | null;
    price_from: string | null;
    is_active: boolean;
    sort_order: number;
};

type PaginatedServices = {
    data: Service[];
    total: number;
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

type Props = {
    services: PaginatedServices;
};

function formatPrice(price: string | null): string {
    if (price === null) {
        return 'Не указана';
    }

    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'AMD',
        maximumFractionDigits: 2,
    }).format(Number(price));
}

export default function ServicesIndex({ services }: Props) {
    return (
        <AdminLayout>
            <Head title="Услуги — StepGarden Admin" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Управление услугами
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Всего услуг: {services.total}
                </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="border-b bg-slate-50 text-slate-600">
                        <tr>
                            <th className="px-5 py-4">Название</th>
                            <th className="px-5 py-4">Категория</th>
                            <th className="px-5 py-4">Цена от</th>
                            <th className="px-5 py-4">Порядок</th>
                            <th className="px-5 py-4">Статус</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {services.data.map((service) => (
                            <tr
                                key={service.id}
                                className="hover:bg-slate-50"
                            >
                                <td className="px-5 py-4">
                                    <div className="font-medium">
                                        {service.name}
                                    </div>
                                    <div className="mt-1 text-xs text-slate-500">
                                        {service.slug}
                                    </div>
                                </td>

                                <td className="px-5 py-4">
                                    {service.category ?? 'Без категории'}
                                </td>

                                <td className="px-5 py-4">
                                    {formatPrice(service.price_from)}
                                </td>

                                <td className="px-5 py-4">
                                    {service.sort_order}
                                </td>

                                <td className="px-5 py-4">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                            service.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-slate-100 text-slate-600'
                                        }`}
                                    >
                                        {service.is_active
                                            ? 'Активна'
                                            : 'Неактивна'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {services.data.length === 0 && (
                    <p className="p-8 text-center text-slate-500">
                        Услуги пока не добавлены.
                    </p>
                )}
            </div>

            {services.last_page > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                        Страница {services.current_page} из {services.last_page}
                    </span>

                    <div className="flex gap-3">
                        {services.prev_page_url && (
                            <Link
                                href={services.prev_page_url}
                                className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-slate-100"
                            >
                                Назад
                            </Link>
                        )}

                        {services.next_page_url && (
                            <Link
                                href={services.next_page_url}
                                className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-slate-100"
                            >
                                Далее
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
