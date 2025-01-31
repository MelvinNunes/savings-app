'use client';

import { use, useEffect, useState } from 'react';
import SavingsCalculator from '@/components/savings-calculator';
import { useAuthentication } from '@/lib/auth';
import { useLocalization } from '@/lib/dictionary';
import LoadingSpinner from '@/components/loading-spinner';
import { Dashboard } from '@/components/dashboard';
import { Header } from '@/components/header';
import { useGetAllUserChallenges } from '@/data/challenges';
import { useAtom } from 'jotai';
import { addedChallengeCountAtom } from '@/atom/challenge-atoms';

interface PageProps {
    params: Promise<{
        lang: string;
    }>;
}


export default function Page({ params }: PageProps) {
    const { lang } = use(params);
    const { dictionary, error: dictionaryError } = useLocalization(lang);
    const { user, isLoading: authLoading } = useAuthentication();
    const [userChallenges, setUserChallenges] = useState<any[]>([]);
    const [isLoadingUserChallenges, setIsLoadingUserChallenges] = useState(true);
    const [addedChallengeCount] = useAtom(addedChallengeCountAtom)

    useEffect(() => {
        if (user) {
            setIsLoadingUserChallenges(true);
            useGetAllUserChallenges(user.id).then((challenges) => {
                setUserChallenges(challenges);
            }).finally(() => {
                setIsLoadingUserChallenges(false);
            });
        }
    }, [user, addedChallengeCount]);

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
                            challenges={userChallenges}
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