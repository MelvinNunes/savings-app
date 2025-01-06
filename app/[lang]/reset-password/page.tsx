import { Message } from "@/components/form-message"
import { ClientResetPasswordForm } from "@/components/forms/client-reset-password-form"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { KeyRound } from "lucide-react"


export default async function ResetPassword(props: {
  searchParams: Promise<Message>
}) {
  const searchParams = await props.searchParams

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Reset Password
              </CardTitle>
              <CardDescription>
                Choose a new password for your account
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ClientResetPasswordForm message={searchParams} />
        </CardContent>
      </Card>
    </div>
  )
}


