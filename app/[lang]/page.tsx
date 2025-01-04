'use client';

import { use } from 'react';
import SavingsCalculator from '@/components/savings-calculator';
import { useAuthentication } from '@/lib/auth';
import { useLocalization } from '@/lib/dictionary';
import LoadingSpinner from '@/components/loading-spinner';
import { Dashboard } from '@/components/dashboard';

interface PageProps {
    params: Promise<{
        lang: string;
    }>;
}


export default function Page({ params }: PageProps) {
    const { lang } = use(params);
    const { dictionary, error: dictionaryError } = useLocalization(lang);
    const { user, isLoading: authLoading } = useAuthentication();

    if (authLoading || !dictionary || dictionaryError) {
        return (
            <LoadingSpinner />
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            <div className="container mx-auto px-4 py-10 space-y-8">
                <SavingsCalculator
                    isAuthenticated={!!user}
                    lang={lang}
                    dict={dictionary}
                />
            </div>
        </div>
    );
}