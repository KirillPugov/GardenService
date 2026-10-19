
import { Head, Link } from '@inertiajs/react';
import { show as serviceShow } from '@/routes/services';
import PublicLayout from '@/layouts/public-layout';

type Service = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price_from: string | null;
    category: string;
};

type Props = {
    services: Service[];
};

function formatPrice(price: string | null): string {
    if (price === null) {
        return 'Цена по договорённости';
    }

    const formatted = new Intl.NumberFormat('ru-RU', {
        maximumFractionDigits: 2,
    }).format(Number(price));

    return `от ${formatted} ֏`;
}

export default function ServicesIndex({ services }: Props) {
    return (
        <PublicLayout>
            <Head title="Услуги — StepGarden">
                <meta
                    name="description"
                    content="Услуги по садовничеству, благоустройству и помощи по дому."
                />
            </Head>

            <section>
                <h1 className="text-3xl font-bold tracking-tight">
                    Наши услуги
                </h1>

                <p className="mt-3 text-slate-600">
                    Уход за садом, благоустройство участка
                    и помощь по дому.
                </p>

                {services.length === 0 ? (
                    <p className="mt-10 text-slate-500">
                        Пока нет доступных услуг.
                    </p>
                ) : (
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => (
                            <article
                                key={service.id}
                                className="rounded-xl border border-slate-200 p-6"
                            >
                                <span className="text-xs font-medium uppercase tracking-wide text-green-700">
                                    {service.category}
                                </span>

                                <h2 className="mt-3 text-xl font-semibold">
                                    <Link
                                        href={serviceShow.url({
                                            service: service.slug,
                                        })}
                                        className="hover:text-green-700"
                                    >
                                        {service.name}
                                    </Link>
                                </h2>

                                {service.description && (
                                    <p className="mt-3 text-sm leading-6 text-slate-600">
                                        {service.description}
                                    </p>
                                )}

                                <p className="mt-6 font-semibold">
                                    {formatPrice(service.price_from)}
                                </p>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}

