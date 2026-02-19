'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Lock, User, Eye, EyeOff, Chrome, Github, Phone, MapPin, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    sex: '',
    country: '',
    city: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.sex) newErrors.sex = 'Sex is required'
    if (!formData.country) newErrors.country = 'Country is required'
    if (!formData.city) newErrors.city = 'City is required'
    if (!formData.phone) newErrors.phone = 'Phone number is required'

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        // Note: Extra fields (sex, phone, etc.) are captured in UI but might need schema update to be stored.
        // Assuming the backend handles them or we just send name/email/pass for now.
        // If better-auth supports extra fields in metadata or similar, they should be passed here.
      })

      if (error) {
        toast.error(error.message || "Failed to create account")
        setErrors(prev => ({ ...prev, email: error.message || "Registration failed" }))
        setIsLoading(false)
        return
      }

      setIsSuccess(true)
      toast.success("Account created successfully!")
      setTimeout(() => {
        router.push('/app')
      }, 1000)

    } catch (err) {
      console.error(err)
      toast.error("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, sex: value }))
    if (errors.sex) {
      setErrors(prev => ({ ...prev, sex: '' }))
    }
  }

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true)
      const { data, error } = await authClient.signIn.social({
        provider: provider,
        callbackURL: '/app'
      })

      if (error) {
        toast.error(error.message || `Failed to sign in with ${provider}`)
        setIsLoading(false)
      }
    } catch (err) {
      console.error(err)
      toast.error("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <Spinner className="size-12 text-primary" />
        <h2 className="text-xl font-medium text-foreground">
          Creating your account...
        </h2>
      </div>
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
            Create an account
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Join Rare today to discover your unique style
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`pl-10 ${errors.firstName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`pl-10 ${errors.lastName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            {/* Contact & Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sex">Sex</Label>
                <Select onValueChange={handleSelectChange} value={formData.sex} disabled={isLoading}>
                  <SelectTrigger className={errors.sex ? 'border-red-500 focus:ring-red-500' : ''}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sex && <p className="text-xs text-red-500">{errors.sex}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555)..."
                    value={formData.phone}
                    onChange={handleChange}
                    className={`pl-10 ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <div className="relative group">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="country"
                    name="country"
                    placeholder="USA"
                    value={formData.country}
                    onChange={handleChange}
                    className={`pl-10 ${errors.country ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.country && <p className="text-xs text-red-500">{errors.country}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="city"
                    name="city"
                    placeholder="NY"
                    value={formData.city}
                    onChange={handleChange}
                    className={`pl-10 ${errors.city ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Spinner className="h-4 w-4 text-white" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-11" type="button" disabled={isLoading} onClick={() => handleSocialSignIn('google')}>
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline" className="h-11" type="button" disabled={isLoading} onClick={() => handleSocialSignIn('github')}>
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center px-0">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
