import SavingsCalculator from '@/components/savings-calculator'
import { getSession } from '@/lib/auth'
import { getDictionary } from '@/lib/dictionary'

export default async function Page({
  params: { lang }
}: {
  params: { lang: string }
}) {
  const dict = await getDictionary(lang)
  const session = await getSession()

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="container py-10 space-y-8">
        <SavingsCalculator isAuthenticated={session !== null} lang={lang} dict={dict} />
      </div>
    </div>
  )
}

