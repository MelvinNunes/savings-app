import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { ChallengeDetails } from '@/components/challenge-details'
import { notFound } from 'next/navigation'
import LoadingSpinner from '@/components/loading-spinner'
import { useAuthentication } from '@/lib/auth'
import { useLocalization } from '@/lib/dictionary'
import { use, useEffect, useState } from 'react'
import { useGetChallengeById } from '@/data/challenges'

interface PageProps {
    params: Promise<{
        lang: string;
        id: string
    }>;
}

export default async function ChallengePage({ params }: PageProps) {
    const { lang, id } = use(params);
    const { dictionary, error: dictionaryError } = useLocalization(lang);
    const { user, isLoading: authLoading } = useAuthentication();
    const [challenge, setChallenge] = useState()

    if (authLoading || !dictionary || dictionaryError) {
        return (
            <LoadingSpinner />
        );
    }

    if (!user) {
        redirect('/')
    }


    useEffect(() => {
        useGetChallengeById(id).then((challenge) => {
            if (!challenge) {
                notFound()
            }
            setChallenge(challenge)
        })
    }, [id])

    return (
        <div className="min-h-screen flex flex-col bg-slate-100">
            <Header dict={dictionary} lang={lang} isAuthenticated={true} />
            <main className="flex-1">
                <div className="container max-w-screen-2xl py-10">
                    {challenge && <ChallengeDetails challenge={challenge} dict={dictionary} />}
                </div>
            </main>
        </div>
    )
}

