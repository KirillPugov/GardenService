
import { Head, Link } from '@inertiajs/react';

import ServiceForm from '@/components/admin/service-form';
import type { Category } from '@/components/admin/service-form';
import AdminLayout from '@/layouts/admin-layout';
import { index as servicesIndex } from '@/routes/admin/services';

type Props = {
    categories: Category[];
};

export default function ServiceCreate({ categories }: Props) {
    return (
        <AdminLayout>
            <Head title="Новая услуга — StepGarden" />

            <div className="mx-auto max-w-3xl">
                <Link
                    href={servicesIndex.url()}
                    className="text-sm text-green-700 hover:underline"
                >
                    ← Все услуги
                </Link>

                <h1 className="mb-8 mt-6 text-3xl font-bold">
                    Создание услуги
                </h1>

                <ServiceForm categories={categories} />
            </div>
        </AdminLayout>
    );
}