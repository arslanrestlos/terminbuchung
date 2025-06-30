'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { adminLoginSchema, type AdminLoginInput } from '@/lib/validations'
import { toast } from 'sonner'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') || '/admin'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: AdminLoginInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError(
          'Ungültige Anmeldedaten. Bitte überprüfen Sie E-Mail und Passwort.'
        )
        toast.error('Anmeldung fehlgeschlagen', {
          description: 'E-Mail oder Passwort ist nicht korrekt.',
        })
      } else if (result?.ok) {
        toast.success('Erfolgreich angemeldet', {
          description: 'Sie werden zum Dashboard weitergeleitet...',
        })

        // Kurze Verzögerung für bessere UX
        setTimeout(() => {
          router.push(callbackUrl)
          router.refresh()
        }, 500)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(
        'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
      )
      toast.error('Anmeldung fehlgeschlagen', {
        description: 'Ein technischer Fehler ist aufgetreten.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="whitespace-normal">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-Mail-Adresse</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@beispiel.de"
            autoComplete="email"
            {...register('email')}
            disabled={isLoading}
            className={
              errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''
            }
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Passwort</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password')}
              disabled={isLoading}
              className={
                errors.password
                  ? 'border-red-500 pr-10 focus-visible:ring-red-500'
                  : 'pr-10'
              }
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
              <span className="sr-only">
                {showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
              </span>
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
      </div>

      <Button
        onClick={handleSubmit(onSubmit)}
        className="w-full"
        disabled={isLoading}
        size="lg"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? 'Anmeldung läuft...' : 'Anmelden'}
      </Button>

      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Probleme beim Anmelden?{' '}
          <a href="#" className="text-primary font-medium hover:underline">
            Support kontaktieren
          </a>
        </p>
      </div>
    </div>
  )
}
