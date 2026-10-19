
import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { store } from '@/routes/requests';
import { index as servicesIndex } from '@/routes/services';

type Service = {
    id: number;
    name: string;
    description: string | null;
    price_from: string | null;
    category: string;
};

type RequestItemInput = {
    service_id: number;
    quantity: number;
    note: string;
};

type RequestFormData = {
    name: string;
    phone: string;
    email: string;
    comment: string;
    items: RequestItemInput[];
};

type Props = {
    services: Service[];
    success: string | null;
};

function formatPrice(price: string | null): string {
    if (price === null) {
        return 'По договорённости';
    }

    const amount = new Intl.NumberFormat('ru-RU', {
        maximumFractionDigits: 2,
    }).format(Number(price));

    return `от ${amount} ֏`;
}

export default function CreateRequest({ services, success }: Props) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        clearErrors,
        reset,
    } = useForm<RequestFormData>({
        name: '',
        phone: '',
        email: '',
        comment: '',
        items: [],
    });

    const itemErrors = errors as Record<string, string | undefined>;

    function toggleService(serviceId: number, checked: boolean) {
        if (checked) {
            setData('items', [
                ...data.items,
                {
                    service_id: serviceId,
                    quantity: 1,
                    note: '',
                },
            ]);
        } else {
            setData(
                'items',
                data.items.filter((item) => item.service_id !== serviceId),
            );
        }

        clearErrors();
    }

    function updateItem(
        serviceId: number,
        changes: Partial<RequestItemInput>,
    ) {
        setData(
            'items',
            data.items.map((item) =>
                item.service_id === serviceId
                    ? { ...item, ...changes }
                    : item,
            ),
        );
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        post(store.url(), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <PublicLayout>
            <Head title="Оставить заявку — StepGarden" />

            <div className="mx-auto max-w-3xl">
                <Link
                    href={servicesIndex.url()}
                    className="text-sm text-green-700 hover:underline"
                >
                    ← Вернуться к услугам
                </Link>

                <h1 className="mt-6 text-3xl font-bold">
                    Оставить заявку
                </h1>

                <p className="mt-3 text-slate-600">
                    Выберите необходимые услуги и оставьте контакты.
                    Мы свяжемся с вами для уточнения деталей.
                </p>

                {success && (
                    <div
                        role="status"
                        className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800"
                    >
                        {success}
                    </div>
                )}

                <form onSubmit={submit} className="mt-8 space-y-10">
                    <fieldset disabled={processing}>
                        <legend className="text-xl font-semibold">
                            1. Выберите услуги
                        </legend>

                        <p className="mt-2 text-sm text-slate-500">
                            Можно выбрать несколько услуг.
                        </p>

                        <div className="mt-5 space-y-4">
                            {services.map((service) => {
                                const index = data.items.findIndex(
                                    (item) => item.service_id === service.id,
                                );

                                const selected = index !== -1;
                                const item = selected
                                    ? data.items[index]
                                    : null;

                                return (
                                    <div
                                        key={service.id}
                                        className="rounded-xl border border-slate-200 p-5"
                                    >
                                        <label className="flex cursor-pointer items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                onChange={(event) =>
                                                    toggleService(
                                                        service.id,
                                                        event.target.checked,
                                                    )
                                                }
                                                className="mt-1 size-4 accent-green-700"
                                            />

                                            <span className="flex-1">
                                                <span className="block text-xs text-green-700">
                                                    {service.category}
                                                </span>

                                                <span className="mt-1 block font-semibold">
                                                    {service.name}
                                                </span>

                                                {service.description && (
                                                    <span className="mt-1 block text-sm text-slate-500">
                                                        {service.description}
                                                    </span>
                                                )}

                                                <span className="mt-2 block text-sm font-medium">
                                                    {formatPrice(service.price_from)}
                                                </span>
                                            </span>
                                        </label>

                                        {item && (
                                            <div className="mt-5 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-[120px_1fr]">
                                                <div>
                                                    <label
                                                        htmlFor={`quantity-${service.id}`}
                                                        className="block text-sm font-medium"
                                                    >
                                                        Количество
                                                    </label>

                                                    <input
                                                        id={`quantity-${service.id}`}
                                                        type="number"
                                                        min={1}
                                                        max={100}
                                                        value={item.quantity}
                                                        onChange={(event) =>
                                                            updateItem(service.id, {
                                                                quantity: Number(
                                                                    event.target.value,
                                                                ),
                                                            })
                                                        }
                                                        className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                                                    />

                                                    {itemErrors[`items.${index}.quantity`] && (
                                                        <p
                                                            role="alert"
                                                            className="mt-1 text-sm text-red-600"
                                                        >
                                                            {itemErrors[`items.${index}.quantity`]}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor={`note-${service.id}`}
                                                        className="block text-sm font-medium"
                                                    >
                                                        Комментарий к услуге
                                                    </label>

                                                    <input
                                                        id={`note-${service.id}`}
                                                        type="text"
                                                        value={item.note}
                                                        onChange={(event) =>
                                                            updateItem(service.id, {
                                                                note: event.target.value,
                                                            })
                                                        }
                                                        placeholder="Например, участок 300 м²"
                                                        className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                                                    />

                                                    {itemErrors[`items.${index}.note`] && (
                                                        <p
                                                            role="alert"
                                                            className="mt-1 text-sm text-red-600"
                                                        >
                                                            {itemErrors[`items.${index}.note`]}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {errors.items && (
                            <p role="alert" className="mt-3 text-sm text-red-600">
                                {errors.items}
                            </p>
                        )}
                    </fieldset>

                    <fieldset disabled={processing}>
                        <legend className="text-xl font-semibold">
                            2. Контактные данные
                        </legend>

                        <div className="mt-5 space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium">
                                    Имя *
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(event) =>
                                        setData('name', event.target.value)
                                    }
                                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                                />

                                {errors.name && (
                                    <p role="alert" className="mt-1 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium">
                                    Телефон *
                                </label>

                                <input
                                    id="phone"
                                    type="tel"
                                    required
                                    value={data.phone}
                                    onChange={(event) =>
                                        setData('phone', event.target.value)
                                    }
                                    placeholder="+374 91 123 456"
                                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                                />

                                {errors.phone && (
                                    <p role="alert" className="mt-1 text-sm text-red-600">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium">
                                    Email (необязательно)
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(event) =>
                                        setData('email', event.target.value)
                                    }
                                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                                />

                                {errors.email && (
                                    <p role="alert" className="mt-1 text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="comment" className="block text-sm font-medium">
                                    Общий комментарий
                                </label>

                                <textarea
                                    id="comment"
                                    rows={4}
                                    value={data.comment}
                                    onChange={(event) =>
                                        setData('comment', event.target.value)
                                    }
                                    placeholder="Когда вам удобно? Какие особенности участка?"
                                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                                />

                                {errors.comment && (
                                    <p role="alert" className="mt-1 text-sm text-red-600">
                                        {errors.comment}
                                    </p>
                                )}
                            </div>
                        </div>
                    </fieldset>

                    <div className="border-t border-slate-200 pt-6">
                        <p className="mb-4 text-sm text-slate-600">
                            Выбрано услуг: {data.items.length}
                        </p>

                        <button
                            type="submit"
                            disabled={processing || data.items.length === 0}
                            className="rounded-lg bg-green-700 px-6 py-3 font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? 'Отправляем...' : 'Отправить заявку'}
                        </button>
                    </div>
                </form>
            </div>
        </PublicLayout>
    );
}
