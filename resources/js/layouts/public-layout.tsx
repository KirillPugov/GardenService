import { Link } from '@inertiajs/react';
import { index as servicesIndex } from '@/actions/App/Http/Controllers/Public/ServiceController';
import type { PropsWithChildren } from 'react';

export default function PublicLayout({
    children,
}: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col bg-white text-slate-900">
            <header className="border-b border-slate-200">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
                    <Link
                        href={servicesIndex()}
                        className="text-xl font-bold"
                    >
                        StepGarden
                    </Link>

                    <nav aria-label="Основная навигация">
                        <Link
                            href={servicesIndex()}
                            className="text-sm font-medium hover:text-green-700"
                        >
                            Услуги
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
                {children}
            </main>

            <footer className="border-t border-slate-200 py-6">
                <div className="mx-auto max-w-6xl px-4 text-sm text-slate-500">
                    © StepGarden
                </div>
            </footer>
        </div>
    );
}
