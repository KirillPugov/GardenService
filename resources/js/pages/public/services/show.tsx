
import { Head, Link } from '@inertiajs/react';
import { index as servicesIndex } from '@/routes/services';
import { create as createRequest } from '@/routes/requests';
import PublicLayout from '@/layouts/public-layout';

type Service = {
    id: number;
    name: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    price_from: string | null;
    category: string;
};

type Props = {
    service: Service;
};

function formatPrice(price: string | null): string {
    if (price === null) {
        return 'Цена по договорённости';
    }

    return `от ${new Intl.NumberFormat('ru-RU', {
        maximumFractionDigits: 2,
    }).format(Number(price))} ֏`;
}

export default function ServiceShow({ service }: Props) {
    return (
        <PublicLayout>
            <Head title={`${service.name} — StepGarden`}>
                <meta
                    name="description"
                    content={
                        service.short_description ??
                        `Услуга ${service.name} — StepGarden`
                    }
                />
            </Head>

            <article className="mx-auto max-w-3xl">
                <Link
                    href={servicesIndex.url()}
                    className="text-sm text-green-700 hover:underline"
                >
                    ← Все услуги
                </Link>

                <header className="mt-8">
                    <span className="text-sm font-medium text-green-700">
                        {service.category}
                    </span>

                    <h1 className="mt-3 text-4xl font-bold tracking-tight">
                        {service.name}
                    </h1>

                    {service.short_description && (
                        <p className="mt-4 text-lg text-slate-600">
                            {service.short_description}
                        </p>
                    )}
                </header>

                <section className="mt-10 border-t border-slate-200 pt-8">
                    <h2 className="text-xl font-semibold">
                        Описание услуги
                    </h2>

                    <p className="mt-4 whitespace-pre-line leading-7 text-slate-700">
                        {service.description ?? 'Описание пока отсутствует.'}
                    </p>
                </section>

                <div className="mt-10 rounded-xl bg-slate-50 p-6">
                    <p className="text-sm text-slate-500">
                        Стоимость
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        {formatPrice(service.price_from)}
                    </p>
                    <Link
                        href={createRequest.url()}
                        className="mt-6 inline-block rounded-lg bg-green-700 px-6 py-3 font-medium text-white hover:bg-green-800">
                            Оставить заявку
                    </Link>

                    <p className="mt-2 text-sm text-slate-500">
                        Окончательная стоимость определяется после
                        уточнения объёма работ.
                    </p>
                </div>
            </article>
        </PublicLayout>
    );
}
