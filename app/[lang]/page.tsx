// @ts-nocheck
import SavingsCalculator from '@/components/savings-calculator'
import { getDictionary } from '@/lib/dictionary'

interface PageProps {
    params: {
        lang: string;
    };
}

export default async function Page({ params }: PageProps) {
    const { lang } = params;
    const dict = await getDictionary(lang)

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            <div className="container py-10 space-y-8">
                <SavingsCalculator lang={lang} dict={dict} />
            </div>
        </div>
    )
}

