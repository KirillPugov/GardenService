
import { Head, Link } from '@inertiajs/react';
import { show as requestShow } from '@/routes/admin/requests';
import AdminLayout from '@/layouts/admin-layout';

type RequestStatus = 'new' | 'in_progress' | 'done' | 'cancelled';

type ServiceRequest = {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    status: {
        value: RequestStatus;
        label: string;
    };
    items_count: number;
    created_at: string;
};

type PaginatedRequests = {
    data: ServiceRequest[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

type Props = {
    requests: PaginatedRequests;
};

const statusClasses: Record<RequestStatus, string> = {
    new: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-amber-100 text-amber-800',
    done: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

function formatDate(date: string): string {
    return new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(date));
}

export default function RequestsIndex({ requests }: Props) {
    return (
        <AdminLayout>
            <Head title="Заявки — StepGarden Admin" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Заявки
                </h1>

                <p className="mt-2 text-slate-500">
                    Всего заявок: {requests.total}
                </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="border-b bg-slate-50 text-slate-600">
                        <tr>
                            <th className="px-5 py-4">ID</th>
                            <th className="px-5 py-4">Клиент</th>
                            <th className="px-5 py-4">Телефон</th>
                            <th className="px-5 py-4">Услуг</th>
                            <th className="px-5 py-4">Статус</th>
                            <th className="px-5 py-4">Дата</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {requests.data.map((request) => (
                            <tr
                                key={request.id}
                                className="hover:bg-slate-50"
                            >
                                <td className="px-5 py-4">
                                    #{request.id}
                                </td>

                                <td className="px-5 py-4 font-medium">
                                    <Link
                                    href={requestShow.url({ serviceRequest: request.id })}
                                    className="text-green-700 hover:underline">
                                        {request.name}
                                    </Link>
                                </td>

                                <td className="px-5 py-4">
                                    {request.phone}
                                </td>

                                <td className="px-5 py-4">
                                    {request.items_count}
                                </td>

                                <td className="px-5 py-4">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClasses[request.status.value]}`}
                                    >
                                        {request.status.label}
                                    </span>
                                </td>

                                <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                                    {formatDate(request.created_at)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {requests.data.length === 0 && (
                    <p className="p-10 text-center text-slate-500">
                        Заявок пока нет.
                    </p>
                )}
            </div>

            {requests.last_page > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                        Страница {requests.current_page} из {requests.last_page}
                    </div>

                    <div className="flex gap-3">
                        {requests.prev_page_url && (
                            <Link
                                href={requests.prev_page_url}
                                className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-slate-100"
                            >
                                Назад
                            </Link>
                        )}

                        {requests.next_page_url && (
                            <Link
                                href={requests.next_page_url}
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
