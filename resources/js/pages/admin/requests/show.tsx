
import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import AdminLayout from '@/layouts/admin-layout';
import { index as requestsIndex } from '@/routes/admin/requests';
import { updateStatus } from '@/actions/App/Http/Controllers/Admin/ServiceRequestController';

type RequestStatus =
    | 'new'
    | 'in_progress'
    | 'done'
    | 'cancelled';

type StatusOption = {
    value: RequestStatus;
    label: string;
};

type RequestItem = {
    id: number;
    service_name: string;
    quantity: number;
    price: string | null;
    note: string | null;
};

type ServiceRequest = {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    comment: string | null;
    created_at: string;
    status: StatusOption;
    items: RequestItem[];
};

type Props = {
    request: ServiceRequest;
    statuses: StatusOption[];
    success: string | null;
};

const statusClasses: Record<RequestStatus, string> = {
    new: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-amber-100 text-amber-800',
    done: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

function formatPrice(price: string | null): string {
    if (price === null) {
        return 'По договорённости';
    }

    return `от ${new Intl.NumberFormat('ru-RU', {
        maximumFractionDigits: 2,
    }).format(Number(price))} ֏`;
}

function formatDate(date: string): string {
    return new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'long',
        timeStyle: 'short',
    }).format(new Date(date));
}

function StatusForm({
    id,
    status,
    statuses,
}: {
    id: number;
    status: RequestStatus;
    statuses: StatusOption[];
}) {
    const {
        data,
        setData,
        patch,
        processing,
        errors,
    } = useForm<{ status: RequestStatus }>({
        status,
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        patch(updateStatus.url({ serviceRequest: id }), {
            preserveScroll: true,
        });
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label
                    htmlFor="request-status"
                    className="block text-sm font-medium"
                >
                    Статус заявки
                </label>

                <select
                    id="request-status"
                    value={data.status}
                    disabled={processing}
                    onChange={(event) =>
                        setData(
                            'status',
                            event.target.value as RequestStatus,
                        )
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                >
                    {statuses.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {errors.status && (
                    <p
                        role="alert"
                        className="mt-2 text-sm text-red-600"
                    >
                        {errors.status}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={processing || data.status === status}
                className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {processing ? 'Сохраняем...' : 'Сохранить статус'}
            </button>
        </form>
    );
}

export default function RequestShow({
    request,
    statuses,
    success,
}: Props) {
    return (
        <AdminLayout>
            <Head title={`Заявка #${request.id} — StepGarden`} />

            <div className="mx-auto max-w-4xl">
                <Link
                    href={requestsIndex.url()}
                    className="text-sm text-green-700 hover:underline"
                >
                    ← Все заявки
                </Link>

                <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Заявка #{request.id}
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Создана {formatDate(request.created_at)}
                        </p>
                    </div>

                    <span
                        className={`rounded-full px-4 py-2 text-sm font-medium ${
                            statusClasses[request.status.value]
                        }`}
                    >
                        {request.status.label}
                    </span>
                </div>

                {success && (
                    <div
                        role="status"
                        className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800"
                    >
                        {success}
                    </div>
                )}

                <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="text-xl font-semibold">
                        Управление заявкой
                    </h2>

                    <div className="mt-5">
                        <StatusForm
                            key={`${request.id}-${request.status.value}`}
                            id={request.id}
                            status={request.status.value}
                            statuses={statuses}
                        />
                    </div>
                </section>

                <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="text-xl font-semibold">
                        Контактные данные
                    </h2>

                    <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm text-slate-500">
                                Имя клиента
                            </dt>
                            <dd className="mt-1 font-medium">
                                {request.name}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm text-slate-500">
                                Телефон
                            </dt>
                            <dd className="mt-1">
                                <a
                                    href={`tel:${request.phone.replace(/[^+\d]/g, '')}`}
                                    className="font-medium text-green-700 hover:underline"
                                >
                                    {request.phone}
                                </a>
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm text-slate-500">
                                Email
                            </dt>
                            <dd className="mt-1">
                                {request.email ?? 'Не указан'}
                            </dd>
                        </div>
                    </dl>

                    {request.comment && (
                        <div className="mt-6 border-t border-slate-100 pt-5">
                            <h3 className="font-medium">
                                Комментарий клиента
                            </h3>

                            <p className="mt-2 whitespace-pre-line text-slate-600">
                                {request.comment}
                            </p>
                        </div>
                    )}
                </section>

                <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="text-xl font-semibold">
                        Выбранные услуги
                    </h2>

                    {request.items.length === 0 ? (
                        <p className="mt-5 text-slate-500">
                            Услуги не указаны.
                        </p>
                    ) : (
                        <div className="mt-5 divide-y divide-slate-100">
                            {request.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="py-5 first:pt-0 last:pb-0"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-semibold">
                                                {item.service_name}
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Количество: {item.quantity}
                                            </p>
                                        </div>

                                        <span className="font-medium">
                                            {formatPrice(item.price)}
                                        </span>
                                    </div>

                                    {item.note && (
                                        <p className="mt-3 whitespace-pre-line text-sm text-slate-600">
                                            {item.note}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <p className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500">
                        Указанные цены — стартовые цены на момент оформления.
                        Окончательная стоимость согласовывается отдельно.
                    </p>
                </section>
            </div>
        </AdminLayout>
    );
}
