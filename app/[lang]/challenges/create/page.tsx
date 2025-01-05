'use client'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { useLocalization } from '@/lib/dictionary'
import { use } from 'react'
import { useAuthentication } from '@/lib/auth'
import LoadingSpinner from '@/components/loading-spinner'
import { CreateChallengeForm } from '@/components/forms/create-challenge-form'

interface PageProps {
    params: Promise<{
        lang: string;
    }>;
}

export default function CreateChallengePage({ params }: PageProps) {
    const { lang } = use(params);
    const { dictionary, error: dictionaryError } = useLocalization(lang);
    const { user, isLoading: authLoading } = useAuthentication();

    if (authLoading || !dictionary || dictionaryError) {
        return (
            <LoadingSpinner />
        );
    }

    if (!user) {
        redirect('/')
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-100">
            <Header isAuthenticated={true} dict={dictionary} lang={lang} />
            <main className="flex-1">
                <div className="container max-w-screen-2xl py-10">
                    <div className="max-w-2xl mx-auto">
                        <CreateChallengeForm dict={dictionary} />
                    </div>
                </div>
            </main>
        </div>
    )
}

