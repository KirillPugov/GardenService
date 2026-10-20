
import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { index as adminServicesIndex } from '@/routes/admin/services';
import { index as requestsIndex } from '@/routes/admin/requests';
import { index as servicesIndex } from '@/routes/services';

export default function AdminLayout({
    children,
}: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <Link
                        href={requestsIndex.url()}
                        className="text-xl font-bold"
                    >
                        StepGarden Admin
                    </Link>

                    <nav className="flex items-center gap-6 text-sm">
                        <Link
                            href={requestsIndex.url()}
                            className="font-medium text-green-700"
                        >
                            Заявки
                        </Link>

                        <Link
                            href={servicesIndex.url()}
                            className="text-slate-600 hover:text-slate-900"
                        >
                            На сайт
                        </Link>

                        <Link
                            href={adminServicesIndex.url()}
                            className="text-slate-600 hover:text-slate-900"
                        >
                            Услуги
                        </Link>
                        
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-10">
                {children}
            </main>
        </div>
    );
}
