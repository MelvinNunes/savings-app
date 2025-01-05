'use client'


import { Sparkles } from 'lucide-react'
import AuthSheet from './auth-sheet'

interface UpgradeBannerProps {
    lang: string
    dict: any
}

export function UpgradeBanner({ lang, dict }: UpgradeBannerProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-background/0 backdrop-blur-sm p-4">
            <div className="container flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-violet-500" />
                    <p className="text-sm text-muted-foreground">
                        {dict.savings.upgradeBanner.text}
                    </p>
                </div>
                <AuthSheet lang={lang} dict={dict} isHeader={false} />
            </div>
        </div>
    )
}

