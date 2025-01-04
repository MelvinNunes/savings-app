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

interface AuthSheetProps {
    lang: string
    dict: any
    isHeader: boolean
}

export default function AuthSheet({ dict, lang, isHeader }: AuthSheetProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                    {isHeader ? dict.auth.signUpWithEmail : dict.savings.upgradeBanner.button}
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
    )
}