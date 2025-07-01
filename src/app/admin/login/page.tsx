import { Suspense } from 'react'
import { LoginForm } from '@/components/forms/login-form'
import {
  Card,
  CardContent,
} from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Terminbuchung Admin
          </h2>
        </div>

        <Card>
          <CardContent>
            <Suspense fallback={<div>Lädt...</div>}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
