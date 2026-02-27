'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Email is required')
      return
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const { error: resetError } = await authClient.forgetPassword({
        email,
        redirectTo: '/auth/reset-password'
      })

      if (resetError) {
        toast.error(resetError.message || "Failed to send reset email")
        setError(resetError.message || "Failed to send reset email")
        setIsLoading(false)
        return
      }

      setIsSuccess(true)
      toast.success("Reset email sent!")
    } catch (err) {
      toast.error("An unexpected error occurred")
      setError("An unexpected error occurred")
    } finally {
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
          <CardHeader className="space-y-1 px-0 text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Check your email
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              We&apos;ve sent a password reset link to <strong className="font-medium text-foreground">{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <p className="text-sm text-muted-foreground text-center mb-6">
              Didn&apos;t receive the email? Check your spam folder or try again with a different email address.
            </p>
            <Button 
              variant="outline" 
              className="w-full h-11"
              onClick={() => setIsSuccess(false)}
            >
              Try again
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center px-0">
            <Link 
              href="/auth/sign-in" 
              className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
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
            Enter your email and we&apos;ll send you a link to reset your password
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
                  autoComplete="email"
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
                  Sending...
                </span>
              ) : (
                'Send reset link'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center px-0">
          <Link 
            href="/auth/sign-in" 
            className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
