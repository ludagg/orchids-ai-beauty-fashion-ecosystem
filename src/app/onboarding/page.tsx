'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from "@/components/ui/progress"
import { Check, ChevronRight, Upload, X, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

// Step definitions
const STEPS = [
  { id: 'profile', title: 'Basic Profile', description: 'Tell us a bit about yourself' },
  { id: 'interests', title: 'Your Interests', description: 'What are you into?' },
  { id: 'style', title: 'Your Style', description: 'Pick the looks you love' },
  { id: 'budget', title: 'Your Budget', description: 'How much do you usually spend?' },
  { id: 'fit', title: 'Fit & Morphology', description: 'Help us find the perfect fit' },
]

// Data Options
const INTERESTS = [
  { id: 'mode', label: 'Mode', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop' },
  { id: 'beaute', label: 'Beauté', image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2070&auto=format&fit=crop' },
  { id: 'soins', label: 'Soins', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop' },
  { id: 'coiffure', label: 'Coiffure', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2069&auto=format&fit=crop' },
  { id: 'maquillage', label: 'Maquillage', image: 'https://images.unsplash.com/photo-1522335789203-abd1aaccd119?q=80&w=2070&auto=format&fit=crop' },
  { id: 'skincare', label: 'Skincare', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2070&auto=format&fit=crop' },
]

const STYLES = [
  { id: 'casual', label: 'Casual', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop' },
  { id: 'chic', label: 'Chic', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000&auto=format&fit=crop' },
  { id: 'streetwear', label: 'Streetwear', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop' },
  { id: 'elegant', label: 'Élégant', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop' },
  { id: 'minimalist', label: 'Minimaliste', image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1000&auto=format&fit=crop' },
  { id: 'colorful', label: 'Coloré', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop' },
]

const BUDGETS = [
  { id: 'less_than_20', label: 'Less than 20€' },
  { id: '20_50', label: '20€ – 50€' },
  { id: '50_100', label: '50€ – 100€' },
  { id: '100_plus', label: '100€+' },
]

const MORPHOLOGIES = [
  { id: 'hourglass', label: 'Hourglass', description: 'Curvy hips and bust, narrow waist' },
  { id: 'pear', label: 'Pear', description: 'Hips wider than shoulders' },
  { id: 'apple', label: 'Apple', description: 'Broader shoulders and bust, narrower hips' },
  { id: 'rectangle', label: 'Rectangle', description: 'Shoulders, waist and hips similar width' },
  { id: 'inverted_triangle', label: 'Inverted Triangle', description: 'Shoulders wider than hips' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)

  // Form State
  const [profile, setProfile] = useState({
    image: '',
    dob: '',
    gender: '',
    city: ''
  })
  const [interests, setInterests] = useState<string[]>([])
  const [style, setStyle] = useState<string[]>([])
  const [budget, setBudget] = useState('')
  const [fit, setFit] = useState({
    height: '',
    weight: '',
    morphology: ''
  })

  // Handle file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Navigation logic
  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      // Check if we should skip Fit step
      if (currentStep === 3) { // Moving from Budget (3) to Fit (4)
        if (!interests.includes('mode') && !interests.includes('tout')) {
            // Skip Fit step if 'Mode' is not selected
            handleSubmit() // Or just finish?
            return
        }
      }
      setCurrentStep(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1)
  }

  const handleSkip = () => {
     if (currentStep < STEPS.length - 1) {
        // Check if we should skip Fit step when skipping Budget
        if (currentStep === 3) {
             if (!interests.includes('mode') && !interests.includes('tout')) {
                handleSubmit()
                return
            }
        }
        setCurrentStep(prev => prev + 1)
     } else {
        handleSubmit()
     }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          interests,
          style,
          budget,
          fit,
          completed: true
        })
      })

      if (!res.ok) throw new Error('Failed to save preferences')

      toast.success("Profile setup complete!")
      window.location.href = '/app'
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Redirecting...")
      window.location.href = '/app'
    } finally {
      setLoading(false)
    }
  }

  // Helper to toggle array selections
  const toggleSelection = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item))
    } else {
      setList([...list, item])
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">

        {/* Progress Bar */}
        <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>Step {currentStep + 1} of {STEPS.length}</span>
                <span>{STEPS[currentStep].title}</span>
            </div>
            <Progress value={((currentStep + 1) / STEPS.length) * 100} className="h-2" />
        </div>

        <Card className="border-none shadow-lg">
            <CardContent className="p-6 md:p-8">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2 text-center mb-8">
                            <h1 className="text-3xl font-bold tracking-tight">{STEPS[currentStep].title}</h1>
                            <p className="text-muted-foreground">{STEPS[currentStep].description}</p>
                        </div>

                        {/* Step 1: Profile */}
                        {currentStep === 0 && (
                            <div className="space-y-6">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-secondary group cursor-pointer">
                                        {profile.image ? (
                                            <Image src={profile.image} alt="Profile" fill className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleImageUpload}
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white text-xs font-medium">Upload Photo</span>
                                        </div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">Profile Photo (Optional)</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Date of Birth</Label>
                                        <Input
                                            type="date"
                                            value={profile.dob}
                                            onChange={e => setProfile({...profile, dob: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Gender</Label>
                                        <Select value={profile.gender} onValueChange={v => setProfile({...profile, gender: v})}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="non_binary">Non-binary</SelectItem>
                                                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>City</Label>
                                    <Input
                                        placeholder="e.g. Paris"
                                        value={profile.city}
                                        onChange={e => setProfile({...profile, city: e.target.value})}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Interests */}
                        {currentStep === 1 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {INTERESTS.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleSelection(interests, setInterests, item.id)}
                                        className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group transition-all ${interests.includes(item.id) ? 'ring-4 ring-primary ring-offset-2' : 'hover:opacity-90'}`}
                                    >
                                        <Image src={item.image} alt={item.label} fill className="object-cover transition-transform group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                                            <span className="text-white font-medium text-lg flex items-center justify-between">
                                                {item.label}
                                                {interests.includes(item.id) && <Check className="w-5 h-5 bg-primary rounded-full p-1" />}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div
                                    onClick={() => setInterests(INTERESTS.map(i => i.id))}
                                    className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer flex items-center justify-center bg-secondary border-2 border-dashed border-muted-foreground/20 hover:bg-secondary/80 transition-colors`}
                                >
                                    <span className="text-foreground font-medium">Select All</span>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Style */}
                        {currentStep === 2 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {STYLES.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleSelection(style, setStyle, item.id)}
                                        className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group transition-all ${style.includes(item.id) ? 'ring-4 ring-primary ring-offset-2' : 'hover:opacity-90'}`}
                                    >
                                        <Image src={item.image} alt={item.label} fill className="object-cover transition-transform group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                                            <span className="text-white font-medium text-lg flex items-center justify-between">
                                                {item.label}
                                                {style.includes(item.id) && <Check className="w-5 h-5 bg-primary rounded-full p-1" />}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Step 4: Budget */}
                        {currentStep === 3 && (
                            <div className="grid grid-cols-1 gap-4">
                                {BUDGETS.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => setBudget(item.id)}
                                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${budget === item.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                                    >
                                        <span className="text-lg font-medium">{item.label}</span>
                                        {budget === item.id && <Check className="w-6 h-6 text-primary" />}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Step 5: Fit */}
                        {currentStep === 4 && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Height (cm)</Label>
                                        <Input
                                            type="number"
                                            placeholder="170"
                                            value={fit.height}
                                            onChange={e => setFit({...fit, height: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Weight (kg) <span className="text-muted-foreground text-xs font-normal">(Optional)</span></Label>
                                        <Input
                                            type="number"
                                            placeholder="60"
                                            value={fit.weight}
                                            onChange={e => setFit({...fit, weight: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label>Morphology</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {MORPHOLOGIES.map(item => (
                                            <div
                                                key={item.id}
                                                onClick={() => setFit({...fit, morphology: item.id})}
                                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${fit.morphology === item.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium">{item.label}</span>
                                                    {fit.morphology === item.id && <Check className="w-4 h-4 text-primary" />}
                                                </div>
                                                <p className="text-xs text-muted-foreground">{item.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </CardContent>

            <div className="p-6 border-t bg-muted/20 flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={handleSkip}
                    disabled={loading}
                    className="text-muted-foreground"
                >
                    Skip
                </Button>

                <div className="flex items-center gap-2">
                    {currentStep > 0 && (
                        <Button variant="outline" onClick={prevStep} disabled={loading}>
                            Back
                        </Button>
                    )}
                    <Button onClick={nextStep} disabled={loading}>
                        {loading ? <span className="animate-spin mr-2">⏳</span> : null}
                        {currentStep === STEPS.length - 1 ? 'Finish' : 'Next'}
                        {!loading && currentStep < STEPS.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
                    </Button>
                </div>
            </div>
        </Card>
      </div>
    </div>
  )
}
