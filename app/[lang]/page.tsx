import SavingsCalculator from '@/components/savings-calculator'
import { getUser } from '@/lib/auth';
import { getDictionary } from '@/lib/dictionary'

interface PageProps {
    params: {
        lang: string;
    };
}

export default async function Page({ params }: PageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang)
    const user = await getUser()

    console.log(user)

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="container py-10 space-y-8">
                <SavingsCalculator isAuthenticated={user ? true : false} lang={lang} dict={dict} />
            </div>
        </div>
    )
}

