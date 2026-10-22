
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

import AdminLayout from '@/layouts/admin-layout';
import {
    index as servicesIndex,
    restore as servicesRestore,
} from '@/routes/admin/services';

type TrashedService = {
    id: number;
    name: string;
    slug: string;
    category: string | null;
    deleted_at: string;
};

type PaginatedServices = {
    data: TrashedService[];
    total: number;
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

type Props = {
    services: PaginatedServices;
    success: string | null;
};

function formatDate(date: string): string {
    return new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(date));
}

export default function TrashedServices({
    services,
    success,
}: Props) {
    const [restoringId, setRestoringId] = useState<number | null>(null);

    function restoreService(id: number) {
        if (restoringId !== null) {
            return;
        }

        setRestoringId(id);

        router.patch(
            servicesRestore.url({ service: id }),
            {},
            {
                preserveScroll: true,
                onFinish: () => setRestoringId(null),
            },
        );
    }

    return (
        <AdminLayout>
            <Head title="Корзина услуг — StepGarden" />

            <div className="mb-8">
                <Link
                    href={servicesIndex.url()}
                    className="text-sm text-green-700 hover:underline"
                >
                    ← Все услуги
                </Link>

                <h1 className="mt-6 text-3xl font-bold">
                    Корзина услуг
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Удалённых услуг: {services.total}
                </p>
            </div>

            {success && (
                <div
                    role="status"
                    className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                >
                    {success}
                </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="border-b bg-slate-50 text-slate-600">
                        <tr>
                            <th className="px-5 py-4">Услуга</th>
                            <th className="px-5 py-4">Категория</th>
                            <th className="px-5 py-4">Дата удаления</th>
                            <th className="px-5 py-4">Действия</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {services.data.map((service) => (
                            <tr key={service.id}>
                                <td className="px-5 py-4">
                                    <p className="font-medium">
                                        {service.name}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {service.slug}
                                    </p>
                                </td>

                                <td className="px-5 py-4">
                                    {service.category ?? 'Без категории'}
                                </td>

                                <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                                    {formatDate(service.deleted_at)}
                                </td>

                                <td className="px-5 py-4">
                                    <button
                                        type="button"
                                        disabled={restoringId !== null}
                                        onClick={() =>
                                            restoreService(service.id)
                                        }
                                        className="font-medium text-green-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {restoringId === service.id
                                            ? 'Восстановление...'
                                            : 'Восстановить'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {services.data.length === 0 && (
                    <div className="p-10 text-center">
                        <p className="font-medium">
                            Корзина пуста
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            Удалённых услуг пока нет.
                        </p>
                    </div>
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
