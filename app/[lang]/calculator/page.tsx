'use client';


import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import SavingsCalculator from '@/components/savings-calculator'
import { useAuthentication } from '@/lib/auth';
import { useLocalization } from '@/lib/dictionary';
import { use } from 'react';
import LoadingSpinner from '@/components/loading-spinner';


interface PageProps {
    params: Promise<{
        lang: string;
    }>;
}

export default function CalculatorPage({ params }: PageProps) {
    const { lang } = use(params);
    const { user, isLoading: authLoading } = useAuthentication();
    const { dictionary, error: dictionaryError } = useLocalization(lang);

    if (authLoading || !dictionary || dictionaryError) {
        return (
            <LoadingSpinner />
        );
    }

    if (!user) {
        redirect('/')
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-700 w-full">
            <Header view="calculator" dict={dictionary} lang={lang} isAuthenticated />
            <div className="container py-10 space-y-8">
                <SavingsCalculator isAuthenticated={true} dict={dictionary} lang={lang} />
            </div>
        </div>
    )
}

