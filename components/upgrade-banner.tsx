'use client'

import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { AuthForm } from './auth-form'
import { Sparkles } from 'lucide-react'

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
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                            {dict.savings.upgradeBanner.button}
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-md">
                        <SheetHeader className="mb-4">
                            <SheetTitle>{dict.auth.title}</SheetTitle>
                            <SheetDescription>{dict.auth.description}</SheetDescription>
                        </SheetHeader>
                        <AuthForm lang={lang} dict={dict} />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}

