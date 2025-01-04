'use client';

import { use, useEffect, useState } from 'react';
import SavingsCalculator from '@/components/savings-calculator';
import { useAuthentication } from '@/lib/auth';
import { useLocalization } from '@/lib/dictionary';
import LoadingSpinner from '@/components/loading-spinner';
import { Dashboard } from '@/components/dashboard';
import Link from 'next/link';
import { PiggyBank } from 'lucide-react';
import { Header } from '@/components/header';
import { SavingsChallenge } from '@/types/savings';
import { useGetAllUserChallenges } from '@/data/challenges';

interface PageProps {
    params: Promise<{
        lang: string;
    }>;
}


export default function Page({ params }: PageProps) {
    const { lang } = use(params);
    const { dictionary, error: dictionaryError } = useLocalization(lang);
    const { user, isLoading: authLoading } = useAuthentication();

    const { data: userChallenges, isFetching: isLoadingUserChallenges } = useGetAllUserChallenges(user?.id || '', true);

    if (authLoading || !dictionary || dictionaryError) {
        return (
            <LoadingSpinner />
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            <Header view={'dashboard'} isAuthenticated={!!user} dict={dictionary} lang={lang} />
            <div className="container mx-auto px-4 py-10 space-y-8">
                {
                    user ?
                        <Dashboard
                            challenges={userChallenges || []}
                            isLoadingChallenges={isLoadingUserChallenges}
                            dict={dictionary}
                        /> :
                        <SavingsCalculator
                            isAuthenticated={!!user}
                            lang={lang}
                            dict={dictionary}
                        />
                }
            </div>
        </div>
    );
}