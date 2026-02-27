'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const validateEmail = (email: string) => {
    if (!email) {
      setError('Email is required')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email')
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail(email)) return
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsSubmitted(true)
      toast.success("Check your email for reset instructions")
    } catch (err) {
      toast.error("Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="space-y-1 px-0 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Check your email
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              We&apos;ve sent password reset instructions to<br />
              <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="text-sm text-muted-foreground text-center space-y-4">
              <p>
                Didnt receive the email? Check your spam folder, or{' '}
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-primary hover:underline font-medium"
                >
                  try another email address
                </button>
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center px-0">
            <Link 
              href="/auth/sign-in" 
              className="text-sm font-medium text-primary hover:underline flex items-center gap-2"
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
            No worries, we&apos;ll send you reset instructions
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
                  autocomplete="email"
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
                'Reset password'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center px-0">
          <Link 
            href="/auth/sign-in" 
            className="text-sm font-medium text-primary hover:underline flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
