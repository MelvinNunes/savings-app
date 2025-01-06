import { forgotPasswordAction } from "@/app/actions"
import { FormMessage, Message } from "@/components/form-message"
import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>
}) {
  const searchParams = await props.searchParams

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="-ml-2"
              asChild
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to sign in</span>
              </Link>
            </Button>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Reset Password
              </CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                autoFocus
                className="w-full"
              />
            </div>

            <FormMessage message={searchParams} />

            <div className="space-y-4">
              <SubmitButton
                formAction={forgotPasswordAction}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              >
                Send Reset Link
              </SubmitButton>

              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link
                  href="/"
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

