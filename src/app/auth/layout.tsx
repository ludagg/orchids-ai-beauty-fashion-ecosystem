import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      {/* Left Side - Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white relative overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black z-0" />
        <div className="absolute inset-0 opacity-20 z-0"
             style={{
               backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
               backgroundSize: '40px 40px'
             }}
        />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-2xl font-serif font-bold tracking-tight">
            Rare
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium leading-relaxed">
              &ldquo;Fashion is not something that exists in dresses only. Fashion is in the sky, in the street, fashion has to do with ideas, the way we live, what is happening.&rdquo;
            </p>
            <footer className="text-sm text-zinc-400">Coco Chanel</footer>
          </blockquote>
        </div>

        <div className="relative z-10 text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Rare Inc. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 lg:p-10 relative bg-background">
        <div className="absolute top-6 left-6 lg:top-10 lg:left-10">
           <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
}
