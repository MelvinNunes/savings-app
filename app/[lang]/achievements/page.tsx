'use client'

import { Achievements } from "@/components/achievements"
import { Header } from "@/components/header";
import LoadingSpinner from "@/components/loading-spinner";
import { Reminders } from "@/components/reminders"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetAllUserChallenges } from "@/data/challenges";
import { useAuthentication } from "@/lib/auth";
import { useLocalization } from "@/lib/dictionary";
import { redirect } from "next/navigation";
import { use, useEffect, useState } from "react";

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

    useEffect(() => {
        if (user) {
            setIsLoadingUserChallenges(true);
            useGetAllUserChallenges(user.id).then((challenges) => {
                setUserChallenges(challenges);
            }).finally(() => {
                setIsLoadingUserChallenges(false);
            });
        }
    }, [user]);

    if (authLoading || !dictionary || dictionaryError || isLoadingUserChallenges) {
        return (
            <LoadingSpinner />
        );
    }

    if (!user) {
        redirect('/')
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            <Header isAuthenticated={!!user} dict={dictionary} lang={lang} />
            <div className="container mx-auto px-4 py-10 space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                    <Achievements challenges={userChallenges} />
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                            <CardDescription>
                                Customize your savings experience
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Reminders />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}