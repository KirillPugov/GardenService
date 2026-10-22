
import { Head, Link } from '@inertiajs/react';

import ServiceForm from '@/components/admin/service-form';
import type {
    Category,
    Service,
} from '@/components/admin/service-form';

import AdminLayout from '@/layouts/admin-layout';
import { index as servicesIndex } from '@/routes/admin/services';

type Props = {
    service: Service;
    categories: Category[];
};

export default function ServiceEdit({
    service,
    categories,
}: Props) {
    return (
        <AdminLayout>
            <Head title={`Редактирование: ${service.name} — StepGarden`} />

            <div className="mx-auto max-w-3xl">
                <Link
                    href={servicesIndex.url()}
                    className="text-sm text-green-700 hover:underline"
                >
                    ← Все услуги
                </Link>

                <h1 className="mt-6 text-3xl font-bold">
                    Редактирование услуги
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    URL: /services/{service.slug}
                </p>

                <div className="mt-8">
                    <ServiceForm
                        key={service.id}
                        categories={categories}
                        service={service}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
