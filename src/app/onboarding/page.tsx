'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { updateProfile, updatePreferences, completeOnboarding } from './actions'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Camera, Check, Upload, Ruler, Weight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const INTERESTS_OPTIONS = [
  { id: 'Mode', label: 'Mode', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
  { id: 'Beauté', label: 'Beauté', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  { id: 'Soins', label: 'Soins', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { id: 'Coiffure', label: 'Coiffure', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
  { id: 'Maquillage', label: 'Maquillage', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  { id: 'Skincare', label: 'Skincare', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
]

const STYLE_OPTIONS = [
  { id: 'Casual', label: 'Casual', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  { id: 'Chic', label: 'Chic', color: 'bg-stone-100 text-stone-700 dark:bg-stone-900/30 dark:text-stone-300' },
  { id: 'Streetwear', label: 'Streetwear', color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-300' },
  { id: 'Elegant', label: 'Élégant', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' },
  { id: 'Minimalist', label: 'Minimaliste', color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300' },
  { id: 'Colorful', label: 'Coloré', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' },
]

const BUDGET_OPTIONS = [
  { id: 'under_20', label: 'Moins de 20€' },
  { id: '20_50', label: '20€ – 50€' },
  { id: '50_100', label: '50€ – 100€' },
  { id: '100_plus', label: '100€+' },
]

const BODY_TYPE_OPTIONS = [
  { id: 'hourglass', label: 'Sablier (X)' },
  { id: 'pear', label: 'Poire (A)' },
  { id: 'apple', label: 'Pomme (O)' },
  { id: 'rectangle', label: 'Rectangle (H)' },
  { id: 'inverted_triangle', label: 'Triangle Inversé (V)' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // State
  const [profileData, setProfileData] = useState<{
    dateOfBirth: Date | undefined
    gender: string
    location: string
    image: string
  }>({
    dateOfBirth: undefined,
    gender: '',
    location: '',
    image: ''
  })

  const [interests, setInterests] = useState<string[]>([])
  const [style, setStyle] = useState<string[]>([])
  const [budget, setBudget] = useState('')
  const [fitData, setFitData] = useState({
    height: '',
    weight: '',
    bodyType: ''
  })

  // Computed properties
  const isFashionSelected = interests.includes('Mode')

  const handleNext = async () => {
    setLoading(true)
    try {
      if (step === 1) {
        // Save Profile
        if (!profileData.dateOfBirth || !profileData.gender || !profileData.location) {
          toast.error("Please fill in all required fields")
          setLoading(false)
          return
        }
        await updateProfile({
            dateOfBirth: profileData.dateOfBirth.toISOString(),
            gender: profileData.gender,
            location: profileData.location,
            image: profileData.image || undefined
        })
      } else if (step === 2) {
        // Save Interests
        await updatePreferences({ interests })
      } else if (step === 3) {
        // Save Style
        await updatePreferences({ style })
      } else if (step === 4) {
        // Save Budget
         await updatePreferences({ budget })
         if (!isFashionSelected) {
             await completeOnboarding()
             router.push('/app')
             return
         }
      } else if (step === 5) {
         // Save Fit
         await updatePreferences({
             height: fitData.height ? parseInt(fitData.height) : undefined,
             weight: fitData.weight,
             bodyType: fitData.bodyType
         })
         await completeOnboarding()
         router.push('/app')
         return
      }

      setStep(prev => prev + 1)
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = async () => {
      if (step >= 2) {
           setLoading(true)
           try {
               if (step === 4 && !isFashionSelected) {
                   await completeOnboarding()
                   router.push('/app')
                   return
               }
               if (step === 5) {
                   await completeOnboarding()
                   router.push('/app')
                   return
               }
               setStep(prev => prev + 1)
           } finally {
               setLoading(false)
           }
      }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleInterest = (id: string) => {
      setInterests(prev => {
          if (prev.includes(id)) return prev.filter(i => i !== id)
          return [...prev, id]
      })
  }

  const selectAllInterests = () => {
      if (interests.length === INTERESTS_OPTIONS.length) {
          setInterests([])
      } else {
          setInterests(INTERESTS_OPTIONS.map(i => i.id))
      }
  }

  const toggleStyle = (id: string) => {
    setStyle(prev => {
        if (prev.includes(id)) return prev.filter(i => i !== id)
        return [...prev, id]
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
        <Card className="border-none shadow-none bg-transparent">
             <CardHeader className="px-0">
                 <CardTitle className="text-2xl font-bold">
                     {step === 1 && "Basic Profile"}
                     {step === 2 && "Your Interests"}
                     {step === 3 && "Your Style"}
                     {step === 4 && "Your Budget"}
                     {step === 5 && "Fit & Morphology"}
                 </CardTitle>
                 <CardDescription>
                     {step === 1 && "Let's get to know you better."}
                     {step === 2 && "Select topics you are interested in."}
                     {step === 3 && "What describes your style best?"}
                     {step === 4 && "What is your average budget per purchase?"}
                     {step === 5 && "Help us find the perfect fit for you."}
                 </CardDescription>
             </CardHeader>

             <CardContent className="px-0 space-y-4">
                 {/* Step 1: Basic Profile */}
                 {step === 1 && (
                     <div className="space-y-4">
                         <div className="flex flex-col items-center gap-4">
                             <Avatar className="w-24 h-24">
                                 <AvatarImage src={profileData.image} />
                                 <AvatarFallback className="text-2xl">
                                     <Camera className="w-8 h-8 text-muted-foreground" />
                                 </AvatarFallback>
                             </Avatar>
                             <div className="flex items-center gap-2">
                                <Label htmlFor="image-upload" className="cursor-pointer text-sm font-medium text-primary hover:underline">
                                    Upload Photo
                                </Label>
                                <Input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                             </div>
                         </div>

                         <div className="space-y-2">
                             <Label>Date of Birth</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !profileData.dateOfBirth && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {profileData.dateOfBirth ? format(profileData.dateOfBirth, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={profileData.dateOfBirth}
                                        onSelect={(date) => setProfileData(prev => ({ ...prev, dateOfBirth: date }))}
                                        initialFocus
                                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                    />
                                </PopoverContent>
                             </Popover>
                         </div>

                         <div className="space-y-2">
                             <Label>Gender</Label>
                             <Select onValueChange={(val) => setProfileData(prev => ({ ...prev, gender: val }))} value={profileData.gender}>
                                 <SelectTrigger>
                                     <SelectValue placeholder="Select gender" />
                                 </SelectTrigger>
                                 <SelectContent>
                                     <SelectItem value="Homme">Male</SelectItem>
                                     <SelectItem value="Femme">Female</SelectItem>
                                     <SelectItem value="Non-binaire">Non-binary</SelectItem>
                                     <SelectItem value="Préfère ne pas préciser">Prefer not to say</SelectItem>
                                 </SelectContent>
                             </Select>
                         </div>

                         <div className="space-y-2">
                             <Label>City / Location</Label>
                             <Input
                                placeholder="Paris, France"
                                value={profileData.location}
                                onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                             />
                         </div>
                     </div>
                 )}

                 {/* Step 2: Interests */}
                 {step === 2 && (
                     <div className="grid grid-cols-2 gap-3">
                         <div
                            className={cn(
                                "col-span-2 p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between",
                                interests.length === INTERESTS_OPTIONS.length
                                    ? "border-primary bg-primary/5"
                                    : "border-transparent bg-secondary hover:bg-secondary/80"
                            )}
                            onClick={selectAllInterests}
                         >
                             <span className="font-medium">Tout (All)</span>
                             {interests.length === INTERESTS_OPTIONS.length && <Check className="w-4 h-4 text-primary" />}
                         </div>
                         {INTERESTS_OPTIONS.map((option) => {
                             const isSelected = interests.includes(option.id)
                             return (
                                 <div
                                     key={option.id}
                                     className={cn(
                                         "p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-center aspect-square",
                                         isSelected
                                             ? "border-primary bg-primary/5"
                                             : "border-transparent bg-secondary hover:bg-secondary/80"
                                     )}
                                     onClick={() => toggleInterest(option.id)}
                                 >
                                     <span className={cn("text-sm font-semibold", isSelected && "text-primary")}>
                                         {option.label}
                                     </span>
                                     {isSelected && <Check className="w-4 h-4 text-primary absolute top-2 right-2" />}
                                 </div>
                             )
                         })}
                     </div>
                 )}

                 {/* Step 3: Style */}
                 {step === 3 && (
                     <div className="grid grid-cols-2 gap-3">
                         {STYLE_OPTIONS.map((option) => {
                             const isSelected = style.includes(option.id)
                             return (
                                 <div
                                     key={option.id}
                                     className={cn(
                                         "p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-center aspect-square",
                                         isSelected
                                             ? "border-primary bg-primary/5"
                                             : "border-transparent bg-secondary hover:bg-secondary/80"
                                     )}
                                     onClick={() => toggleStyle(option.id)}
                                 >
                                     <span className={cn("text-sm font-semibold", isSelected && "text-primary")}>
                                         {option.label}
                                     </span>
                                     {isSelected && <Check className="w-4 h-4 text-primary absolute top-2 right-2" />}
                                 </div>
                             )
                         })}
                     </div>
                 )}

                 {/* Step 4: Budget */}
                 {step === 4 && (
                     <div className="space-y-3">
                         {BUDGET_OPTIONS.map((option) => {
                             const isSelected = budget === option.id
                             return (
                                 <div
                                     key={option.id}
                                     className={cn(
                                         "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between",
                                         isSelected
                                             ? "border-primary bg-primary/5"
                                             : "border-transparent bg-secondary hover:bg-secondary/80"
                                     )}
                                     onClick={() => setBudget(option.id)}
                                 >
                                     <span className="font-medium">{option.label}</span>
                                     {isSelected && <Check className="w-4 h-4 text-primary" />}
                                 </div>
                             )
                         })}
                     </div>
                 )}

                 {/* Step 5: Fit & Morphology */}
                 {step === 5 && (
                     <div className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                 <Label>Height (cm)</Label>
                                 <div className="relative">
                                     <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                     <Input
                                        type="number"
                                        placeholder="170"
                                        className="pl-10"
                                        value={fitData.height}
                                        onChange={(e) => setFitData(prev => ({ ...prev, height: e.target.value }))}
                                     />
                                 </div>
                             </div>
                             <div className="space-y-2">
                                 <Label>Weight (Optional)</Label>
                                 <div className="relative">
                                     <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                     <Input
                                        type="text"
                                        placeholder="60kg"
                                        className="pl-10"
                                        value={fitData.weight}
                                        onChange={(e) => setFitData(prev => ({ ...prev, weight: e.target.value }))}
                                     />
                                 </div>
                             </div>
                         </div>

                         <div className="space-y-2">
                             <Label>Body Type</Label>
                             <div className="grid grid-cols-1 gap-2">
                                 {BODY_TYPE_OPTIONS.map((option) => {
                                     const isSelected = fitData.bodyType === option.id
                                     return (
                                         <div
                                             key={option.id}
                                             className={cn(
                                                 "p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-between",
                                                 isSelected
                                                     ? "border-primary bg-primary/5"
                                                     : "border-transparent bg-secondary hover:bg-secondary/80"
                                             )}
                                             onClick={() => setFitData(prev => ({ ...prev, bodyType: option.id }))}
                                         >
                                             <span className="text-sm font-medium">{option.label}</span>
                                             {isSelected && <Check className="w-4 h-4 text-primary" />}
                                         </div>
                                     )
                                 })}
                             </div>
                         </div>
                     </div>
                 )}
             </CardContent>

             <CardFooter className="flex justify-between px-0 pt-6">
                 {step === 1 ? (
                     <Button variant="ghost" disabled>Back</Button>
                 ) : (
                     <Button variant="ghost" onClick={handleBack} disabled={loading}>Back</Button>
                 )}

                 <div className="flex gap-2">
                     {step >= 2 && (
                         <Button variant="ghost" onClick={handleSkip} disabled={loading}>Skip</Button>
                     )}
                     <Button onClick={handleNext} disabled={loading}>
                         {step === 5 || (step === 4 && !isFashionSelected) ? 'Finish' : 'Next'}
                     </Button>
                 </div>
             </CardFooter>
        </Card>
        </motion.div>
      </div>
    </div>
  )
}
