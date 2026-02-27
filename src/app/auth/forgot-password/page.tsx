'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'

export default function ForgotPasswordPage() {
  // Ensure this page is rebuilt
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const validateForm = () => {
    if (!email) {
      setError('Email is required')
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email')
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError('')

    try {
      const { data, error } = await authClient.forgetPassword({
        email: email,
        redirectTo: "/auth/reset-password", // Ensure this route exists or will be handled
      })

      if (error) {
        toast.error(error.message || "Failed to send reset email")
        setError(error.message || "Failed to send reset email")
        setIsLoading(false)
        return
      }

      setIsSuccess(true)
      toast.success("Reset link sent!")

    } catch (err) {
      console.error(err)
      toast.error("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="space-y-1 px-0">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Check your email
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              We have sent a password reset link to <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <p className="text-sm text-muted-foreground mb-6">
              Did not receive the email? Check your spam folder or try again.
            </p>
            <Button
                variant="outline"
                className="w-full h-11"
                onClick={() => {
                    setIsSuccess(false)
                    setIsLoading(false)
                }}
            >
              Try another email
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center px-0">
            <Link href="/auth/sign-in" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="space-y-1 px-0">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Forgot password?
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            No worries, we'll send you reset instructions.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError('')
                  }}
                  className={`pl-10 h-11 ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
              )}
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Spinner className="h-4 w-4 text-white" />
                  Sending link...
                </span>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center px-0">
          <Link href="/auth/sign-in" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
