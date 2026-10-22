
import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import {
    index as servicesIndex,
    store as servicesStore,
    update as servicesUpdate,
} from '@/routes/admin/services';

export type Category = {
    id: number;
    name: string;
};

export type Service = {
    id: number;
    name: string;
    slug: string;
    category_id: number;
    short_description: string | null;
    description: string | null;
    price_from: string | null;
    sort_order: number;
    is_active: boolean;
};

type Props = {
    categories: Category[];
    service?: Service;
};

export default function ServiceForm({ categories, service }: Props) {
    const isEditing = service !== undefined;

    const { data, setData, post, patch, processing, errors } = useForm({
        name: service?.name ?? '',
        category_id: service?.category_id ?? 0,
        short_description: service?.short_description ?? '',
        description: service?.description ?? '',
        price_from: service?.price_from ?? '',
        sort_order: service?.sort_order ?? 0,
        is_active: service?.is_active ?? true,
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (service) {
            patch(servicesUpdate.url({ service: service.id }));
        } else {
            post(servicesStore.url());
        }
    }

    return (
        <form
            onSubmit={submit}
            className="space-y-6 rounded-xl border border-slate-200 bg-white p-6"
        >
            <div>
                <label htmlFor="name" className="block text-sm font-medium">
                    Название услуги *
                </label>

                <input
                    id="name"
                    type="text"
                    required
                    maxLength={255}
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                />

                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
            </div>

            <div>
                <label
                    htmlFor="category_id"
                    className="block text-sm font-medium"
                >
                    Категория *
                </label>

                <select
                    id="category_id"
                    required
                    value={data.category_id}
                    onChange={(e) =>
                        setData('category_id', Number(e.target.value))
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                >
                    <option value={0} disabled>
                        Выберите категорию
                    </option>

                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                {errors.category_id && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.category_id}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="short_description"
                    className="block text-sm font-medium"
                >
                    Краткое описание
                </label>

                <textarea
                    id="short_description"
                    rows={2}
                    maxLength={255}
                    value={data.short_description}
                    onChange={(e) =>
                        setData('short_description', e.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                />

                {errors.short_description && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.short_description}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-medium"
                >
                    Полное описание
                </label>

                <textarea
                    id="description"
                    rows={5}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                />

                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.description}
                    </p>
                )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="price_from"
                        className="block text-sm font-medium"
                    >
                        Цена от (AMD)
                    </label>

                    <input
                        id="price_from"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.price_from}
                        onChange={(e) =>
                            setData('price_from', e.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                    />

                    {errors.price_from && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.price_from}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="sort_order"
                        className="block text-sm font-medium"
                    >
                        Порядок сортировки
                    </label>

                    <input
                        id="sort_order"
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={data.sort_order}
                        onChange={(e) =>
                            setData('sort_order', Number(e.target.value))
                        }
                        className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                    />

                    {errors.sort_order && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.sort_order}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={data.is_active}
                        onChange={(e) =>
                            setData('is_active', e.target.checked)
                        }
                        className="size-4 accent-green-700"
                    />

                    <span className="text-sm font-medium">
                        Услуга активна
                    </span>
                </label>

                {errors.is_active && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.is_active}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-green-700 px-6 py-2.5 font-medium text-white hover:bg-green-800 disabled:opacity-50"
                >
                    {processing
                        ? 'Сохраняем...'
                        : isEditing
                          ? 'Сохранить изменения'
                          : 'Создать услугу'}
                </button>

                <Link
                    href={servicesIndex.url()}
                    className="text-sm text-slate-600 hover:text-slate-900"
                >
                    Отмена
                </Link>
            </div>
        </form>
    );
}
