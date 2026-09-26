import type { Metadata } from 'next'
import { AuthForm } from '@/components/auth-form'

export const metadata: Metadata = {
  title: 'Crear cuenta — Textiles Reyes',
}

export default function RegistroPage() {
  return <AuthForm mode="register" />
}
