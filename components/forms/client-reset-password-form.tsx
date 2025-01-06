"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from 'lucide-react'
import { useState } from "react"
import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import { resetPasswordAction } from "@/app/actions"
import { FormMessage, Message } from "@/components/form-message"

export function ClientResetPasswordForm({ message }: { message: Message | null }) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)

    const validatePasswords = () => {
        if (password.length < 8) {
            setError('Password must be at least 8 characters long')
            return false
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return false
        }
        setError(null)
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validatePasswords()) return

        const form = e.target as HTMLFormElement
        form.submit()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your new password"
                            required
                            className="pr-10"
                            autoComplete="new-password"
                            aria-describedby="password-requirements"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">
                                {showPassword ? 'Hide password' : 'Show password'}
                            </span>
                        </Button>
                    </div>
                    <p
                        id="password-requirements"
                        className="text-xs text-muted-foreground"
                    >
                        Password must be at least 8 characters long
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your new password"
                            required
                            className="pr-10"
                            autoComplete="new-password"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">
                                {showConfirmPassword ? 'Hide password' : 'Show password'}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>

            {error && (
                <FormMessage
                    message={{
                        message: error
                    }}
                />
            )}

            {message && <FormMessage message={message} />}

            <SubmitButton
                formAction={resetPasswordAction}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            >
                Reset Password
            </SubmitButton>

            <div className="space-y-4 text-sm text-muted-foreground">
                <p>Your new password must:</p>
                <ul className="list-disc pl-4 space-y-2">
                    <li>Be at least 8 characters long</li>
                    <li>Include both lowercase and uppercase letters</li>
                    <li>Include at least one number</li>
                    <li>Not be the same as your previous password</li>
                </ul>
            </div>
        </form>
    )
}
