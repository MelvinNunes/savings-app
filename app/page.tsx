import { getSession } from '@/lib/auth'
import { AuthForm } from '@/components/auth-form'
import SavingsCalculator from '@/components/savings-calculator'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default async function Page() {
  const session = await getSession()

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="container py-10 space-y-8">
        {session ? (
          <SavingsCalculator isAuthenticated={true} />
        ) : (
          <div className="max-w-md mx-auto space-y-6">
            <AuthForm />
            <Card>
              <CardContent className="pt-6">
                <Button variant="secondary" className="w-full" asChild>
                  <a href="/home">Continue without login</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

